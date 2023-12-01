"use client";

import * as React from "react";
import { Moon, Sun ,SunMoon} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="border-[hsl(var(--citrus-lemon))] bg-[hsl(var(--citrus-lemon))]/30"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setTheme("light")} className="max-w-[4rem]">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="max-w-[4rem]">
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="max-w-[4rem]">
          <SunMoon />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
