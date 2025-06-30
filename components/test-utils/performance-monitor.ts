"use client"

// components/test-utils/performance-monitor.ts

// This function can be used to monitor web vital metrics in development.
// It should not be used in production builds as it can add overhead.
export function setupPerformanceMonitoring() {
  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    console.log("Performance monitoring enabled in development mode.")

    // Monitor Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          console.log("LCP:", entry.renderTime || entry.loadTime)
        }
      }
    }).observe({ type: "largest-contentful-paint", buffered: true })

    // Monitor Cumulative Layout Shift (CLS)
    new PerformanceObserver((entryList) => {
      let cls = 0
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          cls += entry.value
        }
      }
      console.log("CLS:", cls)
    }).observe({ type: "layout-shift", buffered: true })

    // Monitor First Input Delay (FID) - Note: FID is deprecated in favor of INP
    // For modern monitoring, consider using Interaction to Next Paint (INP)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === "first-input") {
          console.log("FID:", entry.duration)
        }
      }
    }).observe({ type: "first-input", buffered: true })

    // Monitor Interaction to Next Paint (INP)
    // This is a more comprehensive metric for responsiveness
    if ("PerformanceEventTiming" in window) {
      new PerformanceObserver((entryList) => {
        let maxInp = 0
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === "event" && entry.duration > maxInp) {
            maxInp = entry.duration
          }
        }
        console.log("INP (max observed):", maxInp)
      }).observe({ type: "event", buffered: true, durationThreshold: 0 })
    }

    // Monitor other useful metrics
    window.addEventListener("load", () => {
      setTimeout(() => {
        const { navigation, paint } = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        const fcp = performance.getEntriesByName("first-contentful-paint")[0] as PerformancePaintTiming

        if (navigation) {
          console.log("TTFB (Time to First Byte):", navigation.responseStart - navigation.requestStart)
          console.log(
            "DOM Content Loaded:",
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          )
          console.log("Load Time:", navigation.loadEventEnd - navigation.loadEventStart)
        }
        if (fcp) {
          console.log("FCP (First Contentful Paint):", fcp.startTime)
        }
      }, 500) // Give some time for entries to be collected
    })
  } else {
    console.log("Performance monitoring is disabled in production mode.")
  }
}

// Example usage (e.g., in your main App component or a specific page):
/*
import { setupPerformanceMonitoring } from '@/components/test-utils/performance-monitor';

function MyApp() {
  useEffect(() => {
    setupPerformanceMonitoring();
  }, []);

  return (
    // Your app content
  );
}
*/
