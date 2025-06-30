export interface AccessibilityIssue {
  type: "error" | "warning" | "info"
  element: string
  message: string
  suggestion: string
}

export class AccessibilityChecker {
  static checkForm(formElement: HTMLElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []

    // Check for labels
    const inputs = formElement.querySelectorAll("input, textarea, select")
    inputs.forEach((input, index) => {
      const id = input.getAttribute("id")
      const ariaLabel = input.getAttribute("aria-label")
      const ariaLabelledBy = input.getAttribute("aria-labelledby")

      if (id) {
        const label = formElement.querySelector(`label[for="${id}"]`)
        if (!label && !ariaLabel && !ariaLabelledBy) {
          issues.push({
            type: "error",
            element: `Input ${index + 1}`,
            message: "Input has no associated label",
            suggestion: "Add a label element with for attribute or aria-label",
          })
        }
      } else if (!ariaLabel && !ariaLabelledBy) {
        issues.push({
          type: "error",
          element: `Input ${index + 1}`,
          message: "Input has no id and no aria-label",
          suggestion: "Add an id attribute and corresponding label, or use aria-label",
        })
      }
    })

    // Check for required field indicators
    const requiredInputs = formElement.querySelectorAll("input[required], textarea[required], select[required]")
    requiredInputs.forEach((input, index) => {
      const ariaRequired = input.getAttribute("aria-required")
      if (ariaRequired !== "true") {
        issues.push({
          type: "warning",
          element: `Required input ${index + 1}`,
          message: "Required field missing aria-required attribute",
          suggestion: 'Add aria-required="true" to required fields',
        })
      }
    })

    // Check for error message associations
    const errorMessages = formElement.querySelectorAll('[class*="error"], [role="alert"]')
    if (errorMessages.length > 0) {
      errorMessages.forEach((error, index) => {
        const describedBy = formElement.querySelector(`[aria-describedby="${error.id}"]`)
        if (!describedBy && error.id) {
          issues.push({
            type: "warning",
            element: `Error message ${index + 1}`,
            message: "Error message not associated with input",
            suggestion: "Use aria-describedby to associate error messages with inputs",
          })
        }
      })
    }

    // Check for form submission feedback
    const submitButton = formElement.querySelector('button[type="submit"], input[type="submit"]')
    if (submitButton) {
      const ariaLive = formElement.querySelector("[aria-live]")
      if (!ariaLive) {
        issues.push({
          type: "info",
          element: "Form",
          message: "No aria-live region for form feedback",
          suggestion: "Add aria-live region to announce form submission status",
        })
      }
    }

    // Check color contrast (simplified check)
    const colorElements = formElement.querySelectorAll("button, .error, .success")
    colorElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element)
      const backgroundColor = styles.backgroundColor
      const color = styles.color

      // This is a simplified check - in practice, you'd use a proper contrast ratio calculator
      if (backgroundColor === "rgb(255, 255, 255)" && color === "rgb(255, 255, 255)") {
        issues.push({
          type: "error",
          element: `Element ${index + 1}`,
          message: "Insufficient color contrast",
          suggestion: "Ensure color contrast ratio meets WCAG guidelines (4.5:1 for normal text)",
        })
      }
    })

    return issues
  }

  static generateReport(issues: AccessibilityIssue[]): string {
    if (issues.length === 0) {
      return "No accessibility issues found!"
    }

    const errors = issues.filter((i) => i.type === "error")
    const warnings = issues.filter((i) => i.type === "warning")
    const info = issues.filter((i) => i.type === "info")

    let report = `Accessibility Report:\n\n`
    report += `Summary: ${errors.length} errors, ${warnings.length} warnings, ${info.length} info\n\n`

    if (errors.length > 0) {
      report += `ERRORS:\n`
      errors.forEach((issue, index) => {
        report += `${index + 1}. ${issue.element}: ${issue.message}\n`
        report += `   Suggestion: ${issue.suggestion}\n\n`
      })
    }

    if (warnings.length > 0) {
      report += `WARNINGS:\n`
      warnings.forEach((issue, index) => {
        report += `${index + 1}. ${issue.element}: ${issue.message}\n`
        report += `   Suggestion: ${issue.suggestion}\n\n`
      })
    }

    if (info.length > 0) {
      report += `INFO:\n`
      info.forEach((issue, index) => {
        report += `${index + 1}. ${issue.element}: ${issue.message}\n`
        report += `   Suggestion: ${issue.suggestion}\n\n`
      })
    }

    return report
  }
}
