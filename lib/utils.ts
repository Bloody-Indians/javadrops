import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if the marketplace is currently open
 * Open hours: 10 PM - 11 PM London time
 */
export function isMarketplaceOpen(): boolean {
  const now = new Date()
  const londonTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }))
  const hours = londonTime.getHours()

  // Market is open from 10 PM to 11 PM London time
  return hours === 22
}

/**
 * Get time until marketplace opens or closes
 */
export function getMarketplaceTimeInfo(): { isOpen: boolean; timeLeft: string } {
  const now = new Date()
  const londonTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }))
  const hours = londonTime.getHours()
  const minutes = londonTime.getMinutes()

  // Market is open from 10 PM to 11 PM London time
  const isOpen = hours === 22

  let timeLeft = ""

  if (isOpen) {
    // Calculate time left until 11 PM
    const minutesLeft = 60 - minutes
    timeLeft = `${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}`
  } else {
    // Calculate time until next opening
    let hoursUntilOpen = 0
    if (hours < 22) {
      hoursUntilOpen = 22 - hours
    } else {
      hoursUntilOpen = 24 - hours + 22
    }

    if (hours === 23) {
      timeLeft = `Opens in ${hoursUntilOpen} hour${hoursUntilOpen !== 1 ? "s" : ""}`
    } else {
      timeLeft = `Opens in ${hoursUntilOpen} hour${hoursUntilOpen !== 1 ? "s" : ""}`
    }
  }

  return { isOpen, timeLeft }
}
