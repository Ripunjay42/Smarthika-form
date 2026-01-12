import { useCallback, useRef } from 'react';

/**
 * Hook to manage scrolling to specific elements or to top
 * Provides methods to scroll to an element by ID or scroll to top smoothly
 */
export function useScrollToElement() {
  const scrollContainerRef = useRef(null);

  const scrollToElement = useCallback((elementId, behavior = 'smooth', offset = 80) => {
    if (!elementId) return;

    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        // Get the scroll container (the form panel's scrollable area)
        const scrollContainer = document.querySelector('.form-panel-scroll');
        if (scrollContainer) {
          const elementRect = element.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          const scrollTop = scrollContainer.scrollTop;
          const targetScroll = scrollTop + elementRect.top - containerRect.top - offset;
          
          scrollContainer.scrollTo({
            top: targetScroll,
            behavior: behavior,
          });
        } else {
          // Fallback: scroll the element into view
          element.scrollIntoView({ behavior, block: 'start' });
        }
      }
    }, 0);
  }, []);

  const scrollToTop = useCallback((behavior = 'smooth') => {
    const scrollContainer = document.querySelector('.form-panel-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: behavior,
      });
    }
  }, []);

  return {
    scrollContainerRef,
    scrollToElement,
    scrollToTop,
  };
}
