import { useEffect, useId, useMemo, useRef, useState } from "react";

const WIDTH = 1600;
const HEIGHT = 1200;
const OVERSCAN = 180;
const SAMPLE_STEP = 92;
const SPLINE_TENSION = 0.92;
const LINE_COUNT = 17;

const LINES = Array.from({ length: LINE_COUNT }, (_, index) => {
  const progress = index / (LINE_COUNT - 1);
  const emphasis = Math.sin(progress * Math.PI);

  return {
    id: `line-${index + 1}`,
    baseY: 116 + index * 61,
    phase: progress * 0.95,
    emphasis,
    strokeWidth: 1.1 + emphasis * 1.05,
    haloWidth: 5.5 + emphasis * 4.5,
    opacity: 0.18 + emphasis * 0.3,
    haloOpacity: 0.05 + emphasis * 0.12,
  };
});

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function createSurfaceObjects() {
  const objects = [
    {
      x: randomInRange(WIDTH * 0.34, WIDTH * 0.68),
      y: randomInRange(HEIGHT * 0.34, HEIGHT * 0.66),
      radiusX: randomInRange(210, 320),
      radiusY: randomInRange(180, 280),
      height: randomInRange(118, 158),
    },
  ];

  const extraCount = 1 + Math.floor(Math.random() * 2);
  let attempts = 0;

  while (objects.length < extraCount + 1 && attempts < 12) {
    const candidate = {
      x: randomInRange(220, WIDTH - 220),
      y: randomInRange(170, HEIGHT - 160),
      radiusX: randomInRange(110, 180),
      radiusY: randomInRange(100, 165),
      height: randomInRange(42, 84),
    };

    const overlapsExistingObject = objects.some((object) => {
      const dx = candidate.x - object.x;
      const dy = candidate.y - object.y;
      return Math.hypot(dx, dy) < 240;
    });

    if (!overlapsExistingObject) {
      objects.push(candidate);
    }

    attempts += 1;
  }

  return objects;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  return prefersReducedMotion;
}

function formatPoint(x, y) {
  return `${x.toFixed(1)} ${y.toFixed(1)}`;
}

