// components/test-utils/performance-monitor.ts

/**
 * Measures the time taken to execute a given function.
 * @param func The function to measure.
 * @returns The execution time in milliseconds.
 */
export function measureExecutionTime(func: Function): number {
  const start = performance.now()
  func()
  const end = performance.now()
  return end - start
}

/**
 * Monitors and logs various performance metrics for a web page.
 * This is a simplified example. For more advanced monitoring, consider Web Vitals.
 */
export function monitorPagePerformance(): void {
  if (typeof window === "undefined" || !window.performance) {
    console.warn("Performance API not available in this environment.")
    return
  }

  // Navigation Timing API
  const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
  if (navigationTiming) {
    console.log("--- Navigation Timing Metrics ---")
    console.log(
      `DOM Content Loaded: ${navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart} ms`,
    )
    console.log(`Load Time: ${navigationTiming.loadEventEnd - navigationTiming.loadEventStart} ms`)
    console.log(`Time to First Byte (TTFB): ${navigationTiming.responseStart - navigationTiming.requestStart} ms`)
    console.log(
      `First Contentful Paint (FCP) - (Approximation): ${navigationTiming.responseEnd - navigationTiming.fetchStart} ms`,
    )
  }

  // Resource Timing API (e.g., for images, scripts, stylesheets)
  const resources = performance.getEntriesByType("resource")
  if (resources.length > 0) {
    console.log("\n--- Resource Loading Metrics (Top 5 by duration) ---")
    resources
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .forEach((resource) => {
        console.log(
          `- ${resource.name.substring(0, 50)}... Type: ${resource.initiatorType}, Duration: ${resource.duration.toFixed(2)} ms`,
        )
      })
  }

  // Long Tasks API (if supported)
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "longtask") {
          console.warn(`\n--- Long Task Detected ---`)
          console.warn(
            `Name: ${entry.name}, Duration: ${entry.duration.toFixed(2)} ms, Start Time: ${entry.startTime.toFixed(2)} ms`,
          )
          // You can add more details like attribution if available
        }
      }
    })
    try {
      observer.observe({ type: "longtask", buffered: true })
    } catch (e) {
      console.warn("Long Tasks API not fully supported or blocked.")
    }
  } else {
    console.warn("PerformanceObserver (Long Tasks API) not supported in this browser.")
  }

  console.log("\n--- General Performance Notes ---")
  console.log("Consider using Lighthouse or Web Vitals for more comprehensive performance audits.")
}

/**
 * Measures and logs the time taken for a specific UI render or update.
 * This is a basic example. React DevTools Profiler is more suitable for React component profiling.
 * @param name A name for the measurement.
 * @param callback The function that triggers the UI render/update.
 */
export function measureUIRenderTime(name: string, callback: () => void): void {
  const start = performance.now()
  callback()
  const end = performance.now()
  console.log(`UI Render Time for "${name}": ${(end - start).toFixed(2)} ms`)
}
