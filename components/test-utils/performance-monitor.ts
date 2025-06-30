// components/test-utils/performance-monitor.ts
export function startPerformanceMonitor() {
  console.log("Performance monitoring started.")
  if (typeof window !== "undefined" && window.performance) {
    window.performance.mark("start_app_load")
  }
}

export function endPerformanceMonitor() {
  if (typeof window !== "undefined" && window.performance) {
    window.performance.mark("end_app_load")
    window.performance.measure("app_load_time", "start_app_load", "end_app_load")

    const measures = window.performance.getEntriesByName("app_load_time")
    if (measures.length > 0) {
      const appLoadTime = measures[0].duration
      console.log(`App Load Time: ${appLoadTime.toFixed(2)} ms`)
    }

    // Clear marks and measures to avoid cluttering performance buffer
    window.performance.clearMarks()
    window.performance.clearMeasures()
  }
  console.log("Performance monitoring ended.")
}

export function measureFunctionPerformance<T extends (...args: any[]) => any>(func: T, name: string): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (typeof window !== "undefined" && window.performance) {
      window.performance.mark(`${name}_start`)
      const result = func(...args)
      window.performance.mark(`${name}_end`)
      window.performance.measure(name, `${name}_start`, `${name}_end`)
      const measures = window.performance.getEntriesByName(name)
      if (measures.length > 0) {
        console.log(`Function "${name}" took: ${measures[0].duration.toFixed(2)} ms`)
      }
      window.performance.clearMarks(`${name}_start`)
      window.performance.clearMarks(`${name}_end`)
      window.performance.clearMeasures(name)
      return result
    } else {
      return func(...args)
    }
  }) as T
}
