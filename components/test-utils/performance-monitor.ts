// components/test-utils/performance-monitor.ts
// This is a basic utility for monitoring component rendering performance.
// In a real application, you might use React Profiler or browser performance APIs.

let renderCounts: { [key: string]: number } = {}
let renderTimes: { [key: string]: number[] } = {}

export function startMonitoring(componentName: string) {
  if (typeof window !== "undefined" && window.performance) {
    window.performance.mark(`${componentName}-start`)
  }
}

export function endMonitoring(componentName: string) {
  if (typeof window !== "undefined" && window.performance) {
    window.performance.mark(`${componentName}-end`)
    window.performance.measure(`${componentName}-render`, `${componentName}-start`, `${componentName}-end`)

    const measure = window.performance.getEntriesByName(`${componentName}-render`).pop()
    if (measure) {
      const duration = measure.duration

      renderCounts[componentName] = (renderCounts[componentName] || 0) + 1
      renderTimes[componentName] = renderTimes[componentName] || []
      renderTimes[componentName].push(duration)

      console.log(`[Perf] ${componentName} rendered in ${duration.toFixed(2)} ms.`)
    }
  }
}

export function getPerformanceReport() {
  const report: { [key: string]: { count: number; avgTime: string; totalTime: string } } = {}
  for (const componentName in renderCounts) {
    const times = renderTimes[componentName]
    const totalTime = times.reduce((sum, time) => sum + time, 0)
    const avgTime = totalTime / times.length
    report[componentName] = {
      count: renderCounts[componentName],
      avgTime: `${avgTime.toFixed(2)} ms`,
      totalTime: `${totalTime.toFixed(2)} ms`,
    }
  }
  return report
}

export function resetPerformanceMonitor() {
  renderCounts = {}
  renderTimes = {}
  if (typeof window !== "undefined" && window.performance) {
    window.performance.clearMarks()
    window.performance.clearMeasures()
  }
  console.log("[Perf] Performance monitor reset.")
}
