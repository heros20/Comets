export default function CometsLoader() {
  return (
    <span className="inline-block">
      <svg className="animate-spin" width="48" height="48" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="#fdba74"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="none"
          stroke="#e11d48"
          strokeWidth="4"
          strokeLinecap="round"
          d="M4 12a8 8 0 018-8"
        />
      </svg>
    </span>
  );
}
