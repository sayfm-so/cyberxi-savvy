import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with conditional logic, dedupe conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Arabic-Indic digits for scores/numbers in RTL contexts. */
export const ar = (n: number | string) => Number(n).toLocaleString('ar-EG')
