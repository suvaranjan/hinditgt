"use client";

import type React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Home, BookOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-lg shadow-md rounded-full px-6 py-3 border  flex items-center gap-6 transition-all"
      )}
    >
      <NavItem href="/" icon={<Home className="h-4 w-4" />} label="Home" />
      <NavItem
        href="/books"
        icon={<BookOpen className="h-4 w-4" />}
        label="Books"
      />

      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-center p-2 rounded-full bg-gray-200 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      )}
    </nav>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
    >
      {icon}
      <span className="text-sm sm:inline font-xs">{label}</span>
    </Link>
  );
}
