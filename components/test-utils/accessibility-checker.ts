// components/test-utils/accessibility-checker.ts
import { axe, toHaveNoViolations } from "jest-axe"
import { expect } from "@jest/globals"

expect.extend(toHaveNoViolations)

/**
 * Runs an accessibility check on the given HTML element.
 * @param element The HTML element to check for accessibility violations.
 * @returns A promise that resolves with the axe results.
 */
export async function checkAccessibility(element: HTMLElement) {
  const results = await axe(element)
  expect(results).toHaveNoViolations()
  return results
}

/**
 * Logs accessibility violations to the console.
 * @param results The axe results object.
 */
export function logAccessibilityViolations(results: any) {
  if (results.violations.length > 0) {
    console.warn("Accessibility Violations Found:")
    results.violations.forEach((violation: any) => {
      console.warn(`  - ${violation.help} (${violation.id})`)
      violation.nodes.forEach((node: any) => {
        console.warn(`    Selector: ${node.target.join(", ")}`)
        console.warn(`    HTML: ${node.html}`)
      })
    })
  } else {
    console.log("No accessibility violations found.")
  }
}