function buildSplinePath(points) {
  if (!points.length) return "";

  let path = `M ${formatPoint(points[0].x, points[0].y)}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const after = points[index + 2] ?? next;

    const controlOneX =
      current.x + ((next.x - previous.x) * SPLINE_TENSION) / 6;
    const controlOneY =
      current.y + ((next.y - previous.y) * SPLINE_TENSION) / 6;
    const controlTwoX =
      next.x - ((after.x - current.x) * SPLINE_TENSION) / 6;
    const controlTwoY =
      next.y - ((after.y - current.y) * SPLINE_TENSION) / 6;

    path += ` C ${formatPoint(controlOneX, controlOneY)}`;
    path += ` ${formatPoint(controlTwoX, controlTwoY)}`;
    path += ` ${formatPoint(next.x, next.y)}`;
  }

  return path;
}

function getSurfaceHeight(x, lineY, time, phase, emphasis, surfaceObjects) {
  const primaryObject = surfaceObjects[0];
  const primaryCenterX = primaryObject?.x ?? WIDTH * 0.58;
  const primaryRadiusX = primaryObject?.radiusX ?? 280;

  const objectLift = surfaceObjects.reduce((total, object) => {
    const dx = x - object.x;
    const dy = lineY - object.y;
    const influence = Math.exp(
      -(
        (dx * dx) / (2 * object.radiusX * object.radiusX) +
        (dy * dy) / (2 * object.radiusY * object.radiusY)
      )
    );

    return total + object.height * influence;
  }, 0);

  const backShoulder =
    42 *
    Math.exp(
      -((x - (primaryCenterX - primaryRadiusX * 0.82)) ** 2) /
        (2 * (primaryRadiusX * 1.18) * (primaryRadiusX * 1.18))
    );

  const frontDrop =
    58 *
    Math.exp(
      -((x - (primaryCenterX + primaryRadiusX * 0.6)) ** 2) /
        (2 * (primaryRadiusX * 0.92) * (primaryRadiusX * 0.92))
    );

  const foldCenter =
    primaryCenterX -
    primaryRadiusX * 0.22 +
    Math.sin(time * 0.34 + phase) * Math.max(78, primaryRadiusX * 0.42);
  const foldEnvelope =
    Math.exp(-((x - foldCenter) ** 2) / (2 * 164 * 164)) *
    (0.72 + emphasis * 0.32);
  const travelingFold =
    Math.sin((x - foldCenter) * 0.029 - time * 0.92) * 11 * foldEnvelope;

  const objectEnvelope = surfaceObjects.reduce((total, object) => {
    const dx = x - object.x;
    const dy = lineY - object.y;
    return (
      total +
      Math.exp(
        -(
          (dx * dx) / (2 * (object.radiusX * 1.5) ** 2) +
          (dy * dy) / (2 * (object.radiusY * 1.4) ** 2)
        )
      )
    );
  }, 0);

  const contourRipple =
    Math.sin(x * 0.0048 + time * 0.24 + phase * 1.8) * 7 +
    Math.sin(x * 0.0106 - time * 0.62 + phase) *
      3.8 *
      Math.min(1.2, 0.28 + objectEnvelope * 0.42);

  return objectLift + backShoulder * 0.26 - frontDrop * 0.14 + travelingFold + contourRipple;
}

function buildBlanketPath(line, time, surfaceObjects, sampleStep = SAMPLE_STEP) {
  const points = [];

  for (let x = -OVERSCAN; x <= WIDTH + OVERSCAN; x += sampleStep) {
    const subtleDrape = Math.sin((x / WIDTH) * Math.PI * 0.92 + time * 0.08) * 8.5;
    const y =
      line.baseY -
      getSurfaceHeight(x, line.baseY, time, line.phase, line.emphasis, surfaceObjects) +
      subtleDrape;

    points.push({ x, y });
  }

  return buildSplinePath(points);
}

export default function PageBackdrop({ motionLevel = "full" }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const scope = useId().replace(/:/g, "");
  const strokeId = `page-backdrop-stroke-${scope}`;
  const haloId = `page-backdrop-halo-${scope}`;
  const [surfaceObjects] = useState(() => createSurfaceObjects());
  const strokeRefs = useRef([]);
  const haloRefs = useRef([]);
  const lines = useMemo(
    () => (motionLevel === "lite" ? LINES.filter((_, index) => index % 2 === 0) : LINES),
    [motionLevel]
  );
  const sampleStep = motionLevel === "lite" ? 128 : SAMPLE_STEP;
  const shouldAnimate = !prefersReducedMotion && motionLevel !== "static";

  useEffect(() => {
    const drawFrame = (timeSeconds) => {
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const path = buildBlanketPath(line, timeSeconds, surfaceObjects, sampleStep);

        strokeRefs.current[index]?.setAttribute("d", path);
        haloRefs.current[index]?.setAttribute("d", path);
      }
    };

    drawFrame(0);

    if (!shouldAnimate || typeof window === "undefined") {
      return undefined;
    }

    let animationFrameId = 0;
    const start = window.performance.now();
    const minFrameMs = motionLevel === "lite" ? 1000 / 12 : 1000 / 24;
    let lastRenderedAt = -Infinity;

    const render = (now) => {
      if (now - lastRenderedAt >= minFrameMs) {
        drawFrame((now - start) / 1000);
        lastRenderedAt = now;
      }
      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [lines, motionLevel, sampleStep, shouldAnimate, surfaceObjects]);

  return (
    <div
      aria-hidden
      className="page-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="page-backdrop__base absolute inset-0" />
      <div className="page-backdrop__highlight absolute inset-0" />

      <svg
        className="page-backdrop__svg absolute inset-0 h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={strokeId} x1="8%" y1="16%" x2="88%" y2="80%">
            <stop offset="0%" stopColor="#8ad9ff" stopOpacity="0" />
            <stop offset="18%" stopColor="#8ad9ff" stopOpacity="0.42" />
            <stop offset="48%" stopColor="#fff4e4" stopOpacity="0.92" />
            <stop offset="78%" stopColor="#ffd38c" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffd38c" stopOpacity="0" />
          </linearGradient>

          <linearGradient id={haloId} x1="8%" y1="18%" x2="88%" y2="82%">
            <stop offset="0%" stopColor="#82cfff" stopOpacity="0" />
            <stop offset="28%" stopColor="#82cfff" stopOpacity="0.16" />
            <stop offset="52%" stopColor="#fff6ea" stopOpacity="0.26" />
            <stop offset="84%" stopColor="#ffbe72" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ffbe72" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g>
          {lines.map((line, index) => {
            const initialPath = buildBlanketPath(line, 0, surfaceObjects, sampleStep);

            return (
              <g key={line.id}>
                <path
                  ref={(node) => {
                    haloRefs.current[index] = node;
                  }}
                  d={initialPath}
                  className="page-backdrop__curve-glow"
                  stroke={`url(#${haloId})`}
                  strokeWidth={line.haloWidth}
                  opacity={line.haloOpacity}
                />
                <path
                  ref={(node) => {
                    strokeRefs.current[index] = node;
                  }}
                  d={initialPath}
                  className="page-backdrop__curve"
                  stroke={`url(#${strokeId})`}
                  strokeWidth={line.strokeWidth}
                  opacity={line.opacity}
                />
              </g>
            );
          })}
        </g>
      </svg>

      <div className="page-backdrop__vignette absolute inset-0" />
    </div>
  );
}
