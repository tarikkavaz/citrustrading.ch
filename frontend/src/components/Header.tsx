"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import { fetchData, SERVER_IP } from "@/utils/api";
import {
  MenuItem,
  MobileMenuOpenProps
} from "@/utils/types";
import { useLocale, useTranslations } from "next-intl";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";

import Navigation from "@/components/Navigation";
import { useTheme } from "next-themes";

async function fetchNavigationData(locale: string) {
  try {
    const endpoint = `/api/menuitems/`;
    const response = await fetchData(SERVER_IP, endpoint);
    const filteredData = response.filter((item: any) => item.lang === locale);
    return { navigations: filteredData };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function Logo({ mobileMenuOpen, setMobileMenuOpen }: MobileMenuOpenProps) {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const [logoSrc, setLogoSrc] = useState('/images/logo-light.png'); 

  useEffect(() => {
    const newLogoSrc = resolvedTheme === 'light' ? '/images/logo-light.png' : '/images/logo-dark.png';
    setLogoSrc(newLogoSrc);
  }, [resolvedTheme]);

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Link
        href={`/${locale}`}
        className="text-3xl block p-3 space-y-1 leading-none no-underline rounded-md outline-none select-none"
        onClick={handleLogoClick}
      >
        <div className="flex">
          <div className="relative h-[35px] w-[35px] md:h-[100px] md:w-[100px]">
            <Image
              src="/images/citrus-logo.png"
              priority={true}
              fill={true}
              sizes="100%"
              alt="Citrus Trading"
              className=" object-cover"
              />
          </div>
          <div className="relative h-[35px] w-[150px] md:h-[100px] md:w-[450px]">
            <Image
              src={logoSrc}
              priority={true}
              fill={true}
              sizes="100%"
              alt="Citrus Trading"
              className=" object-cover"
              />
          </div>
        </div>
      </Link>
    </>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navigationData, setNavigationData] = useState<MenuItem[] | null>(null);
  const locale = useLocale();
  const t = useTranslations("Globals");
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNavigationData(locale);
      if (data) {
        setNavigationData(data.navigations);
      }
    };
    fetchData();
  }, [locale]);

  /* scrolling */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  /* scrolling */
  return (
    <>
      <Container
        as="header"
        size="fluid"
        className={`bg-background/[.8] text-foreground w-full h-50 fixed z-50 md:px-10 px-2 flex items-center justify-between backdrop-blur-md backdrop-opacity-100 ${
          isScrolled
            ? "scrolled border-b border-[hsl(var(--border))]"
            : "border-b-0 border-transparent"
        }`}
      >
        <div>
          <Logo
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        </div>
        <div>
          <Navigation
            links={navigationData || []}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        </div>
        <div className="flex gap-2">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </Container>
    </>
  );
}
