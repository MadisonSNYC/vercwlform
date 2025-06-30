"use client"

// components/test-utils/performance-monitor.ts
// This utility is for development only and should not be used in production.
// It helps monitor application performance metrics.

export interface PerformanceMetrics {
  formLoadTime?: number
  firstInputDelay?: number
  formSubmissionTime?: number
  memoryUsage?: number
  renderTime?: number
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  domContentLoaded?: number
  loadTime?: number
  customMetrics?: Record<string, number>
}

type PerformanceMetric = {
  name: string
  value: number
  unit: string
  description: string
}

type PerformanceReport = {
  timestamp: string
  metrics: PerformanceMetric[]
}

let performanceObserver: PerformanceObserver | null = null

export class PerformanceMonitor {
  private startTime = 0
  private marks: Map<string, number>
  private metrics: Partial<PerformanceMetrics> = {}

  constructor() {
    this.marks = new Map()
  }

  startMonitoring(componentName: string): void {
    this.startTime = startPerformanceMonitor(componentName)
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

  /**
   * Starts a performance measurement.
   * @param markName A unique name for the performance mark.
   */
  start(markName: string): void {
    if (process.env.NODE_ENV !== "production" && typeof performance !== "undefined") {
      this.marks.set(markName, performance.now())
      console.log(`Performance mark '${markName}' started.`)
    }
  }

  /**
   * Ends a performance measurement and logs the duration.
   * @param markName The name of the performance mark to end.
   * @returns The duration in milliseconds, or undefined if the mark was not started.
   */
  end(markName: string): number | undefined {
    if (process.env.NODE_ENV !== "production" && typeof performance !== "undefined") {
      const startTime = this.marks.get(markName)
      if (startTime !== undefined) {
        const duration = performance.now() - startTime
        this.marks.delete(markName)
        console.log(`Performance mark '${markName}' ended. Duration: ${duration.toFixed(2)} ms`)
        return duration
      } else {
        console.warn(`Performance mark '${markName}' was not started.`)
      }
    }
    return undefined
  }

  /**
   * Measures and logs the time taken by a function.
   * @param func The function to measure.
   * @param funcName An optional name for the function (defaults to function name).
   * @returns The result of the executed function.
   */
  measureFunction<T>(func: (...args: any[]) => T, funcName?: string): T {
    if (process.env.NODE_ENV !== "production" && typeof performance !== "undefined") {
      const name = funcName || func.name || "anonymousFunction"
      this.start(name)
      const result = func()
      this.end(name)
      return result
    }
    return func() // Execute without measurement in production
  }

  measureFormSubmission<T>(submitFunction: () => Promise<T>, componentName: string): Promise<T> {
    const startTime = performance.now()

    return submitFunction().finally(() => {
      this.metrics.formSubmissionTime = performance.now() - startTime
      console.log(
        `[Performance Monitor] ${componentName} form submission took ${this.metrics.formSubmissionTime.toFixed(2)} ms.`,
      )
    })
  }

  measureRenderTime(renderFunction: () => void, componentName: string): number {
    const startTime = startPerformanceMonitor(componentName)
    renderFunction()
    const duration = endPerformanceMonitor(startTime, componentName)

    this.metrics.renderTime = duration
    return this.metrics.renderTime
  }

  measureInteraction(interactionName: string, callback: () => void): number {
    return measureInteraction(interactionName, callback)
  }

  measureComponentRender(componentName: string, callback: () => void): void {
    const start = performance.now()
    callback()
    const end = performance.now()
    console.log(`${componentName} rendered in ${(end - start).toFixed(2)} ms`)
  }

  getMetrics(): PerformanceMetrics {
    return {
      formLoadTime: this.metrics.formLoadTime,
      firstInputDelay: this.metrics.firstInputDelay,
      formSubmissionTime: this.metrics.formSubmissionTime,
      memoryUsage: this.metrics.memoryUsage,
      renderTime: this.metrics.renderTime,
      fcp: this.metrics.fcp,
      lcp: this.metrics.lcp,
      fid: this.metrics.fid,
      cls: this.metrics.cls,
      ttfb: this.metrics.ttfb,
      domContentLoaded: this.metrics.domContentLoaded,
      loadTime: this.metrics.loadTime,
      customMetrics: this.metrics.customMetrics,
    }
  }

  /**
   * Gathers and reports various performance metrics.
   * This is a simplified example; real-world monitoring would use Web Vitals.
   * @returns A PerformanceReport object.
   */
  generateReport(): PerformanceReport | undefined {
    if (process.env.NODE_ENV !== "production" && typeof performance !== "undefined") {
      const metrics: PerformanceMetric[] = []

      // Example: Measure total time since page load
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
        if (loadTime > 0) {
          metrics.push({
            name: "Page Load Time",
            value: loadTime,
            unit: "ms",
            description: "Time from navigation start to load event end.",
          })
        }
      }

      // Add any custom marks that are still active
      this.marks.forEach((startTime, name) => {
        metrics.push({
          name: `Active Mark: ${name}`,
          value: performance.now() - startTime,
          unit: "ms",
          description: "Duration of an active performance mark.",
        })
      })

      const report: PerformanceReport = {
        timestamp: new Date().toISOString(),
        metrics: metrics,
      }

      console.log("--- Performance Report ---")
      console.log(JSON.stringify(report, null, 2))
      console.log("--------------------------")
      return report
    }
    return undefined
  }
}

