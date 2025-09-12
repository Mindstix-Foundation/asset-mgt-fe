/**
 * Standardized Toast Notification Component
 * Position: Bottom-right corner
 * Usage: showToast(message, type)
 * Types: 'success', 'warning', 'error'/'danger', 'info'
 */

// Standardized toast notification function
function showToast(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.custom-toast-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = 'custom-toast-notification';
    
    // Set colors based on type using palette colors
    let headerColor, headerText, icon;
    switch(type) {
        case 'success':
            headerColor = 'var(--secondary-green)';
            headerText = 'Success';
            icon = 'check-circle';
            break;
        case 'warning':
            headerColor = 'var(--secondary-orange)';
            headerText = 'Warning';
            icon = 'exclamation-triangle';
            break;
        case 'danger':
        case 'error':
            headerColor = 'var(--secondary-red)';
            headerText = 'Error';
            icon = 'exclamation-circle';
            break;
        case 'info':
        default:
            headerColor = 'var(--secondary-purple)';
            headerText = 'Info';
            icon = 'info-circle';
            break;
    }
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background-color: var(--primary-white);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        max-width: 350px;
        min-width: 300px;
        overflow: hidden;
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="
            background-color: ${headerColor};
            color: var(--primary-white);
            padding: 8px 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: space-between;
        ">
            <div style="display: flex; align-items: center;">
                <i class="fas fa-${icon} me-2" style="color: var(--primary-white); font-size: 16px;"></i>
                <span>${headerText}</span>
            </div>
            <button type="button" class="btn-close-custom" onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: var(--primary-white);
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                opacity: 0.8;
                line-height: 1;
            ">&times;</button>
        </div>
        <div style="
            background-color: var(--primary-white);
            color: var(--primary-black);
            padding: 12px 16px;
            font-weight: 400;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

// Alternative function names for backward compatibility
function showNotification(message, type = 'success') {
    showToast(message, type);
}

function showSuccessMessage(message, type = 'success') {
    showToast(message, type);
}

function showStandardizedToast(message, type = 'success') {
    showToast(message, type);
} 