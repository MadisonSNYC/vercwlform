"use client"

// components/test-utils/accessibility-checker.ts
import axe from "@axe-core/react"
import React from "react"
import ReactDOM from "react-dom"

// This function can be used in development to check for accessibility issues.
// It should not be used in production builds.
export function runAccessibilityChecks(reactApp: React.ReactElement, rootElement: HTMLElement) {
  if (process.env.NODE_ENV !== "production") {
    axe(React, ReactDOM, 1000) // Run axe-core checks after 1 second
    console.log("Accessibility checks enabled in development mode.")
  } else {
    console.log("Accessibility checks are disabled in production mode.")
  }
}

// Example usage (e.g., in your main App component or a specific page):
/*
import { runAccessibilityChecks } from '@/components/test-utils/accessibility-checker';

function MyApp() {
  useEffect(() => {
    const root = document.getElementById('__next'); // Or your app's root element
    if (root) {
      runAccessibilityChecks(<MyApp />, root);
    }
  }, []);

  return (
    // Your app content
  );
}
*/
