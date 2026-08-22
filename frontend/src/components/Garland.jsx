// Hand-drawn-style botanical garland — Flovera's signature motif.
// Used as a section divider so the "flora" in Flovera shows up as a
// structural device, not just a word in the logo.
export default function Garland({ flip = false }) {
  return (
    <div className="garland-section">
      <svg
        className={`garland${flip ? ' flip' : ''}`}
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0 24 Q 50 4, 100 24 T 200 24 T 300 24 T 400 24 T 500 24 T 600 24 T 700 24 T 800 24 T 900 24 T 1000 24 T 1100 24 T 1200 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        {Array.from({ length: 23 }).map((_, i) => {
          const x = i * 52 + 10;
          const up = i % 2 === 0;
          const y = up ? 14 : 34;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path
                d={up ? 'M0 0 C -6 -8, -2 -14, 4 -12 C 8 -10, 6 -3, 0 0 Z' : 'M0 0 C -6 8, -2 14, 4 12 C 8 10, 6 3, 0 0 Z'}
                fill="currentColor"
                opacity="0.85"
              />
              <circle cx="0" cy="0" r="2.2" fill="var(--berry)" opacity="0.9" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
