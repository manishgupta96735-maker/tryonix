import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Images, Settings as SettingsIcon, Sparkles } from "lucide-react";

const tabs = [
  { to: "/app", icon: Home, label: "Home" },
  { to: "/history", icon: Images, label: "History" },
  { to: "/settings", icon: SettingsIcon, label: "Settings" },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-card border-t border-border px-4 pt-2 pb-4 grid grid-cols-3 gap-2 z-20">
      {tabs.map(({ to, icon: Icon, label }) => {
        const active = path === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-1 py-1 ${active ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon className="size-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen flex flex-col relative pb-28">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}

export { Sparkles };
