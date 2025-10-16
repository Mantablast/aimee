export default function PageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_20%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(900px_500px_at_80%_30%,rgba(217,70,239,0.2),transparent_55%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(2,6,23,1)_60%,rgba(10,10,26,1)_100%)]" />

      {/* Subtle grid (very low opacity) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "url(#grid-warp)" }}
      >
        <div className="absolute inset-0 bg-grid opacity-[0.14] mix-blend-screen" />
        <div className="absolute inset-0 bg-grid-2 opacity-[0.10] mix-blend-screen" />
      </div>

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />

      {/* SVG filters for gentle warp */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="grid-warp" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.004"
              numOctaves="2"
              seed="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.003 0.004; 0.004 0.003; 0.003 0.004"
                dur="70s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                values="6; 10; 7; 12; 6"
                dur="85s"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
