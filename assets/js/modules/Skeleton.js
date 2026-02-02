/**
 * Loading Skeleton Component
 * Creates skeleton placeholders while content is loading
 */

const Skeleton = {
    /**
     * Create a skeleton element
     * @param {string} type - 'text' | 'title' | 'avatar' | 'card' | 'button'
     * @param {object} options - { width, height, className }
     */
    create(type = 'text', options = {}) {
        const el = document.createElement('div');
        el.className = `c-skeleton c-skeleton--${type} ${options.className || ''}`;

        if (options.width) el.style.width = options.width;
        if (options.height) el.style.height = options.height;

        return el;
    },

    /**
     * Create multiple skeleton lines
     * @param {number} count - Number of lines
     * @param {string} type - Type of skeleton
     */
    createLines(count = 3, type = 'text') {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '12px';

        for (let i = 0; i < count; i++) {
            const line = this.create(type);
            // Make last line shorter for natural look
            if (i === count - 1) {
                line.style.width = '60%';
            }
            container.appendChild(line);
        }

        return container;
    },

    /**
     * Create a card skeleton
     */
    createCard() {
        const card = document.createElement('div');
        card.style.cssText = 'padding: 20px; background: var(--bg-card, #fff); border-radius: 12px; border: 1px solid var(--border, #e2e8f0);';

        const header = document.createElement('div');
        header.style.cssText = 'display: flex; align-items: center; gap: 16px; margin-bottom: 16px;';
        header.appendChild(this.create('avatar'));

        const textGroup = document.createElement('div');
        textGroup.style.cssText = 'flex: 1; display: flex; flex-direction: column; gap: 8px;';
        textGroup.appendChild(this.create('title', { width: '150px' }));
        textGroup.appendChild(this.create('text', { width: '100px', height: '12px' }));
        header.appendChild(textGroup);

        card.appendChild(header);
        card.appendChild(this.createLines(2));

        return card;
    },

    /**
     * Replace element with skeleton and return restore function
     */
    replace(element) {
        const skeleton = this.create('card');
        skeleton.style.width = element.offsetWidth + 'px';
        skeleton.style.height = element.offsetHeight + 'px';

        const parent = element.parentNode;
        const originalDisplay = element.style.display;
        element.style.display = 'none';
        parent.insertBefore(skeleton, element);

        return () => {
            skeleton.remove();
            element.style.display = originalDisplay;
        };
    }
};

// Make available globally
window.Skeleton = Skeleton;

// Export for modules
export { Skeleton };
