// components/test-utils/accessibility-checker.ts

/**
 * Checks for common accessibility issues in a given DOM element.
 * This is a simplified example and not a comprehensive accessibility audit tool.
 * For full accessibility testing, consider tools like axe-core.
 * @param element The DOM element to check for accessibility.
 * @returns An array of strings, each describing an accessibility issue found.
 */
export function checkAccessibility(element: HTMLElement): string[] {
  const issues: string[] = []

  // Check for missing alt text on images
  element.querySelectorAll("img").forEach((img) => {
    if (!img.alt || img.alt.trim() === "") {
      issues.push(`Image missing alt text: ${img.outerHTML.substring(0, 50)}...`)
    }
  })

  // Check for missing labels on input fields
  element
    .querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="reset"]), textarea, select',
    )
    .forEach((input) => {
      const id = input.id
      const hasLabel = id && element.querySelector(`label[for="${id}"]`)
      const hasAriaLabel = input.hasAttribute("aria-label") || input.hasAttribute("aria-labelledby")

      if (!hasLabel && !hasAriaLabel) {
        issues.push(`Input field missing a label or aria-label: ${input.outerHTML.substring(0, 50)}...`)
      }
    })

  // Check for insufficient contrast (very basic, ideally needs color analysis)
  // This is a conceptual check. Real contrast checking requires rendering and color parsing.
  // For demonstration, we'll just flag elements that might be problematic.
  element.querySelectorAll("button, a").forEach((interactiveElement) => {
    const style = window.getComputedStyle(interactiveElement)
    const backgroundColor = style.backgroundColor
    const color = style.color

    // This is a very naive check. A real check would parse RGB/HEX and calculate contrast ratio.
    // For example, if background is very light and text is also very light.
    if (
      backgroundColor &&
      color &&
      (backgroundColor.includes("255, 255, 255") || backgroundColor.includes("rgb(255, 255, 255)")) &&
      (color.includes("200, 200, 200") || color.includes("rgb(200, 200, 200)"))
    ) {
      issues.push(`Potential low contrast for interactive element: ${interactiveElement.outerHTML.substring(0, 50)}...`)
    }
  })

  // Check for non-semantic buttons (divs or spans used as buttons)
  element.querySelectorAll("div, span").forEach((el) => {
    if (el.hasAttribute("onclick") || (el.hasAttribute("role") && el.getAttribute("role") === "button")) {
      if (el.tagName !== "BUTTON") {
        issues.push(
          `Non-semantic element used as a button. Consider using <button>: ${el.outerHTML.substring(0, 50)}...`,
        )
      }
    }
  })

  // Check for missing lang attribute on html (should be on the root html element)
  if (!document.documentElement.hasAttribute("lang")) {
    issues.push("Missing `lang` attribute on the <html> element.")
  }

  return issues
}
