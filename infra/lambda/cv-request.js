const AWS = require("aws-sdk");

const ses = new AWS.SES({ apiVersion: "2010-12-01" });
const ssm = new AWS.SSM({ apiVersion: "2014-11-06" });

let cachedTurnstileSecret;
let cachedTurnstileSecretPromise;

function jsonResponse(statusCode, body, origin) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
  };

  if (origin) {
    headers["access-control-allow-origin"] = origin;
    headers["access-control-allow-headers"] = "content-type";
    headers["access-control-allow-methods"] = "POST,OPTIONS";
    headers["access-control-max-age"] = "86400";
    headers["vary"] = "Origin";
  }

  return {
    statusCode,
    headers,
    body: body == null ? "" : JSON.stringify(body),
  };
}

function stripNewlines(value) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}

function clamp(value, maxLen) {
  const str = String(value ?? "");
  return str.length > maxLen ? str.slice(0, maxLen) : str;
}

function parseAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS ?? "";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

async function getTurnstileSecret() {
  if (cachedTurnstileSecret) return cachedTurnstileSecret;
  if (cachedTurnstileSecretPromise) return cachedTurnstileSecretPromise;

  cachedTurnstileSecretPromise = (async () => {
    const inlineSecret = process.env.TURNSTILE_SECRET_KEY;
    if (inlineSecret) return inlineSecret;

    const parameterName = process.env.TURNSTILE_SECRET_SSM_PARAMETER;
    if (!parameterName) {
      throw new Error("TURNSTILE_SECRET_SSM_PARAMETER is not configured");
    }

    const result = await ssm
      .getParameter({ Name: parameterName, WithDecryption: true })
      .promise();

    const value = result?.Parameter?.Value;
    if (typeof value === "string" && value) return value;

    throw new Error("Turnstile secret is empty");
  })();

  cachedTurnstileSecret = await cachedTurnstileSecretPromise;
  return cachedTurnstileSecret;
}

async function verifyTurnstile({ secret, token, remoteip }) {
  if (!secret) throw new Error("Missing Turnstile secret");

  const params = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteip) params.set("remoteip", remoteip);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: controller.signal,
    }
  ).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    throw new Error(`Turnstile verify failed (${response.status})`);
  }

  return response.json();
}

exports.handler = async (event) => {
  const method = event?.requestContext?.http?.method ?? event?.httpMethod ?? "GET";

  const allowedOrigins = parseAllowedOrigins();
  const origin =
    event?.headers?.origin ??
    event?.headers?.Origin ??
    event?.headers?.ORIGIN ??
    "";

  const corsOrigin =
    allowedOrigins.length === 0
      ? "*"
      : allowedOrigins.includes(origin)
        ? origin
        : "";

  if (typeof event?.body === "string" && event.body.length > 20_000) {
    return jsonResponse(413, { error: "payload_too_large" }, corsOrigin);
  }

  if (method === "OPTIONS") {
    if (!corsOrigin) return { statusCode: 204, headers: {}, body: "" };
    return { statusCode: 204, headers: { "access-control-allow-origin": corsOrigin, "access-control-allow-headers": "content-type", "access-control-allow-methods": "POST,OPTIONS", "access-control-max-age": "86400", vary: "Origin" }, body: "" };
  }

  if (!corsOrigin && allowedOrigins.length > 0) {
    return jsonResponse(403, { error: "forbidden_origin" }, null);
  }

  if (method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" }, corsOrigin);
  }

  let body;
  try {
    body = event?.body ? JSON.parse(event.body) : {};
  } catch {
    return jsonResponse(400, { error: "invalid_json" }, corsOrigin);
  }

  const name = clamp(stripNewlines(body?.name), 120);
  const company = clamp(stripNewlines(body?.company), 120);
  const email = clamp(stripNewlines(body?.email), 254);
  const message = clamp(String(body?.message ?? "").trim(), 5000);
  const turnstileToken = stripNewlines(body?.turnstileToken);
  const turnstileAction = stripNewlines(body?.turnstileAction);

  if (!name || !company || !email || !message) {
    return jsonResponse(400, { error: "missing_fields" }, corsOrigin);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(400, { error: "invalid_email" }, corsOrigin);
  }

  if (!turnstileToken) {
    return jsonResponse(400, { error: "missing_captcha" }, corsOrigin);
  }

  const expectedAction = process.env.TURNSTILE_EXPECTED_ACTION ?? "cv_request";

  const remoteip =
    event?.requestContext?.http?.sourceIp ??
    (event?.headers?.["x-forwarded-for"] ?? "").split(",")[0].trim();

  let verification;
  try {
    const secret = await getTurnstileSecret();
    verification = await verifyTurnstile({ secret, token: turnstileToken, remoteip });
  } catch {
    return jsonResponse(502, { error: "captcha_unavailable" }, corsOrigin);
  }

  if (!verification?.success) {
    return jsonResponse(
      400,
      { error: "captcha_failed", codes: verification?.["error-codes"] ?? [] },
      corsOrigin
    );
  }

  if (turnstileAction && verification?.action && turnstileAction !== verification.action) {
    return jsonResponse(400, { error: "captcha_action_mismatch" }, corsOrigin);
  }

  if (verification?.action && verification.action !== expectedAction) {
    return jsonResponse(400, { error: "captcha_action_mismatch" }, corsOrigin);
  }

  const toEmail = process.env.TO_EMAIL || "aimeejesso@gmail.com";
  const fromEmail = process.env.FROM_EMAIL || toEmail;

  const subject = clamp(
    stripNewlines(`CV request from ${name} (${company})`),
    180
  );

  const bodyText = [
    "New CV request received:",
    "",
    `Name: ${name}`,
    `Company: ${company}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
    "",
    `Source IP: ${remoteip || "unknown"}`,
    `Turnstile action: ${verification?.action || "unknown"}`,
  ].join("\n");

  try {
    await ses
      .sendEmail({
        Source: fromEmail,
        Destination: { ToAddresses: [toEmail] },
        ReplyToAddresses: [email],
        Message: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: { Text: { Data: bodyText, Charset: "UTF-8" } },
        },
      })
      .promise();
  } catch {
    return jsonResponse(502, { error: "email_send_failed" }, corsOrigin);
  }

  return jsonResponse(200, { ok: true }, corsOrigin);
};
