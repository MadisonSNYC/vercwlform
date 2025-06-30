export interface PerformanceMetrics {
  formLoadTime: number
  firstInputDelay: number
  formSubmissionTime: number
  memoryUsage?: number
  renderTime: number
}

export class PerformanceMonitor {
  private startTime = 0
  private metrics: Partial<PerformanceMetrics> = {}

  startMonitoring(): void {
    this.startTime = performance.now()
    this.metrics = {}

    // Monitor form load time
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.metrics.formLoadTime = performance.now() - this.startTime
      })
    } else {
      this.metrics.formLoadTime = 0
    }

    // Monitor first input delay
    this.monitorFirstInputDelay()

    // Monitor memory usage if available
    if ("memory" in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize
    }
  }

  private monitorFirstInputDelay(): void {
    let firstInputProcessed = false

    const handleFirstInput = (event: Event) => {
      if (!firstInputProcessed) {
        firstInputProcessed = true
        this.metrics.firstInputDelay = performance.now() - (event as any).timeStamp

        // Remove listeners after first input
        document.removeEventListener("click", handleFirstInput, true)
        document.removeEventListener("keydown", handleFirstInput, true)
        document.removeEventListener("touchstart", handleFirstInput, true)
      }
    }

    document.addEventListener("click", handleFirstInput, true)
    document.addEventListener("keydown", handleFirstInput, true)
    document.addEventListener("touchstart", handleFirstInput, true)
  }

  measureFormSubmission<T>(submitFunction: () => Promise<T>): Promise<T> {
    const startTime = performance.now()

    return submitFunction().finally(() => {
      this.metrics.formSubmissionTime = performance.now() - startTime
    })
  }

  measureRenderTime(renderFunction: () => void): number {
    const startTime = performance.now()
    renderFunction()
    const endTime = performance.now()

    this.metrics.renderTime = endTime - startTime
    return this.metrics.renderTime
  }

  getMetrics(): PerformanceMetrics {
    return {
      formLoadTime: this.metrics.formLoadTime || 0,
      firstInputDelay: this.metrics.firstInputDelay || 0,
      formSubmissionTime: this.metrics.formSubmissionTime || 0,
      memoryUsage: this.metrics.memoryUsage,
      renderTime: this.metrics.renderTime || 0,
    }
  }

  generateReport(): string {
    const metrics = this.getMetrics()

    let report = "Performance Report:\n\n"

    // Form Load Time
    report += `Form Load Time: ${metrics.formLoadTime.toFixed(2)}ms `
    if (metrics.formLoadTime > 1000) {
      report += "⚠️ SLOW\n"
    } else if (metrics.formLoadTime > 500) {
      report += "⚡ MODERATE\n"
    } else {
      report += "✅ FAST\n"
    }

    // First Input Delay
    report += `First Input Delay: ${metrics.firstInputDelay.toFixed(2)}ms `
    if (metrics.firstInputDelay > 100) {
      report += "⚠️ SLOW\n"
    } else if (metrics.firstInputDelay > 50) {
      report += "⚡ MODERATE\n"
    } else {
      report += "✅ FAST\n"
    }

    // Form Submission Time
    if (metrics.formSubmissionTime > 0) {
      report += `Form Submission Time: ${metrics.formSubmissionTime.toFixed(2)}ms `
      if (metrics.formSubmissionTime > 3000) {
        report += "⚠️ SLOW\n"
      } else if (metrics.formSubmissionTime > 1000) {
        report += "⚡ MODERATE\n"
      } else {
        report += "✅ FAST\n"
      }
    }

    // Render Time
    if (metrics.renderTime > 0) {
      report += `Render Time: ${metrics.renderTime.toFixed(2)}ms `
      if (metrics.renderTime > 16) {
        report += "⚠️ MAY CAUSE JANK\n"
      } else {
        report += "✅ SMOOTH\n"
      }
    }

    // Memory Usage
    if (metrics.memoryUsage) {
      const memoryMB = metrics.memoryUsage / (1024 * 1024)
      report += `Memory Usage: ${memoryMB.toFixed(2)}MB `
      if (memoryMB > 50) {
        report += "⚠️ HIGH\n"
      } else if (memoryMB > 20) {
        report += "⚡ MODERATE\n"
      } else {
        report += "✅ LOW\n"
      }
    }

    report += "\nRecommendations:\n"

    if (metrics.formLoadTime > 1000) {
      report += "• Optimize form initialization and reduce bundle size\n"
    }

    if (metrics.firstInputDelay > 100) {
      report += "• Reduce JavaScript execution time during page load\n"
    }

    if (metrics.formSubmissionTime > 3000) {
      report += "• Optimize form submission logic and server response time\n"
    }

    if (metrics.renderTime > 16) {
      report += "• Optimize rendering performance to maintain 60fps\n"
    }

    return report
  }
}
