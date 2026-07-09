import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export function NetworkStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-center gap-3 text-sm font-medium shadow-lg">
      <WifiOff className="size-4" />
      <span>You're offline</span>
      <button
        onClick={() => location.reload()}
        className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30"
      >
        <RefreshCw className="size-3" /> Retry
      </button>
    </div>
  );
}
