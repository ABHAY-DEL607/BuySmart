'use client';

import React from 'react';

// This component wraps SVG elements and applies suppressHydrationWarning
// It prevents hydration errors caused by browser extensions like DarkReader
const SuppressedSVG = ({ children, ...props }) => {
  return (
    <svg {...props} suppressHydrationWarning>
      {children}
    </svg>
  );
};

export default SuppressedSVG; 