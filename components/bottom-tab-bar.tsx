// components/bottom-tab-bar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/home",        label: "List",        icon: "🛒" },
  { href: "/suggestions", label: "Suggestions", icon: "💡" },
  { href: "/settings",    label: "Settings",    icon: "⚙️"  },
];

const HIDE_ON = ["/", "/onboarding"];

export function BottomTabBar() {
  const pathname = usePathname();
  if (HIDE_ON.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-200 bg-white pb-safe">
      {TABS.map(({ href, label, icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs transition-colors ${
              active ? "text-green-600" : "text-gray-500"
            }`}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span className={active ? "font-semibold" : ""}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
