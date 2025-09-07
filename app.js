// ALL STAR Real Estate Website - JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // NAVIGATION FUNCTIONALITY
    // ========================================
    
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);
            
            if (correspondingNavLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingNavLink.classList.add('active');
                } else {
                    correspondingNavLink.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', scrollActive);
    
    // ========================================
    // PROPERTY FILTERING
    // ========================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            propertyCards.forEach(card => {
                const cardTypes = card.getAttribute('data-type') || '';
                
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else if (cardTypes.includes(filterValue)) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
        });
    });
    
    // ========================================
    // PROPERTY SEARCH FUNCTIONALITY
    // ========================================
    
    const searchForm = document.getElementById('search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(searchForm);
            const searchData = {
                location: formData.get('location'),
                propertyType: formData.get('property-type'),
                minPrice: formData.get('min-price'),
                maxPrice: formData.get('max-price')
            };
            
            // Filter properties based on search criteria
            filterPropertiesBySearch(searchData);
            
            // Scroll to properties section
            document.getElementById('properties').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    function filterPropertiesBySearch(searchData) {
        const properties = document.querySelectorAll('.property-card');
        let visibleCount = 0;
        
        properties.forEach(property => {
            let shouldShow = true;
            
            // Check location filter
            if (searchData.location) {
                const propertyLocation = property.querySelector('.property-card__location').textContent.toLowerCase();
                if (!propertyLocation.includes(searchData.location.toLowerCase())) {
                    shouldShow = false;
                }
            }
            
            // Check property type filter
            if (searchData.propertyType) {
                const propertyTitle = property.querySelector('h3').textContent.toLowerCase();
                if (searchData.propertyType === 'residential' && !propertyTitle.includes('villa') && !propertyTitle.includes('house')) {
                    shouldShow = false;
                } else if (searchData.propertyType === 'commercial' && !propertyTitle.includes('commercial')) {
                    shouldShow = false;
                } else if (searchData.propertyType === 'plot' && !propertyTitle.includes('plot')) {
                    shouldShow = false;
                }
            }
            
            // Check price filter (simplified - in a real app, this would be more sophisticated)
            if (searchData.minPrice || searchData.maxPrice) {
                const priceText = property.querySelector('.property-card__price').textContent;
                const price = parseInt(priceText.replace(/[₹,]/g, ''));
                
                if (searchData.minPrice && price < parseInt(searchData.minPrice)) {
                    shouldShow = false;
                }
                if (searchData.maxPrice && price > parseInt(searchData.maxPrice)) {
                    shouldShow = false;
                }
            }
            
            if (shouldShow) {
                property.style.display = 'block';
                property.classList.add('fade-in');
                visibleCount++;
            } else {
                property.style.display = 'none';
                property.classList.remove('fade-in');
            }
        });
        
        // Show message if no properties found
        showSearchResults(visibleCount);
    }
    
    function showSearchResults(count) {
        // Remove existing result message
        const existingMessage = document.querySelector('.search-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Add result message
        const propertiesGrid = document.querySelector('.properties__grid');
        const message = document.createElement('div');
        message.className = 'search-results-message';
        
        if (count === 0) {
            message.innerHTML = `
                <p>No properties found matching your search criteria.</p>
                <button class="btn btn--primary" onclick="resetPropertyFilter()">Show All Properties</button>
            `;
        } else {
            message.innerHTML = `<p>Found ${count} propert${count === 1 ? 'y' : 'ies'} matching your search.</p>`;
        }
        
        propertiesGrid.insertBefore(message, propertiesGrid.firstChild);
    }
    
    // Reset property filter function (global scope for button onclick)
    window.resetPropertyFilter = function() {
        propertyCards.forEach(card => {
            card.style.display = 'block';
            card.classList.add('fade-in');
        });
        
        // Reset filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        
        // Remove search results message
        const message = document.querySelector('.search-results-message');
        if (message) {
            message.remove();
        }
        
        // Reset search form
        if (searchForm) {
            searchForm.reset();
        }
    };
    
    // ========================================
    // ENHANCED CONTACT FORM VALIDATION & SUBMISSION
    // ========================================
    
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    if (contactForm) {
        // Real-time validation
        const formFields = contactForm.querySelectorAll('.form-control');
        formFields.forEach(field => {
            field.addEventListener('blur', () => validateSingleField(field));
            field.addEventListener('input', () => clearFieldError(field));
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearAllFormErrors();
            
            // Validate form
            let isValid = true;
            const formData = new FormData(contactForm);
            
            // Validate name
            const nameField = document.getElementById('name');
            const name = formData.get('name').trim();
            if (!name) {
                showFieldError(nameField, 'Please enter your full name');
                isValid = false;
            } else if (name.length < 2) {
                showFieldError(nameField, 'Name must be at least 2 characters long');
                isValid = false;
            }
            
            // Validate email
            const emailField = document.getElementById('email');
            const email = formData.get('email').trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showFieldError(emailField, 'Please enter your email address');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone
            const phoneField = document.getElementById('phone');
            const phone = formData.get('phone').trim();
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (!phone) {
                showFieldError(phoneField, 'Please enter your phone number');
                isValid = false;
            } else if (!phoneRegex.test(phone)) {
                showFieldError(phoneField, 'Please enter a valid phone number (10+ digits)');
                isValid = false;
            }
            
            // Validate message
            const messageField = document.getElementById('message');
            const message = formData.get('message').trim();
            if (!message) {
                showFieldError(messageField, 'Please enter your message');
                isValid = false;
            } else if (message.length < 10) {
                showFieldError(messageField, 'Message must be at least 10 characters long');
                isValid = false;
            }
            
            if (isValid) {
                submitForm({
                    name: name,
                    email: email,
                    phone: phone,
                    interest: formData.get('interest'),
                    message: message
                });
            } else {
                // Scroll to first error
                const firstError = contactForm.querySelector('.form-control.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    }
    
    function validateSingleField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        
        clearFieldError(field);
        
        switch (fieldName) {
            case 'name':
                if (!value) {
                    showFieldError(field, 'Please enter your full name');
                } else if (value.length < 2) {
                    showFieldError(field, 'Name must be at least 2 characters long');
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    showFieldError(field, 'Please enter your email address');
                } else if (!emailRegex.test(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                }
                break;
            case 'phone':
                const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
                if (!value) {
                    showFieldError(field, 'Please enter your phone number');
                } else if (!phoneRegex.test(value)) {
                    showFieldError(field, 'Please enter a valid phone number (10+ digits)');
                }
                break;
            case 'message':
                if (!value) {
                    showFieldError(field, 'Please enter your message');
                } else if (value.length < 10) {
                    showFieldError(field, 'Message must be at least 10 characters long');
                }
                break;
        }
    }
    
    function showFieldError(field, message) {
        const errorId = field.getAttribute('id') + '-error';
        const errorElement = document.getElementById(errorId);
        
        field.classList.add('error');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            errorElement.style.display = 'block';
        }
    }
    
    function clearFieldError(field) {
        const errorId = field.getAttribute('id') + '-error';
        const errorElement = document.getElementById(errorId);
        
        field.classList.remove('error');
        
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
    }
    
    function clearAllFormErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        const fieldElements = document.querySelectorAll('.form-control');
        
        errorElements.forEach(element => {
            element.classList.remove('show');
            element.style.display = 'none';
            element.textContent = '';
        });
        
        fieldElements.forEach(element => {
            element.classList.remove('error');
        });
    }
    
    function submitForm(data) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending Message...';
        submitBtn.disabled = true;
        
        // Simulate form submission (in real app, this would make an API call)
        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            formSuccess.classList.remove('hidden');
            formSuccess.classList.add('visible');
            
            // Reset form after delay
            setTimeout(() => {
                contactForm.style.display = 'block';
                formSuccess.classList.add('hidden');
                formSuccess.classList.remove('visible');
                contactForm.reset();
                clearAllFormErrors();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 5000);
            
        }, 2000);
    }
    
    // ========================================
    // PROPERTY CARD INTERACTIONS
    // ========================================
    
    const propertyViewBtns = document.querySelectorAll('.property-card .btn');
    
    propertyViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const propertyCard = this.closest('.property-card');
            const propertyTitle = propertyCard.querySelector('h3').textContent;
            const propertyPrice = propertyCard.querySelector('.property-card__price').textContent;
            
            // Pre-fill contact form with property interest
            const contactSection = document.getElementById('contact');
            const interestField = document.getElementById('interest');
            const messageField = document.getElementById('message');
            
            if (interestField) {
                interestField.value = 'buying';
            }
            
            if (messageField) {
                messageField.value = `I am interested in "${propertyTitle}" priced at ${propertyPrice}. Please provide more details.`;
            }
            
            // Show notification
            showNotification(`Interest noted for "${propertyTitle}". Please fill out the contact form below.`, 'info');
            
            // Scroll to contact section
            contactSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // ========================================
    // NOTIFICATION SYSTEM
    // ========================================
    
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-surface);
            color: var(--color-text);
            padding: var(--space-16) var(--space-20);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            max-width: 350px;
            border-left: 4px solid var(--color-brand-primary);
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--space-8);">
                <span style="font-size: var(--font-size-lg);">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
    
    // ========================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ========================================
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateOnScroll = document.querySelectorAll('.service-card, .property-card, .feature, .contact__info, .contact__form');
    animateOnScroll.forEach(el => observer.observe(el));
    
    // ========================================
    // CTA BUTTON INTERACTIONS
    // ========================================
    
    const ctaButtons = document.querySelectorAll('.nav__cta, .hero__actions .btn');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.textContent.includes('Contact')) {
                e.preventDefault();
                document.getElementById('contact').scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (this.textContent.includes('Properties')) {
                e.preventDefault();
                document.getElementById('properties').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // PHONE NUMBER CLICK TO CALL
    // ========================================
    
    const phoneNumbers = document.querySelectorAll('.nav__phone, .contact__item p');
    phoneNumbers.forEach(phone => {
        if (phone.textContent.includes('+91')) {
            phone.style.cursor = 'pointer';
            phone.title = 'Click to call';
            phone.addEventListener('click', function() {
                window.open('tel:' + phone.textContent.replace(/\s/g, ''), '_self');
            });
        }
    });
    
    // ========================================
    // SEARCH FORM ENHANCEMENTS
    // ========================================
    
    // Auto-format price inputs
    const priceInputs = document.querySelectorAll('input[name="min-price"], input[name="max-price"]');
    priceInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove non-digit characters
            let value = this.value.replace(/\D/g, '');
            
            // Format with commas
            if (value) {
                value = parseInt(value).toLocaleString('en-IN');
                this.value = value;
            }
        });
        
        input.addEventListener('blur', function() {
            // Add currency symbol on blur if value exists
            if (this.value && !this.value.includes('₹')) {
                this.value = '₹' + this.value;
            }
        });
        
        input.addEventListener('focus', function() {
            // Remove currency symbol on focus
            this.value = this.value.replace('₹', '');
        });
    });
    
    // ========================================
    // KEYBOARD ACCESSIBILITY
    // ========================================
    
    // Escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ========================================
    // PERFORMANCE OPTIMIZATIONS
    // ========================================
    
    // Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        scrollActive();
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    console.log('ALL STAR Real Estate website loaded successfully!');
    
    // Set initial active nav link
    if (window.location.hash) {
        const targetLink = document.querySelector(`.nav__link[href="${window.location.hash}"]`);
        if (targetLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            targetLink.classList.add('active');
        }
    }
    
    // Add notification styles to document
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(notificationStyles);
    
});

// ========================================
// UTILITY FUNCTIONS (Global scope)
// ========================================

// Format Indian currency
function formatIndianCurrency(amount) {
    return '₹' + parseInt(amount).toLocaleString('en-IN');
}

// Validate Indian phone number
function validateIndianPhone(phone) {
    const phoneRegex = /^[\+]?91[-\s]?[789]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Generate WhatsApp link for quick contact
function generateWhatsAppLink(phone, message) {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

// Check if device is mobile
function isMobileDevice() {
    return window.innerWidth <= 768;
}