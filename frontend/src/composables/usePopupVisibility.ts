import { ref, nextTick } from 'vue'

/**
 * Composable for ensuring popup/dropdown visibility within scrollable containers
 * Used by SearchableDropdown and DatePicker components
 */

// Configuration constants
const SAFE_MARGIN = 24 // Comfortable space above modal footer/edges
const VISIBILITY_MARGIN = 20 // Margin for visibility checks
const SCROLL_THRESHOLD = 50 // Only scroll if overflow exceeds this amount
const EXTRA_CUSHION = 50 // Additional space to prevent tight fit
const RECENT_SCROLL_THRESHOLD = 20 // Minimum scroll difference to consider a new scroll

interface VisibilityMetrics {
  overflowBelow: number
  overflowAbove: number
  isFullyVisible: boolean
}

interface UsePopupVisibilityOptions {
  debug?: boolean
  componentName?: string
  safeMargin?: number
  scrollThreshold?: number
  extraCushion?: number
}

export function usePopupVisibility(options: UsePopupVisibilityOptions = {}) {
  const {
    debug = false,
    componentName = 'Component',
    safeMargin = SAFE_MARGIN,
    scrollThreshold = SCROLL_THRESHOLD,
    extraCushion = EXTRA_CUSHION,
  } = options

  const lastScrollPosition = ref<number | null>(null)

  /**
   * Check if an element is scrollable
   */
  const isElementScrollable = (el: HTMLElement): boolean => {
    const style = globalThis.getComputedStyle(el)
    const overflowY = style.overflowY
    const overflowX = style.overflowX

    const hasScrollableOverflowY =
      /(auto|scroll)/.test(overflowY) && el.scrollHeight > el.clientHeight
    const hasScrollableOverflowX =
      /(auto|scroll)/.test(overflowX) && el.scrollWidth > el.clientWidth

    return hasScrollableOverflowY || hasScrollableOverflowX
  }

  /**
   * Get fallback scrollable container
   */
  const getFallbackContainer = (): HTMLElement | null => {
    const formContainer = document.querySelector(
      '.card-body, .modal-body, .form-container, .scroll-container',
    )
    
    if (formContainer && debug) {
      console.log(`[${componentName}] Using form container as fallback:`, {
        className: formContainer.className,
        id: (formContainer as HTMLElement).id,
      })
    }

    if (!formContainer && debug) {
      console.log(`[${componentName}] No scrollable ancestor found, using document body`)
    }

    return (formContainer as HTMLElement) || (document.scrollingElement as HTMLElement | null)
  }

  /**
   * Find the nearest scrollable ancestor element
   */
  const findScrollableAncestor = (start: HTMLElement): HTMLElement | null => {
    let el: HTMLElement | null = start
    let attempts = 0
    const maxAttempts = 10

    if (debug) {
      console.log(`[${componentName}] Starting scroll container search from:`, {
        className: el.className,
        id: el.id,
      })
    }

    while (el && attempts < maxAttempts) {
      const canScroll = isElementScrollable(el)

      if (debug) {
        const style = globalThis.getComputedStyle(el)
        console.log(`[${componentName}] Checking element:`, {
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          overflowY: style.overflowY,
          overflowX: style.overflowX,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          canScroll,
        })
      }

      if (canScroll) {
        if (debug) {
          console.log(`[${componentName}] Found scrollable ancestor:`, {
            className: el.className,
            id: el.id,
          })
        }
        return el
      }

      el = el.parentElement
      attempts++
    }

    return getFallbackContainer()
  }

  /**
   * Calculate visibility metrics for a popup element
   */
  const calculateVisibilityMetrics = (
    popup: HTMLElement,
    scrollParent: HTMLElement,
  ): VisibilityMetrics => {
    const popupRect = popup.getBoundingClientRect()
    const parentRect = scrollParent.getBoundingClientRect()

    const overflowBelow = popupRect.bottom + safeMargin - parentRect.bottom
    const overflowAbove = parentRect.top + safeMargin - popupRect.top

    const isFullyVisible =
      popupRect.top >= parentRect.top - VISIBILITY_MARGIN &&
      popupRect.bottom <= parentRect.bottom + VISIBILITY_MARGIN

    if (debug) {
      console.log(`[${componentName}] Visibility metrics:`, {
        popupRect: {
          top: popupRect.top,
          bottom: popupRect.bottom,
          height: popupRect.height,
        },
        parentRect: {
          top: parentRect.top,
          bottom: parentRect.bottom,
          height: parentRect.height,
        },
        overflowBelow,
        overflowAbove,
        isFullyVisible,
      })
    }

    return { overflowBelow, overflowAbove, isFullyVisible }
  }

  /**
   * Check if we should skip scrolling (to prevent infinite scroll loops)
   */
  const shouldSkipScroll = (scrollParent: HTMLElement): boolean => {
    const currentScrollTop = scrollParent.scrollTop
    if (lastScrollPosition.value === null) return false

    const scrollDifference = Math.abs(currentScrollTop - lastScrollPosition.value)
    const shouldSkip = scrollDifference < RECENT_SCROLL_THRESHOLD

    if (debug && shouldSkip) {
      console.log(`[${componentName}] Skipping recent scroll:`, {
        current: currentScrollTop,
        last: lastScrollPosition.value,
        difference: scrollDifference,
      })
    }

    return shouldSkip
  }

  /**
   * Adjust scroll position to make popup visible
   */
  const adjustScroll = (
    scrollParent: HTMLElement,
    popup: HTMLElement,
    metrics: VisibilityMetrics,
  ) => {
    const isMeaningfullyCutOffBelow = metrics.overflowBelow > scrollThreshold
    const isMeaningfullyCutOffAbove = metrics.overflowAbove > scrollThreshold
    const popupRect = popup.getBoundingClientRect()

    if (isMeaningfullyCutOffBelow) {
      const scrollAmount = Math.min(
        metrics.overflowBelow - scrollThreshold + extraCushion,
        popupRect.height * 0.8 + extraCushion,
      )
      scrollParent.scrollTop += scrollAmount

      if (debug) {
        console.log(`[${componentName}] Scrolled down by: ${scrollAmount}px`, {
          newScrollTop: scrollParent.scrollTop,
        })
      }
    } else if (isMeaningfullyCutOffAbove) {
      const scrollAmount = Math.min(
        metrics.overflowAbove - scrollThreshold + extraCushion,
        popupRect.height * 0.8 + extraCushion,
      )
      scrollParent.scrollTop -= scrollAmount

      if (debug) {
        console.log(`[${componentName}] Scrolled up by: ${scrollAmount}px`, {
          newScrollTop: scrollParent.scrollTop,
        })
      }
    }

    lastScrollPosition.value = scrollParent.scrollTop
  }

  /**
   * Fallback scroll using scrollIntoView if metrics-based scroll didn't work
   */
  const checkFallbackScroll = (popup: HTMLElement, scrollParent: HTMLElement) => {
    nextTick(() => {
      const { overflowBelow, overflowAbove } = calculateVisibilityMetrics(
        popup,
        scrollParent,
      )

      if (overflowBelow > scrollThreshold || overflowAbove > scrollThreshold) {
        if (debug) {
          console.log(`[${componentName}] Using fallback scrollIntoView`)
        }
        try {
          popup.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        } catch {
          // Fallback without smooth behavior
          popup.scrollIntoView({ block: 'nearest', inline: 'nearest' })
        }
      }
    })
  }

  /**
   * Scroll the trigger element (input/button) into view
   */
  const scrollTriggerIntoView = (triggerElement: HTMLElement) => {
    nextTick(() => {
      try {
        triggerElement.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: 'smooth',
        })
      } catch {
        // Fallback without smooth behavior
        triggerElement.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      }

      if (debug) {
        console.log(`[${componentName}] Scrolled trigger element into view`)
      }
    })
  }

  /**
   * Check if popup element is visible
   */
  const isPopupVisible = (popup: HTMLElement): boolean => {
    return (
      popup.classList.contains('show') ||
      popup.classList.contains('calendar-dropdown') ||
      globalThis.getComputedStyle(popup).display !== 'none'
    )
  }

  /**
   * Handle trigger element scrolling if selector is provided
   */
  const handleTriggerScroll = (rootElement: HTMLElement, triggerSelector?: string) => {
    if (!triggerSelector) return

    const trigger = rootElement.querySelector(triggerSelector)
    if (trigger) {
      scrollTriggerIntoView(trigger as HTMLElement)
    }
  }

  /**
   * Validate and get popup element
   */
  const getValidatedPopup = (
    rootElement: HTMLElement,
    popupSelector: string,
  ): HTMLElement | null => {
    const popup = rootElement.querySelector(popupSelector)
    
    if (!popup) {
      if (debug) {
        console.log(`[${componentName}] Popup element not found with selector: ${popupSelector}`)
      }
      return null
    }

    if (!isPopupVisible(popup as HTMLElement)) {
      if (debug) {
        console.log(`[${componentName}] Popup is not visible yet`)
      }
      return null
    }

    return popup as HTMLElement
  }

  /**
   * Main function to ensure popup visibility
   * Call this when opening a dropdown/calendar/popup
   */
  const ensurePopupVisible = (
    rootElement: HTMLElement,
    popupSelector: string,
    triggerSelector?: string,
  ) => {
    nextTick(() => {
      const popup = getValidatedPopup(rootElement, popupSelector)
      if (!popup) return

      handleTriggerScroll(rootElement, triggerSelector)

      const scrollParent = findScrollableAncestor(rootElement)
      if (!scrollParent) {
        if (debug) {
          console.log(`[${componentName}] No scrollable parent found`)
        }
        return
      }

      if (shouldSkipScroll(scrollParent)) return

      const metrics = calculateVisibilityMetrics(popup, scrollParent)

      if (metrics.isFullyVisible) {
        if (debug) {
          console.log(`[${componentName}] Popup already fully visible`)
        }
        return
      }

      adjustScroll(scrollParent, popup, metrics)
      checkFallbackScroll(popup, scrollParent)
    })
  }

  /**
   * Reset scroll position tracking
   * Call this when closing the popup
   */
  const resetScrollTracking = () => {
    lastScrollPosition.value = null
    if (debug) {
      console.log(`[${componentName}] Reset scroll tracking`)
    }
  }

  return {
    ensurePopupVisible,
    resetScrollTracking,
    findScrollableAncestor,
    calculateVisibilityMetrics,
    scrollTriggerIntoView,
  }
}

