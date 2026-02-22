import React from 'react';

export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-black focus:rounded-md focus:font-bold focus:outline-none focus:ring-2 focus:ring-white transition-all"
    >
      Skip to content
    </a>
  );
};
