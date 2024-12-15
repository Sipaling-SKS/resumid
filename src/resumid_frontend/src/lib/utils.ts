import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollTo(section: string, offset: number = 0) {
  const e = document.getElementById(section);
  if (!e) return;

  window.scroll({
    top: e.offsetTop - offset,
    behavior: 'smooth'
  })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

import { useEffect } from 'react';
import { useLocation } from "react-router";

export function DefaultScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

