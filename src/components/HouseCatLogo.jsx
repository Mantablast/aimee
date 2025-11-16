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
          <g transform="translate(38, 0) translate(0, 90) scale(0.9) translate(0, -90)">
            {/* single house shape (roof + body) */}
            <path
              d="M8 48 L50 12 L92 48 L92 90 L8 90 Z"
              fill="#0f172a"
              stroke="#1e293b"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* door */}
            <rect
              x="52"
              y="63"
              width="16"
              height="22"
              rx="4"
              fill="#334e78ff"
            />
            {/* glowing windows */}
            <rect
              x="33"
              y="32"
              width="12"
              height="15"
              rx="4"
              className="house-window"
              fill="#b7b142ff"
            />
            <rect
              x="57"
              y="32"
              width="12"
              height="15"
              rx="4"
              className="house-window"
              fill="#b7b142ff"
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