export function startPerformanceMonitor(componentName: string) {
  const startTime = performance.now()
  console.log(`[Performance Monitor] ${componentName} started rendering...`)
  return startTime
}

export function endPerformanceMonitor(startTime: number, componentName: string) {
  const endTime = performance.now()
  const duration = endTime - startTime
  console.log(`[Performance Monitor] ${componentName} finished rendering in ${duration.toFixed(2)} ms.`)
  return duration
}

export function measureInteraction(interactionName: string, callback: () => void) {
  const start = performance.now()
  callback()
  const end = performance.now()
  console.log(`[Performance Monitor] Interaction '${interactionName}' took ${(end - start).toFixed(2)} ms.`)
  return end - start
}

/**
 * Measures the performance of a given function.
 * @param {Function} func The function to measure.
 * @param {string} name An optional name for the measurement.
 * @returns {Promise<number>} A promise that resolves with the duration in milliseconds.
 */
export async function measurePerformance<T>(fn: () => Promise<T>, name = "Operation"): Promise<T> {
  const start = performance.now()
  try {
    const result = await fn()
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds.`)
    return result
  } catch (error) {
    const end = performance.now()
    console.error(`${name} failed after ${end - start} milliseconds with error:`, error)
    throw error
  }
}

export function measureComponentRender(componentName: string, callback: () => void): void {
  const start = performance.now()
  callback()
  const end = performance.now()
  console.log(`${componentName} rendered in ${(end - start).toFixed(2)} ms`)
}

export function startPerformanceMonitoring(onMetricsUpdate: (metrics: PerformanceMetrics) => void) {
  if (typeof window === "undefined" || !window.PerformanceObserver) {
    console.warn("PerformanceObserver not supported in this environment.")
    return
  }

  const metrics: PerformanceMetrics = {}

  const observerCallback = (list: PerformanceObserverEntryList) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "paint") {
        if (entry.name === "first-contentful-paint") {
          metrics.fcp = entry.startTime
        }
        if (entry.name === "largest-contentful-paint") {
          metrics.lcp = entry.startTime
        }
      } else if (entry.entryType === "first-input") {
        metrics.fid = (entry as PerformanceEventTiming).duration
      } else if (entry.entryType === "layout-shift") {
        metrics.cls = (metrics.cls || 0) + (entry as LayoutShift).value
      } else if (entry.entryType === "navigation") {
        const navEntry = entry as PerformanceNavigationTiming
        metrics.ttfb = navEntry.responseStart - navEntry.requestStart
        metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
        metrics.loadTime = navEntry.loadEventEnd - navEntry.startTime
      } else if (entry.entryType === "resource") {
        const resource = entry as PerformanceResourceTiming
        console.log(`Resource loaded: ${resource.name} - ${resource.duration.toFixed(2)} ms`)
      }
    }
    onMetricsUpdate(metrics)
  }

  performanceObserver = new PerformanceObserver(observerCallback)
  performanceObserver.observe({
    entryTypes: ["paint", "first-input", "layout-shift", "navigation", "resource"],
  })

  console.log("Performance monitoring started.")
}

export function stopPerformanceMonitoring() {
  if (performanceObserver) {
    performanceObserver.disconnect()
    performanceObserver = null
    console.log("Performance monitoring stopped.")
  }
}

export function measureCustomMetric(
  name: string,
  startMark: string,
  endMark: string,
  onMetricsUpdate: (metrics: PerformanceMetrics) => void,
) {
  if (typeof window === "undefined" || !window.performance) {
    console.warn("Performance API not supported for custom metrics.")
    return
  }

  window.performance.mark(startMark)
  // ... perform the operation you want to measure ...
  window.performance.mark(endMark)
  window.performance.measure(name, startMark, endMark)

  const measure = window.performance.getEntriesByName(name).pop()
  if (measure) {
    onMetricsUpdate({ customMetrics: { [name]: measure.duration } })
  }
  window.performance.clearMarks([startMark, endMark])
  window.performance.clearMeasures(name)
}

// Global instance for convenience (optional)
export const performanceMonitor = new PerformanceMonitor()

// Example usage:
/*
// In a component or effect:
import { performanceMonitor } from '@/components/test-utils/performance-monitor';

useEffect(() => {
  performanceMonitor.start('dataFetch');
  fetch('/api/data').then(() => {
    performanceMonitor.end('dataFetch');
    performanceMonitor.generateReport();
  });
}, []);

// Or to measure a function:
const calculateExpensiveStuff = () => { /* ... */ /* };
performanceMonitor.measureFunction(calculateExpensiveStuff, 'expensiveCalculation');

// Or to measure an async operation:
import { measurePerformance } from './performance-monitor';

async function myHeavyComputation() {
  // Simulate a heavy computation
  let sum = 0;
  for (let i = 0; i < 100000000; i++) {
    sum += i;
  }
  return sum;
}

async function runMeasurements() {
  await measurePerformance(myHeavyComputation, 'Heavy Computation');

  // Measure an async operation
  await measurePerformance(async () => {
    await fetch('https://api.example.com/data');
  }, 'API Call');
}

runMeasurements();
*/

type PerformanceEntry = {
  id: string
  componentName: string
  renderTime: number
  timestamp: number
}

const performanceLog: PerformanceEntry[] = []

export function startPerformanceMonitorForLog(componentName: string): number {
  const startTime = performance.now()
  return startTime
}

export function endPerformanceMonitorForLog(componentName: string, startTime: number) {
  const endTime = performance.now()
  const renderTime = endTime - startTime

  const entry: PerformanceEntry = {
    id: `${componentName}-${Date.now()}`,
    componentName,
    renderTime,
    timestamp: endTime,
  }
  performanceLog.push(entry)

  console.log(`[Perf] ${componentName} rendered in ${renderTime.toFixed(2)} ms`)
}

export function getPerformanceLog(): PerformanceEntry[] {
  return [...performanceLog] // Return a copy to prevent external modification
}

export function clearPerformanceLog() {
  performanceLog.length = 0
  console.log("[Perf] Performance log cleared.")
}

export function analyzePerformance() {
  if (performanceLog.length === 0) {
    console.log("[Perf] No performance data to analyze.")
    return
  }

  console.groupCollapsed("Performance Analysis Report")

  const componentRenderTimes: { [key: string]: { total: number; count: number; max: number; min: number } } = {}

  performanceLog.forEach((entry) => {
    if (!componentRenderTimes[entry.componentName]) {
      componentRenderTimes[entry.componentName] = {
        total: 0,
        count: 0,
        max: Number.NEGATIVE_INFINITY,
        min: Number.POSITIVE_INFINITY,
      }
    }
    const data = componentRenderTimes[entry.componentName]
    data.total += entry.renderTime
    data.count++
    data.max = Math.max(data.max, entry.renderTime)
    data.min = Math.min(data.min, entry.renderTime)
  })

  console.log("Summary of Component Render Times:")
  for (const componentName in componentRenderTimes) {
    const data = componentRenderTimes[componentName]
    const average = data.total / data.count
    console.log(
      `- ${componentName}: Avg ${average.toFixed(2)} ms (Min: ${data.min.toFixed(2)} ms, Max: ${data.max.toFixed(2)} ms, Renders: ${data.count})`,
    )
  }

  // Identify potential slow renders (e.g., top 10% of all renders)
  const sortedByRenderTime = [...performanceLog].sort((a, b) => b.renderTime - a.renderTime)
  const topN = Math.ceil(sortedByRenderTime.length * 0.1) // Top 10%
  if (topN > 0) {
    console.log(`\nTop ${topN} Slowest Renders:`)
    sortedByRenderTime.slice(0, topN).forEach((entry, index) => {
      console.log(
        `${index + 1}. ${entry.componentName}: ${entry.renderTime.toFixed(2)} ms (at ${new Date(entry.timestamp).toLocaleTimeString()})`,
      )
    })
  }

  console.groupEnd()
}

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && typeof window !== "undefined") {
    import("web-vitals").then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry)
      onFID(onPerfEntry)
      onFCP(onPerfEntry)
      onLCP(onPerfEntry)
      onTTFB(onPerfEntry)
    })
  }
}

/**
 * Monitors the Long Task API for long-running tasks.
 * @param threshold The minimum duration (in ms) for a task to be considered "long".
 */
export function monitorLongTasks(threshold = 50) {
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > threshold) {
          console.warn(`Long task detected: ${entry.name || "Unnamed task"} took ${entry.duration}ms.`, entry)
        }
      }
    })

    observer.observe({ type: "longtask", buffered: true })
    console.log(`Monitoring long tasks with a threshold of ${threshold}ms.`)
  } else {
    console.warn("PerformanceObserver (Long Task API) is not supported in this browser.")
  }
}

/**
 * Logs basic performance metrics (FCP, LCP, CLS, FID - if available).
 * Note: FID requires a polyfill for older browsers or specific browser support.
 */
export function logWebVitalMetrics() {
  if ("performance" in window && "getEntriesByType" in performance) {
    const entries = performance.getEntriesByType("paint")
    entries.forEach((entry) => {
      if (entry.name === "first-contentful-paint") {
        console.log(`First Contentful Paint (FCP): ${entry.startTime.toFixed(2)}ms`)
      }
    })

    // For LCP, CLS, FID, typically you'd use the web-vitals library for robust reporting
    // or PerformanceObserver for 'largest-contentful-paint', 'layout-shift', 'first-input'
    // Example for LCP (simplified, requires more robust handling for actual LCP):
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint")
    if (lcpEntries.length > 0) {
      const lastLCP = lcpEntries[lcpEntries.length - 1]
      console.log(`Largest Contentful Paint (LCP): ${lastLCP.renderTime || lastLCP.loadTime || 0}ms`)
    }

    // Example for CLS (simplified):
    const clsEntries = performance.getEntriesByType("layout-shift")
    if (clsEntries.length > 0) {
      const totalCLS = clsEntries.reduce((sum, entry: any) => sum + entry.value, 0)
      console.log(`Cumulative Layout Shift (CLS): ${totalCLS.toFixed(4)}`)
    }

    // FID is more complex and usually requires a PerformanceObserver for 'first-input'
    // or the web-vitals library.
  } else {
    console.warn("Performance APIs not fully supported in this browser.")
  }
}
