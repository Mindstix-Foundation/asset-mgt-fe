/**
 * Custom Toast Notification System
 * Matches the prototype design exactly without Bootstrap dependency
 * 
 * Usage:
 * import { showToast, showToastWithButtons } from '@/utils/toast'
 * 
 * showToast('Message', 'success') // Simple toast
 * showToastWithButtons('<div>Complex content with buttons</div>', 'error') // Toast with custom content
 */

export type ToastType = 'success' | 'error' | 'danger' | 'info' | 'warning'

/**
 * Show a toast with custom content (can include buttons)
 * @param message - HTML content for the toast body
 * @param type - Toast type (success, error, warning, info)
 */
export const showToastWithButtons = (message: string, type: ToastType = 'success') => {
  // Remove any existing notifications first
  const existingToasts = document.querySelectorAll('.custom-toast-notification')
  existingToasts.forEach(toast => toast.remove())

  // Calculate duration first (needed for HTML template)
  const duration = 5000 // 5 seconds for all toast types

  const notification = document.createElement('div')
  notification.className = 'custom-toast-notification'
  
  // Set colors based on type using prototype colors
  let headerColor: string, headerText: string, icon: string
  switch(type) {
    case 'success':
      headerColor = '#21AF65' // Green
      headerText = 'Success'
      icon = 'check-circle'
      break
    case 'warning':
      headerColor = '#FFC000' // Yellow
      headerText = 'Warning'
      icon = 'exclamation-triangle'
      break
    case 'danger':
    case 'error':
      headerColor = '#E97676' // Red
      headerText = 'Error'
      icon = 'times-circle'
      break
    case 'info':
    default:
      headerColor = '#331FEA' // Purple
      headerText = 'Info'
      icon = 'info-circle'
      break
  }
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    max-width: 450px;
    min-width: 350px;
    overflow: hidden;
    animation: slideInDown 0.3s ease-out;
    border: 2px solid #e2e8f0;
  `
  
  const textColor = headerColor === '#FFC000' ? '#000000' : '#ffffff'
  
  notification.innerHTML = `
    <div style="
      background-color: ${headerColor};
      color: ${textColor};
      padding: 12px 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
    ">
      <div style="display: flex; align-items: center;">
        <i class="fas fa-${icon} me-2" style="color: ${textColor}; font-size: 16px;"></i>
        <span>${headerText}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <!-- Circular Timer -->
        <div class="toast-timer" style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid ${textColor === '#000000' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'};
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${textColor === '#000000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
        ">
          <svg width="28" height="28" style="position: absolute; top: -2px; left: -2px; transform: rotate(-90deg);">
            <circle
              cx="14"
              cy="14"
              r="12"
              fill="none"
              stroke="${textColor}"
              stroke-width="2"
              stroke-dasharray="75.4"
              stroke-dashoffset="0"
              class="timer-circle"
              style="
                animation: toast-timer-${duration}ms ${duration}ms linear forwards;
                opacity: 0.9;
              "
            />
          </svg>
          <span class="timer-seconds" style="
            color: ${textColor};
            font-size: 10px;
            font-weight: 700;
            line-height: 1;
            opacity: 0.9;
          ">${Math.ceil(duration / 1000)}</span>
        </div>
        <button type="button" class="btn-close-custom" onclick="this.parentElement.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          color: ${textColor};
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          opacity: 0.8;
          line-height: 1;
          font-weight: bold;
        ">&times;</button>
      </div>
    </div>
    <div style="
      background-color: #ffffff;
      color: #1f2937;
      padding: 16px;
      font-weight: 400;
    ">
      ${message}
    </div>
  `
  
  document.body.appendChild(notification)
  
  // Auto dismiss with pause on hover functionality
  let timeoutId: number
  let intervalId: number
  let remainingTime = duration
  let startTime = Date.now()
  let isPaused = false
  
  const timerSecondsElement = notification.querySelector('.timer-seconds')
  
  const updateTimerDisplay = () => {
    if (timerSecondsElement && remainingTime > 0) {
      const seconds = Math.ceil(remainingTime / 1000)
      timerSecondsElement.textContent = seconds.toString()
    }
  }
  
  const startTimer = () => {
    startTime = Date.now()
    
    // Update display every second
    intervalId = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTime
        const currentRemaining = remainingTime - elapsed
        if (currentRemaining <= 0) {
          clearInterval(intervalId)
          clearTimeout(timeoutId)
          if (notification.parentNode) {
            notification.style.animation = 'slideOutUp 0.3s ease-in forwards'
            setTimeout(() => {
              if (notification.parentNode) {
                notification.remove()
              }
            }, 300)
          }
          return
        }
        
        // Update display
        if (timerSecondsElement) {
          const seconds = Math.ceil(currentRemaining / 1000)
          timerSecondsElement.textContent = seconds.toString()
        }
      }
    }, 100) // Update every 100ms for smooth countdown
    
    // Auto dismiss timeout
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      if (notification.parentNode) {
        notification.style.animation = 'slideOutUp 0.3s ease-in forwards'
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove()
          }
        }, 300)
      }
    }, remainingTime)
  }
  
  const pauseTimer = () => {
    isPaused = true
    clearTimeout(timeoutId)
    clearInterval(intervalId)
    remainingTime -= Date.now() - startTime
    if (remainingTime < 0) remainingTime = 0
  }
  
  const resumeTimer = () => {
    if (remainingTime > 0) {
      isPaused = false
      startTimer()
    }
  }
  
  // Add hover event listeners
  notification.addEventListener('mouseenter', pauseTimer)
  notification.addEventListener('mouseleave', resumeTimer)
  
  // Start the initial timer
  startTimer()
}

/**
 * Show a simple toast message
 * @param message - Plain text message
 * @param type - Toast type (success, error, warning, info)
 */
export const showToast = (message: string, type: ToastType = 'success') => {
  // Use the same custom toast system but without buttons
  showToastWithButtons(message, type)
}

/**
 * Show an error toast with a "Find Errors" button
 * Requires a global scrollToFirstError function to be available
 * @param message - Error message to display
 */
export const showErrorToast = (message: string) => {
  const errorToastContent = `<div class="mb-3">
    ${message}
  </div>
  <div class="d-flex gap-2 justify-content-center">
    <button type="button" class="btn btn-sm btn-danger" onclick="scrollToFirstError()">
      Find Errors
    </button>
  </div>`
  showToastWithButtons(errorToastContent, 'error')
}

/**
 * Show a success toast for vendor operations with action buttons
 * @param vendorName - Name of the vendor that was created/updated
 * @param isEdit - Whether this is an edit operation
 */
export const showVendorSuccessToast = (vendorName: string, isEdit: boolean = false) => {
  const message = `<div class="mb-3">
    <strong>${vendorName}</strong> has been ${isEdit ? 'updated' : 'added'} successfully!
  </div>
  <div class="d-flex gap-2 justify-content-center">
    ${!isEdit ? `
    <button type="button" class="btn btn-sm btn-primary" onclick="addAnotherVendor()">
      Add Another
    </button>
    ` : ''}
    <button type="button" class="btn btn-sm btn-outline-primary" onclick="window.location.href='/app/vendors'">
      View Vendors
    </button>
  </div>
  <div class="mt-2 text-center">
    <small class="text-muted">Auto-redirecting to vendors page...</small>
  </div>`
  
  // Use custom toast with redirect functionality
  showVendorSuccessToastWithRedirect(message)
}

/**
 * Show a success toast for employee operations with action buttons
 * @param employeeName - Name of the employee that was created/updated
 * @param isEdit - Whether this is an edit operation
 */
export const showEmployeeSuccessToast = (employeeName: string, isEdit: boolean = false) => {
  const message = `<div class="mb-3">
    <strong>${employeeName}</strong> has been ${isEdit ? 'updated' : 'added'} successfully!
  </div>
  <div class="d-flex gap-2 justify-content-center">
    ${!isEdit ? `
    <button type="button" class="btn btn-sm btn-primary" onclick="addAnotherEmployee()">
      Add Another
    </button>
    ` : ''}
    <button type="button" class="btn btn-sm btn-outline-primary" onclick="window.location.href='/app/employees'">
      View Employees
    </button>
  </div>
  <div class="mt-2 text-center">
    <small class="text-muted">Auto-redirecting to employees page...</small>
  </div>`
  
  // Use custom toast with redirect functionality
  showEmployeeSuccessToastWithRedirect(message)
}

/**
 * Show a vendor success toast with integrated redirect functionality
 * This is a specialized version of showToastWithButtons that redirects when timer expires
 * @param message - HTML message content
 */
const showVendorSuccessToastWithRedirect = (message: string) => {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.custom-toast-notification')
  existingToasts.forEach(toast => toast.remove())

  const duration = 5000 // 5 seconds
  const notification = document.createElement('div')
  notification.className = 'custom-toast-notification'
  
  // Success toast styling
  const headerColor = '#21AF65' // Green
  const headerText = 'Success'
  const icon = 'check-circle'
  const textColor = '#ffffff'
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    max-width: 450px;
    min-width: 350px;
    overflow: hidden;
    animation: slideInDown 0.3s ease-out;
    border: 2px solid #e2e8f0;
  `
  
  notification.innerHTML = `
    <div style="
      background-color: ${headerColor};
      color: ${textColor};
      padding: 12px 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
    ">
      <div style="display: flex; align-items: center;">
        <i class="fas fa-${icon} me-2" style="color: ${textColor}; font-size: 16px;"></i>
        <span>${headerText}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <div class="toast-timer" style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
        ">
          <svg width="28" height="28" style="position: absolute; top: -2px; left: -2px; transform: rotate(-90deg);">
            <circle
              cx="14"
              cy="14"
              r="12"
              fill="none"
              stroke="${textColor}"
              stroke-width="2"
              stroke-dasharray="75.4"
              stroke-dashoffset="0"
              class="timer-circle"
              style="
                animation: toast-timer-${duration}ms ${duration}ms linear forwards;
                opacity: 0.9;
              "
            />
          </svg>
          <span class="timer-seconds" style="
            color: ${textColor};
            font-size: 10px;
            font-weight: 700;
            line-height: 1;
            opacity: 0.9;
          ">${Math.ceil(duration / 1000)}</span>
        </div>
        <button type="button" class="btn-close-custom" onclick="this.parentElement.parentElement.parentElement.remove(); window.vendorToastRedirectCancelled = true;" style="
          background: none;
          border: none;
          color: ${textColor};
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          opacity: 0.8;
          line-height: 1;
          font-weight: bold;
        ">&times;</button>
      </div>
    </div>
    <div style="
      background-color: #ffffff;
      color: #1f2937;
      padding: 16px;
      font-weight: 400;
    ">
      ${message}
    </div>
  `
  
  document.body.appendChild(notification)
  
  let timeoutId: number
  let intervalId: number
  let remainingTime = duration
  let startTime = Date.now()
  let isPaused = false
  
  // Flag to track if redirect was cancelled
  ;(window as any).vendorToastRedirectCancelled = false
  
  const timerSecondsElement = notification.querySelector('.timer-seconds')
  
  const startTimer = () => {
    startTime = Date.now()
    
    intervalId = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTime
        const currentRemaining = remainingTime - elapsed
        if (currentRemaining <= 0) {
          clearInterval(intervalId)
          clearTimeout(timeoutId)
          if (notification.parentNode) {
            notification.style.animation = 'slideOutUp 0.3s ease-in forwards'
            setTimeout(() => {
              if (notification.parentNode) {
                notification.remove()
              }
              // Redirect after toast is fully removed, but only if not cancelled
              if (!(window as any).vendorToastRedirectCancelled) {
                window.location.href = '/app/vendors'
              }
            }, 300)
          }
          return
        }
        
        if (timerSecondsElement) {
          const seconds = Math.ceil(currentRemaining / 1000)
          timerSecondsElement.textContent = seconds.toString()
        }
      }
    }, 100)
    
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      if (notification.parentNode) {
        notification.style.animation = 'slideOutUp 0.3s ease-in forwards'
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove()
          }
          // Redirect after toast is fully removed, but only if not cancelled
          if (!(window as any).vendorToastRedirectCancelled) {
            window.location.href = '/app/vendors'
          }
        }, 300)
      }
    }, remainingTime)
  }
  
  const pauseTimer = () => {
    isPaused = true
    clearTimeout(timeoutId)
    clearInterval(intervalId)
    remainingTime -= Date.now() - startTime
    if (remainingTime < 0) remainingTime = 0
  }
  
  const resumeTimer = () => {
    if (remainingTime > 0) {
      isPaused = false
      startTimer()
    }
  }
  
  notification.addEventListener('mouseenter', pauseTimer)
  notification.addEventListener('mouseleave', resumeTimer)
  
  startTimer()
}

