"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Check, Palette } from "lucide-react";

// Assuming these are local components or provided by the UI library
// In a single-file preview environment, we ensure the main component is the default export.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

// Updated to match the CSS classes defined in your globals.css
const professionThemes = [
  { name: "Executive", value: "light", color: "bg-[#1B263B]", description: "Corporate & Trust" },
  { name: "Tech Modern", value: "theme-tech", color: "bg-[#38BDF8]", description: "Sleek & Agile" },
  { name: "Wellness", value: "theme-wellness", color: "bg-[#2D6A4F]", description: "Organic & Calm" },
  { name: "Academic", value: "theme-academic", color: "bg-[#660708]", description: "Heritage & Tradition" },
  { name: "Industrial", value: "theme-industrial", color: "bg-[#FFD166]", description: "Efficiency & Focus" },
  { name: "Creative", value: "theme-creative", color: "bg-[#4C1D95]", description: "Playful & Bold" },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Palette className="h-4 w-4" />
          <span>Appearance</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Industry Themes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {professionThemes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className="flex items-center gap-3 py-2 cursor-pointer"
          >
            <span
              className={`h-4 w-4 rounded-full shrink-0 ${t.color} border border-border/50`}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{t.name}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {t.description}
              </span>
            </div>
            {theme === t.value && (
              <Check className="ml-auto h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// In the Canvas environment, the primary component must be exported as default App
export default function App() {
  return (
    <div className="p-8 flex justify-center items-start min-h-screen bg-background">
      <ThemeSelector />
    </div>
  );
}