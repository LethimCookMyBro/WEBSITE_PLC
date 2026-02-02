/**
 * Toast Notification System
 * Usage: Toast.success('Title', 'Message') or Toast.error('Title', 'Message')
 */

const Toast = {
    container: null,

    init() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.className = 'c-toast-container';
        this.container.id = 'toastContainer';
        document.body.appendChild(this.container);
    },

    show(type, title, message, duration = 4000) {
        this.init();

        const icons = {
            success: 'fa-check',
            error: 'fa-times',
            warning: 'fa-exclamation',
            info: 'fa-info'
        };

        const toast = document.createElement('div');
        toast.className = `c-toast c-toast--${type}`;
        toast.innerHTML = `
      <div class="c-toast__icon">
        <i class="fas ${icons[type]}"></i>
      </div>
      <div class="c-toast__content">
        <div class="c-toast__title">${title}</div>
        ${message ? `<div class="c-toast__message">${message}</div>` : ''}
      </div>
      <button class="c-toast__close" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>
    `;

        // Close button handler
        toast.querySelector('.c-toast__close').addEventListener('click', () => {
            this.hide(toast);
        });

        this.container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('c-toast--visible');
        });

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => this.hide(toast), duration);
        }

        return toast;
    },

    hide(toast) {
        toast.classList.remove('c-toast--visible');
        setTimeout(() => {
            toast.remove();
        }, 300);
    },

    success(title, message, duration) {
        return this.show('success', title, message, duration);
    },

    error(title, message, duration) {
        return this.show('error', title, message, duration);
    },

    warning(title, message, duration) {
        return this.show('warning', title, message, duration);
    },

    info(title, message, duration) {
        return this.show('info', title, message, duration);
    }
};

// Make available globally
window.Toast = Toast;

// Export for modules
export { Toast };
