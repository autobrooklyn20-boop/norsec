/**
 * Purchase Modal for Norton Landing Page
 * Handles modal functionality for checkout form
 */

class PurchaseModal {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.closeBtn = null;
        this.productRadios = null;
        this.subtotalElement = null;
        this.totalElement = null;
        this.formProductInput = null;
        this.productPrices = {
            'norton_plus': 39.99,
            'norton_deluxe': 89.99,
            'norton_premium': 119.99
        };
        
        this.init();
    }
    
    init() {
        // Create modal HTML structure
        this.createModalStructure();
        
        // Get references to elements
        this.modal = document.getElementById('purchase-modal');
        this.overlay = document.getElementById('modal-overlay');
        this.closeBtn = document.getElementById('modal-close');
        this.productRadios = document.querySelectorAll('input[name="product"]');
        this.subtotalElement = document.getElementById('subtotal');
        this.totalElement = document.getElementById('total');
        this.formProductInput = document.getElementById('form_product');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize price display
        this.updatePrice(this.getSelectedProduct());
        
        console.log('PurchaseModal initialized');
    }
    
    createModalStructure() {
        // Check if modal already exists
        if (document.getElementById('purchase-modal')) {
            return;
        }
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.className = 'modal-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'purchase-modal';
        modal.className = 'modal-container';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');
        
        // Modal header
        modal.innerHTML = `
            <div class="modal-header">
                <h2 id="modal-title" class="text-3xl md:text-4xl font-bold text-norton-black mb-2">Complete Your Purchase</h2>
                <p class="text-gray-600 mb-6">Fill out the form below to get your Norton license key delivered instantly via email.</p>
                <button id="modal-close" class="modal-close" aria-label="Close modal">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="modal-content">
                <!-- Content will be moved here from checkout template -->
            </div>
        `;
        
        // Append to body
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        // Move checkout template content into modal
        const template = document.getElementById('checkout-template');
        if (template) {
            const content = modal.querySelector('.modal-content');
            content.innerHTML = template.innerHTML;
        }
    }
    
    setupEventListeners() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Overlay click
        this.overlay.addEventListener('click', () => this.close());
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
        
        // Product radio changes
        this.productRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    this.updatePrice(radio.value);
                }
            });
        });
        
        // Form submission
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                // Optional: Add loading state
                const submitButton = checkoutForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Processing...';
                submitButton.disabled = true;
                
                // Form will be submitted to Web3Forms
                // Reset button after 5 seconds in case of error
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 5000);
            });
        }
    }
    
    open(productId = null) {
        // Set product selection if provided
        if (productId && this.productPrices.hasOwnProperty(productId)) {
            const radio = document.querySelector(`input[name="product"][value="${productId}"]`);
            if (radio) {
                radio.checked = true;
                this.updatePrice(productId);
            }
        }
        
        // Show modal and overlay
        this.modal.classList.add('modal-open');
        this.overlay.classList.add('modal-open');
        this.modal.setAttribute('aria-hidden', 'false');
        this.overlay.setAttribute('aria-hidden', 'false');
        
        // Trap focus inside modal
        this.trapFocus();
        
        // Prevent body scrolling
        document.body.classList.add('modal-active');
        
        console.log(`Modal opened ${productId ? 'with product ' + productId : ''}`);
    }
    
    close() {
        // Hide modal and overlay
        this.modal.classList.remove('modal-open');
        this.overlay.classList.remove('modal-open');
        this.modal.setAttribute('aria-hidden', 'true');
        this.overlay.setAttribute('aria-hidden', 'true');
        
        // Restore body scrolling
        document.body.classList.remove('modal-active');
        
        // Restore focus to the button that opened the modal
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
        
        console.log('Modal closed');
    }
    
    isOpen() {
        return this.modal.classList.contains('modal-open');
    }
    
    getSelectedProduct() {
        const checkedRadio = document.querySelector('input[name="product"]:checked');
        return checkedRadio ? checkedRadio.value : 'norton_plus';
    }
    
    updatePrice(selectedProduct) {
        const price = this.productPrices[selectedProduct];
        if (this.subtotalElement) {
            this.subtotalElement.textContent = `$${price.toFixed(2)}`;
        }
        if (this.totalElement) {
            this.totalElement.textContent = `$${price.toFixed(2)}`;
        }
        if (this.formProductInput) {
            this.formProductInput.value = selectedProduct;
        }
    }
    
    trapFocus() {
        // Store the element that had focus before modal opened
        this.lastFocusedElement = document.activeElement;
        
        // Get all focusable elements in modal
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Trap focus within modal
        this.modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.purchaseModal = new PurchaseModal();
    
    // Set up Buy Now buttons
    document.querySelectorAll('[data-product-id]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.getAttribute('data-product-id');
            window.purchaseModal.open(productId);
        });
    });
    
    // Update navigation links that point to #checkout
    document.querySelectorAll('a[href="#checkout"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.purchaseModal.open();
        });
    });
    
    // Handle data-modal-open attribute
    document.querySelectorAll('[data-modal-open]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.purchaseModal.open();
        });
    });
    
    console.log('PurchaseModal setup complete');
});