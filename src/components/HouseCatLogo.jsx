import { Link } from "react-router-dom";

export default function HouseCatLogo() {
  return (
    <Link
      to="/"
      aria-label="Return to homepage"
      className="fixed left-5 top-5 z-[60] inline-flex select-none rounded-xl transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 cursor-pointer"
    >
      <div className="house-logo relative h-16 w-50 overflow-hidden rounded-xl">
        <svg
          viewBox="0 0 150 100"
          className="relative z-10 h-full w-full drop-shadow-[0_4px_12px_rgba(15,23,42,0.35)]"
          aria-hidden="true"
        >
          <g transform="translate(38, 0)">
            {/* roof */}
            <path
              d="M8 48 L50 12 L92 48"
              fill="#a855f7"
              stroke="#7c3aed"
              strokeWidth="6"
            />
            {/* house body */}
            <rect
              x="18"
              y="44"
              width="64"
              height="46"
              rx="8"
              fill="#0f172a"
              stroke="#1e293b"
              strokeWidth="5"
            />
            {/* door */}
            <rect
              x="42"
              y="58"
              width="16"
              height="22"
              rx="4"
              fill="#1e293b"
            />
            {/* glowing window */}
            <rect
              x="30"
              y="56"
              width="40"
              height="24"
              rx="6"
              className="house-window"
              fill="#c084fc"
            />
          </g>
        </svg>
        <div className="cat-wrapper absolute inset-y-0 right-0 z-0 flex items-center justify-end pr-3">
          <div className="cat-head">
            <div className="cat-ear cat-ear--left" />
            <div className="cat-ear cat-ear--right" />
            <div className="cat-face">
              <span className="cat-eye" />
              <span className="cat-eye" />
              <span className="cat-nose" />
              <span className="cat-whisker cat-whisker--left" />
              <span className="cat-whisker cat-whisker--right" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
