import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseISO, format, isAfter, differenceInDays, addDays } from "date-fns";
import { EmploymentEntry } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(date: string | Date): string {
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    parsedDate = parseISO(date);
  } else {
    parsedDate = date;
  }
  
  return format(parsedDate, 'dd/MM/yyyy');
}

/**
 * Calculate gaps between employment periods
 * Returns an array of gap objects containing start and end dates
 */
export function calculateEmploymentGaps(employments: EmploymentEntry[]): { startDate: Date; endDate: Date; days: number }[] {
  if (!employments || employments.length < 2) return [];
  
  // Sort employments by start date (oldest first)
  const sortedEmployments = [...employments].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateA - dateB;
  });
  
  const gaps = [];
  
  // Compare each employment's start date with the previous employment's end date
  for (let i = 0; i < sortedEmployments.length - 1; i++) {
    const currentEmployment = sortedEmployments[i];
    const nextEmployment = sortedEmployments[i + 1];
    
    // Skip if either employment is missing dates
    if (!currentEmployment.endDate || !nextEmployment.startDate) continue;
    
    const currentEndDate = new Date(currentEmployment.endDate);
    const nextStartDate = new Date(nextEmployment.startDate);
    
    // Calculate gap only if there is actually a gap (end date is before start date of next job)
    if (isAfter(nextStartDate, addDays(currentEndDate, 1))) {
      const gapStartDate = addDays(currentEndDate, 1);
      const gapDays = differenceInDays(nextStartDate, gapStartDate);
      
      // Only include gaps of 31 days or longer
      if (gapDays >= 31) {
        gaps.push({
          startDate: gapStartDate,
          endDate: nextStartDate,
          days: gapDays
        });
      }
    }
  }
  
  return gaps;
}

/**
 * Check if a date string is valid
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Generate a URL slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
