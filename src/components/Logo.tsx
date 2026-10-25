import Link from "next/link";

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Maneela beranda">
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M20 2C30 2 38 8 38 20s-8 18-18 18S2 32 2 20 10 2 20 2z"
          fill="#228B22"
        />
        <path
          d="M11 28v-8.5a3.75 3.75 0 0 1 7.5 0V28m0-8.5a3.75 3.75 0 0 1 7.5 0V28"
          fill="none"
          stroke="#FEFFF1"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27 13c0-4.5 3.5-7.5 8.5-7.5 0 5-3.5 8-8.5 7.5z"
          fill="#FFDB59"
          stroke="#228B22"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="font-display font-extrabold tracking-[-0.045em] text-ink"
        style={{ fontSize: `${Math.round(size * 0.65)}px` }}
      >
        maneela
      </span>
    </Link>
  );
}
