import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Gop class Tailwind: class sau thang class truoc cung loai (px-2 px-4 -> px-4) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
