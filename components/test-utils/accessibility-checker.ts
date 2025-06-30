// components/test-utils/accessibility-checker.ts
export function checkAccessibility(element: HTMLElement) {
  console.log("Running accessibility checks on:", element)

  // Example 1: Check for alt text on images
  const images = element.querySelectorAll("img")
  images.forEach((img, index) => {
    if (!img.alt || img.alt.trim() === "") {
      console.warn(`Accessibility Warning: Image ${index} is missing alt text.`, img)
    }
  })

  // Example 2: Check for label association with inputs
  const inputs = element.querySelectorAll('input:not([type="hidden"]), select, textarea')
  inputs.forEach((input, index) => {
    const id = input.id
    if (id) {
      const label = element.querySelector(`label[for="${id}"]`)
      if (!label) {
        console.warn(`Accessibility Warning: Input ${index} with ID "${id}" is not associated with a label.`, input)
      }
    } else {
      // Fallback for inputs without ID, check for aria-label or wrapping label
      if (!input.hasAttribute("aria-label") && !input.closest("label")) {
        console.warn(`Accessibility Warning: Input ${index} is missing an ID, aria-label, or a wrapping label.`, input)
      }
    }
  })

  // Example 3: Check for sufficient color contrast (simplified, requires more complex logic)
  // This would typically involve calculating luminance values, which is beyond a simple utility.
  // Libraries like 'color-contrast-checker' or 'axe-core' are better suited for this.
  // console.warn("Color contrast checks are complex and best done with dedicated tools.");

  // Example 4: Check for interactive elements having accessible names
  const interactiveElements = element.querySelectorAll('button, a[href], [role="button"], [role="link"]')
  interactiveElements.forEach((el, index) => {
    const accessibleName = el.textContent?.trim() || el.getAttribute("aria-label") || el.getAttribute("title")
    if (!accessibleName) {
      console.warn(
        `Accessibility Warning: Interactive element ${index} is missing an accessible name (text content, aria-label, or title).`,
        el,
      )
    }
  })

  console.log("Accessibility checks completed.")
}
