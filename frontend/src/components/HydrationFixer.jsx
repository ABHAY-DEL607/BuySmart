'use client';

import { useEffect } from 'react';
import { addSuppressHydrationWarningToSVGs } from '@/utils/hydration';

// This component applies fixes for hydration mismatches
// caused by browser extensions like DarkReader
const HydrationFixer = () => {
  useEffect(() => {
    // Apply the fix to SVG elements
    addSuppressHydrationWarningToSVGs();
  }, []);

  // This component doesn't render anything
  return null;
};

export default HydrationFixer; 