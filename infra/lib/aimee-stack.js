const path = require("node:path");

const cdk = require("aws-cdk-lib");
const { Duration, RemovalPolicy, Stack, CfnOutput, CfnParameter } = cdk;

const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const origins = require("aws-cdk-lib/aws-cloudfront-origins");
const acm = require("aws-cdk-lib/aws-certificatemanager");
const iam = require("aws-cdk-lib/aws-iam");
const lambda = require("aws-cdk-lib/aws-lambda");
const lambdaNodejs = require("aws-cdk-lib/aws-lambda-nodejs");
const route53 = require("aws-cdk-lib/aws-route53");
const targets = require("aws-cdk-lib/aws-route53-targets");
const ses = require("aws-cdk-lib/aws-ses");
const ssm = require("aws-cdk-lib/aws-ssm");
const s3 = require("aws-cdk-lib/aws-s3");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");

class AimeeStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const domainName = process.env.EXISTING_DOMAIN || "aimeej.ca";
    const wwwDomainName = `www.${domainName}`;

    const turnstileSiteKey = new CfnParameter(this, "TurnstileSiteKey", {
      type: "String",
      default: "",
      description: "Cloudflare Turnstile site key (public).",
    });

    const turnstileSecretSsmParameterName = new CfnParameter(
      this,
      "TurnstileSecretSsmParameterName",
      {
      type: "String",
      default: "/aimeej/turnstile/secret",
      description:
          "SSM Parameter Store SecureString name containing the Cloudflare Turnstile secret key.",
      }
    );

    const toEmail = new CfnParameter(this, "ToEmail", {
      type: "String",
      default: "aimeejesso@gmail.com",
      description: "Where to deliver CV requests (must be allowed by SES).",
    });

    const fromEmail = new CfnParameter(this, "FromEmail", {
      type: "String",
      default: `cv@${domainName}`,
      description: "SES verified sender identity (domain-based is best).",
    });

    const hostedZoneId = new CfnParameter(this, "HostedZoneId", {
      type: "String",
      description: `Route53 hosted zone id for ${domainName} (e.g. Z123...).`,
    });

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    siteBucket.grantRead(originAccessIdentity);

    const cvRequestFunction = new lambdaNodejs.NodejsFunction(
      this,
      "CvRequestFunction",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, "../lambda/cv-request.js"),
        handler: "handler",
        timeout: Duration.seconds(10),
        memorySize: 256,
        bundling: {
          target: "node18",
        },
        environment: {
          TURNSTILE_SECRET_SSM_PARAMETER:
            turnstileSecretSsmParameterName.valueAsString,
          TURNSTILE_EXPECTED_ACTION: "cv_request",
          TO_EMAIL: toEmail.valueAsString,
          FROM_EMAIL: fromEmail.valueAsString,
          ALLOWED_ORIGINS: cdk.Fn.join(",", [
            `https://${domainName}`,
            `https://${wwwDomainName}`,
            "http://localhost:5173",
          ]),
        },
      }
    );

    const turnstileSecretParameter =
      ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      "TurnstileSecret",
      {
        parameterName: turnstileSecretSsmParameterName.valueAsString,
        // Needed because parameterName comes from a CFN parameter (unresolved token).
        // "/aimeej/turnstile/secret" is NOT a simple name.
        simpleName: false,
      }
    );
    turnstileSecretParameter.grantRead(cvRequestFunction);

    cvRequestFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: ["*"],
      })
    );

    const cvRequestFunctionUrl = cvRequestFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: [
          `https://${domainName}`,
          `https://${wwwDomainName}`,
          "http://localhost:5173",
        ],
        // OPTIONS is handled automatically by Function URL CORS and is not a valid AllowMethods value in CFN.
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["content-type"],
        maxAge: Duration.days(1),
      },
    });

    const cvRequestFunctionUrlHost = cdk.Fn.select(
      2,
      cdk.Fn.split("/", cvRequestFunctionUrl.url)
    );
    const cvRequestFunctionOrigin = cdk.Fn.join("", [
      "https://",
      cvRequestFunctionUrlHost,
    ]);

    const contentSecurityPolicy = cdk.Fn.join("; ", [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "script-src 'self' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data: https://challenges.cloudflare.com",
      cdk.Fn.join(" ", [
        "connect-src 'self'",
        "https://challenges.cloudflare.com",
        cvRequestFunctionOrigin,
      ]),
      "frame-src https://challenges.cloudflare.com",
      "upgrade-insecure-requests",
    ]);

    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      "SecurityHeadersPolicy",
      {
        securityHeadersBehavior: {
          contentTypeOptions: { override: true },
          frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy:
              cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
            override: true,
          },
          contentSecurityPolicy: {
            contentSecurityPolicy: contentSecurityPolicy,
            override: true,
          },
          strictTransportSecurity: {
            accessControlMaxAge: Duration.days(365),
            includeSubdomains: false,
            preload: false,
            override: true,
          },
        },
        customHeadersBehavior: {
          customHeaders: [
            {
              header: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
              override: true,
            },
          ],
        },
      }
    );

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: hostedZoneId.valueAsString,
        zoneName: domainName,
      }
    );

    const mailFromDomain = `mail.${domainName}`;

    new ses.EmailIdentity(this, "SesDomainIdentity", {
      identity: ses.Identity.publicHostedZone(hostedZone),
      mailFromDomain,
    });

    new route53.TxtRecord(this, "SesSpfRecord", {
      zone: hostedZone,
      recordName: domainName,
      values: ["v=spf1 include:amazonses.com -all"],
    });

    new route53.TxtRecord(this, "DmarcRecord", {
      zone: hostedZone,
      recordName: `_dmarc.${domainName}`,
      values: ["v=DMARC1; p=none;"],
    });

    const certificate = new acm.DnsValidatedCertificate(this, "Certificate", {
      domainName,
      subjectAlternativeNames: [wwwDomainName],
      hostedZone,
      // CloudFront certificates must be in us-east-1.
      region: "us-east-1",
    });

    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      defaultRootObject: "index.html",
      domainNames: [domainName, wwwDomainName],
      certificate,
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket, { originAccessIdentity }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.seconds(0),
        },
      ],
    });

    new route53.ARecord(this, "ApexARecord", {
      zone: hostedZone,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    new route53.AaaaRecord(this, "ApexAaaaRecord", {
      zone: hostedZone,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    new route53.ARecord(this, "WwwARecord", {
      zone: hostedZone,
      recordName: wwwDomainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    new route53.AaaaRecord(this, "WwwAaaaRecord", {
      zone: hostedZone,
      recordName: wwwDomainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    const distPath = path.join(__dirname, "../../dist");

    new s3deploy.BucketDeployment(this, "DeploySite", {
      sources: [s3deploy.Source.asset(distPath)],
      destinationBucket: siteBucket,
      prune: false,
      distribution,
      distributionPaths: ["/*"],
    });

    new s3deploy.BucketDeployment(this, "DeployRuntimeConfig", {
      sources: [
        s3deploy.Source.data(
          "runtime-config.json",
          JSON.stringify(
            {
              apiUrl: cvRequestFunctionUrl.url,
              turnstileSiteKey: turnstileSiteKey.valueAsString,
            },
            null,
            2
          )
        ),
      ],
      destinationBucket: siteBucket,
      prune: false,
      cacheControl: [s3deploy.CacheControl.noCache()],
      distribution,
      distributionPaths: ["/*"],
    });

    new CfnOutput(this, "SiteUrl", {
      value: `https://${domainName}`,
    });

    new CfnOutput(this, "CvRequestApiUrl", {
      value: cvRequestFunctionUrl.url,
    });
  }
}

module.exports = { AimeeStack };