/**
 * Show an employee success toast with integrated redirect functionality
 * This is a specialized version of showToastWithButtons that redirects when timer expires
 * @param message - HTML message content
 */
const showEmployeeSuccessToastWithRedirect = (message: string) => {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.custom-toast-notification')
  existingToasts.forEach(toast => toast.remove())

  const duration = 5000 // 5 seconds
  const notification = document.createElement('div')
  notification.className = 'custom-toast-notification'
  
  // Success toast styling
  const headerColor = '#21AF65' // Green
  const headerText = 'Success'
  const icon = 'check-circle'
  const textColor = '#ffffff'
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    max-width: 450px;
    min-width: 350px;
    overflow: hidden;
    animation: slideInDown 0.3s ease-out;
    border: 2px solid #e2e8f0;
  `
  
  notification.innerHTML = `
    <div style="
      background-color: ${headerColor};
      color: ${textColor};
      padding: 12px 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
    ">
      <div style="display: flex; align-items: center;">
        <i class="fas fa-${icon} me-2" style="color: ${textColor}; font-size: 16px;"></i>
        <span>${headerText}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <div class="toast-timer" style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
        ">
          <svg width="28" height="28" style="position: absolute; top: -2px; left: -2px; transform: rotate(-90deg);">
            <circle
              cx="14"
              cy="14"
              r="12"
              fill="none"
              stroke="${textColor}"
              stroke-width="2"
              stroke-dasharray="75.4"
              stroke-dashoffset="0"
              class="timer-circle"
              style="
                animation: toast-timer-${duration}ms ${duration}ms linear forwards;
                opacity: 0.9;
              "
            />
          </svg>
          <span class="timer-seconds" style="
            color: ${textColor};
            font-size: 10px;
            font-weight: 700;
            line-height: 1;
            opacity: 0.9;
          ">${Math.ceil(duration / 1000)}</span>
        </div>
        <button type="button" class="btn-close-custom" onclick="this.parentElement.parentElement.parentElement.remove(); window.employeeToastRedirectCancelled = true;" style="
          background: none;
          border: none;
          color: ${textColor};
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          opacity: 0.8;
          line-height: 1;
          font-weight: bold;
        ">&times;</button>
      </div>
    </div>
    <div style="
      background-color: #ffffff;
      color: #1f2937;
      padding: 16px;
      font-weight: 400;
    ">
      ${message}
    </div>
  `
  
  document.body.appendChild(notification)
  
  let timeoutId: number
  let intervalId: number
  let remainingTime = duration
  let startTime = Date.now()
  let isPaused = false
  
  // Flag to track if redirect was cancelled
  ;(window as any).employeeToastRedirectCancelled = false
  
  const timerSecondsElement = notification.querySelector('.timer-seconds')
  
  const startTimer = () => {
    startTime = Date.now()
    
    intervalId = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTime
        const currentRemaining = remainingTime - elapsed
        if (currentRemaining <= 0) {
          clearInterval(intervalId)
          clearTimeout(timeoutId)
          if (notification.parentNode) {
            notification.style.animation = 'slideOutUp 0.3s ease-in forwards'
            setTimeout(() => {
              if (notification.parentNode) {
                notification.remove()
              }
              // Redirect after toast is fully removed, but only if not cancelled
              if (!(window as any).employeeToastRedirectCancelled) {
                window.location.href = '/app/employees'
              }
            }, 300)
          }
          return
        }
        
        if (timerSecondsElement) {
          const seconds = Math.ceil(currentRemaining / 1000)
          timerSecondsElement.textContent = seconds.toString()
        }
      }
    }, 100)
    
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      if (notification.parentNode) {
        notification.style.animation = 'slideOutUp 0.3s ease-in forwards'
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove()
          }
          // Redirect after toast is fully removed, but only if not cancelled
          if (!(window as any).employeeToastRedirectCancelled) {
            window.location.href = '/app/employees'
          }
        }, 300)
      }
    }, remainingTime)
  }
  
  const pauseTimer = () => {
    isPaused = true
    clearTimeout(timeoutId)
    clearInterval(intervalId)
    remainingTime -= Date.now() - startTime
    if (remainingTime < 0) remainingTime = 0
  }
  
  const resumeTimer = () => {
    if (remainingTime > 0) {
      isPaused = false
      startTimer()
    }
  }
  
  notification.addEventListener('mouseenter', pauseTimer)
  notification.addEventListener('mouseleave', resumeTimer)
  
  startTimer()
}

/**
 * Inject the required CSS for toast animations into the document head
 * Call this once in your main app or in each component that uses toasts
 */
export const injectToastStyles = () => {
  // Check if styles are already injected
  if (document.getElementById('custom-toast-styles')) {
    return
  }

  const style = document.createElement('style')
  style.id = 'custom-toast-styles'
  style.textContent = `
    /* Custom toast animations */
    @keyframes slideInDown {
      from {
        transform: translate(-50%, -100%);
        opacity: 0;
      }
      to {
        transform: translate(-50%, 0);
        opacity: 1;
      }
    }

    @keyframes slideOutUp {
      from {
        transform: translate(-50%, 0);
        opacity: 1;
      }
      to {
        transform: translate(-50%, -100%);
        opacity: 0;
      }
    }

    /* Timer circle animations for different durations */
    @keyframes toast-timer-10000ms {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: 75.4;
      }
    }

    @keyframes toast-timer-15000ms {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: 75.4;
      }
    }

    @keyframes toast-timer-12000ms {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: 75.4;
      }
    }

    @keyframes toast-timer-20000ms {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: 75.4;
      }
    }

    @keyframes toast-timer-5000ms {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: 75.4;
      }
    }

    .custom-toast-notification {
      font-family: inherit;
    }

    .custom-toast-notification .btn-close-custom:hover {
      opacity: 1 !important;
      transform: scale(1.1);
    }

    /* Timer styling */
    .custom-toast-notification .toast-timer {
      transition: all 0.2s ease;
    }

    .custom-toast-notification .toast-timer:hover {
      transform: scale(1.1);
    }

    .custom-toast-notification .timer-circle {
      transition: stroke-dashoffset 0.1s ease;
    }

    /* Pause animation on hover */
    .custom-toast-notification:hover .timer-circle {
      animation-play-state: paused;
    }

    /* Toast button styling */
    .custom-toast-notification .btn {
      border-radius: 0.375rem;
      font-weight: 600;
      transition: all 0.2s ease;
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      margin: 0 0.25rem;
    }

    .custom-toast-notification .btn-primary {
      background-color: #21AF65 !important;
      border-color: #21AF65 !important;
      color: #ffffff !important;
    }

    .custom-toast-notification .btn-primary:hover {
      background-color: #1e9c5a !important;
      border-color: #1e9c5a !important;
    }

    .custom-toast-notification .btn-outline-primary {
      background-color: #ffffff !important;
      border: 2px solid #21AF65 !important;
      color: #21AF65 !important;
    }

    .custom-toast-notification .btn-outline-primary:hover {
      background-color: #21AF65 !important;
      border-color: #21AF65 !important;
      color: #ffffff !important;
    }

    .custom-toast-notification .btn-danger {
      background-color: #E97676 !important;
      border-color: #E97676 !important;
      color: #ffffff !important;
    }

    .custom-toast-notification .btn-danger:hover {
      background-color: #d63447 !important;
      border-color: #d63447 !important;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .custom-toast-notification {
        max-width: 95vw !important;
        min-width: 300px !important;
        top: 10px !important;
      }
    }

    @media (max-width: 576px) {
      .custom-toast-notification {
        max-width: 90vw !important;
        min-width: 280px !important;
        font-size: 13px !important;
      }
    }
  `
  
  document.head.appendChild(style)
}

// Auto-inject styles when the module is imported
if (typeof document !== 'undefined') {
  injectToastStyles()
} 