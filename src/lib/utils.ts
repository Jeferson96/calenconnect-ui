import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, "PPP 'a las' p", { locale: es })
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

export function formatTime(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, "p", { locale: es })
  } catch (error) {
    console.error("Error formatting time:", error)
    return dateString
  }
}

/**
 * Formatea un rango de tiempo a partir de una hora de inicio y fin
 * @param startTimeString Hora de inicio en formato ISO
 * @param endTimeString Hora de fin en formato ISO
 * @returns String formateado con el rango de tiempo
 */
export function formatTimeRange(startTimeString: string, endTimeString: string): string {
  try {
    const startTime = formatTime(startTimeString)
    const endTime = formatTime(endTimeString)
    return `${startTime} - ${endTime}`
  } catch (error) {
    console.error("Error formatting time range:", error)
    return `${startTimeString} - ${endTimeString}`
  }
}
