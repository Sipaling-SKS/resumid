import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO, differenceInMonths, differenceInYears } from "date-fns";

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

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function shorten(str: string, length: number): string {
  return str && str.length > length ? str.slice(0, length).split(' ').slice(0, -1).join(' ') + "..." : str
}

export function getTextSizeClass(length: number) {
  if (length <= 30) return "text-lg";
  if (length <= 60) return "text-base";
  return "text-sm";
}

export function formatISOToDate(isoDate: string, includeTime: boolean = false) {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = includeTime
    ? {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Use 12-hour format (AM/PM); set to false for 24-hour format
    }
    : {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
  return date.toLocaleDateString('en-US', options);
}

export function formatDate(dateStr?: string) {
  if (!dateStr) return "Now";
  try {
    return format(parseISO(dateStr), "MMM yyyy");
  } catch {
    return dateStr;
  }
}

export function getPeriodLength(startStr: string, endStr?: string) {
  const start = parseISO(startStr);
  const end = endStr ? parseISO(endStr) : new Date();
  const months = differenceInMonths(end, start) + 1;
  if (months < 12) return `${months} mo${months === 1 ? "" : "s"}`;
  const years = differenceInYears(end, start);
  const remMonths = months % 12;
  return remMonths > 0
    ? `${years} yr${years === 1 ? "" : "s"} ${remMonths} mo${remMonths === 1 ? "" : "s"}`
    : `${years} yr${years === 1 ? "" : "s"}`;
}