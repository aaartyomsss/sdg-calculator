/**
 * Simple one-liner to slugify a string.
 * There are good libraries out there though
 */
export const slugify = (str: string) => {
  return str.toLowerCase().replace(/ /g, "-")
}
