'use client';

import React from 'react';

// This component wraps SVG path elements and applies suppressHydrationWarning
// It prevents hydration errors caused by browser extensions like DarkReader that add attributes
const SuppressedPath = ({ children, ...props }) => {
  return (
    <path {...props} suppressHydrationWarning>
      {children}
    </path>
  );
};

export default SuppressedPath; 