/**
 * Utility for handling hydration mismatches caused by browser extensions
 * 
 * This file contains helper functions to deal with hydration mismatches,
 * specifically those caused by browser extensions like DarkReader that
 * inject attributes into the DOM.
 */

export const addSuppressHydrationWarningToSVGs = () => {
  if (typeof window === 'undefined') return;
  
  // Function to run after the DOM is loaded
  const addSuppressWarning = () => {
    // Find all SVG elements
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
      // Add the suppressHydrationWarning attribute
      svg.setAttribute('suppressHydrationWarning', 'true');
      
      // Also add to paths inside SVGs
      const paths = svg.querySelectorAll('path');
      paths.forEach(path => {
        path.setAttribute('suppressHydrationWarning', 'true');
      });
    });
  };

  // Run once on mount
  addSuppressWarning();
  
  // Also run on DOM changes - useful for dynamically added content
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          addSuppressWarning();
          break;
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }
}; 