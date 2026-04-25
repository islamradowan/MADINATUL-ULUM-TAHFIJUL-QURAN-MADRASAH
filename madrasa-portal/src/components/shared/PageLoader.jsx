export default function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      {/* Spinning ring */}
      <div className="w-12 h-12 rounded-full border-4 border-surface-container-high border-t-primary-container animate-spin" />
      <p className="text-sm text-text-muted font-inter tracking-wide">Loading…</p>
    </div>
  );
}
