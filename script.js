document.addEventListener('DOMContentLoaded', () => {

    // ===== UTILITIES =====

    // Reusable debounce (already exists, but moved to top)

    const debounce = (func, wait) => {

        let timeout;

        return function executedFunction(...args) {

            clearTimeout(timeout);

            timeout = setTimeout(() => func.apply(this, args), wait);

        };

    };

    // NEW: Throttle for scroll events

    const throttle = (func, limit) => {

        let inThrottle;

        return function (...args) {

            if (!inThrottle) {

                func.apply(this, args);

                inThrottle = true;

                setTimeout(() => inThrottle = false, limit);

            }

        };

    };

    // ===== 1. PRELOADER & HERO ANIMATION =====

    const preloader = document.getElementById('preloader');

    const initHeroAnimation = () => {

        const titleMain = document.querySelector('.hero-title-main');

        if (!titleMain) return;

        titleMain.style.opacity = '0';

        titleMain.style.transform = 'translateY(50px)';

        titleMain.style.transition = 'opacity 1s cubic-bezier(0.215, 0.61, 0.355, 1), transform 1s cubic-bezier(0.215, 0.61, 0.355, 1)';

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                titleMain.style.opacity = '1';

                titleMain.style.transform = 'translateY(0)';

            });

        });

    };

    window.addEventListener('load', () => {

        setTimeout(() => {

            if (preloader) {

                preloader.classList.add('hidden');

                // Remove from DOM after animation

                setTimeout(() => preloader.remove(), 1000);

            }

            setTimeout(initHeroAnimation, 500);

        }, 1500);

    });

    // ===== 2. INTERSECTION OBSERVER - TEXT REVEAL =====

    const initTextReveal = () => {

        const revealText = document.querySelector('.reveal-text');

        if (!revealText) return;

        const text = revealText.textContent.trim();

        const words = text.split(/\s+/);

        const fragment = document.createDocumentFragment(); // Performance optimization

        words.forEach(word => {

            const span = document.createElement('span');

            span.textContent = word + ' ';

            span.className = 'reveal-word';

            fragment.appendChild(span);

        });

        revealText.innerHTML = '';

        revealText.appendChild(fragment);

        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const spans = entry.target.querySelectorAll('.reveal-word');

                        spans.forEach((span, index) => {

                            setTimeout(() => span.classList.add('active'), index * 30);

                        });

                        observer.unobserve(entry.target);

                    }

                });

            },

            { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }

        );

        observer.observe(revealText);

    };

    initTextReveal();

    // ===== 3. PARALLAX EFFECT (THROTTLED) =====

    const parallaxImg = document.querySelector('.parallax-img');

    const handleParallax = throttle(() => {

        if (window.scrollY < window.innerHeight && parallaxImg) {

            const scrolled = window.scrollY;

            const translateY = scrolled * 0.5;

            const scale = 1 - (scrolled * 0.0005);

            const opacity = 1 - (scrolled * 0.001);

            parallaxImg.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;

            parallaxImg.style.opacity = opacity;

        }

    }, 16); // ~60fps

    if (parallaxImg) {

        window.addEventListener('scroll', handleParallax, { passive: true });

    }

    // ===== 4. HORIZONTAL SCROLL (OPTIMIZED) =====

    const workSection = document.getElementById('work');

    const horizontalContainer = document.getElementById('work-container');

    if (workSection && horizontalContainer) {

        let state = {

            current: 0,

            target: 0,

            limit: 0,

            ease: 0.08,

            rafId: null

        };

        const isMobile = () => window.innerWidth <= 768;

        const initHorizontalScroll = () => {

            if (!isMobile()) {

                const containerWidth = horizontalContainer.scrollWidth;

                const viewportWidth = window.innerWidth;

                const scrollDist = containerWidth - viewportWidth;

                state.limit = Math.max(0, scrollDist);

                workSection.style.height = `${scrollDist + (window.innerHeight * 1.5)}px`;

            } else {

                workSection.style.height = 'auto';

                horizontalContainer.style.transform = 'none';

                if (state.rafId) {

                    cancelAnimationFrame(state.rafId);

                    state.rafId = null;

                }

            }

        };

        const animateScroll = () => {

            if (isMobile()) return;

            const sectionTop = workSection.offsetTop;

            const scrollY = window.scrollY;

            if (scrollY >= sectionTop && scrollY <= sectionTop + workSection.offsetHeight) {

                const relativeScroll = scrollY - sectionTop;

                state.target = Math.min(Math.max(relativeScroll, 0), state.limit);

            }

            const diff = state.target - state.current;

            // Only update if difference is significant (performance)

            if (Math.abs(diff) > 0.1) {

                state.current += diff * state.ease;

                const skew = Math.max(-7, Math.min(7, diff * 0.15));

                horizontalContainer.style.transform =

                    `translate3d(-${state.current.toFixed(2)}px, 0, 0) skewX(${-skew.toFixed(2)}deg)`;

            }

            state.rafId = requestAnimationFrame(animateScroll);

        };

        const debouncedInit = debounce(() => {

            initHorizontalScroll();

            state.current = 0;

            state.target = 0;

        }, 150);

        window.addEventListener('resize', debouncedInit);

        initHorizontalScroll();

        if (!isMobile()) {

            animateScroll();

        }

    }

    // ===== 5. MENU TOGGLE =====

    const menuToggle = document.getElementById('menu-toggle');

    const menuClose = document.getElementById('menu-close');

    const menuOverlay = document.getElementById('menu-overlay');

    const menuLinks = document.querySelectorAll('.menu-link');

    // Make toggleMenu global for accessibility enhancement
    window.toggleMenu = () => {

        if (menuOverlay) {

            const isActive = menuOverlay.classList.toggle('active');

            // Prevent body scroll when menu is open

            document.body.style.overflow = isActive ? 'hidden' : '';

            // Focus management
            if (isActive) {
                setTimeout(() => menuClose?.focus(), 100);
            } else {
                menuToggle?.focus();
            }

        }

    };

    if (menuToggle) menuToggle.addEventListener('click', window.toggleMenu);

    if (menuClose) menuClose.addEventListener('click', window.toggleMenu);

    menuLinks.forEach(link => link.addEventListener('click', window.toggleMenu));

    // Close menu on escape key

    document.addEventListener('keydown', (e) => {

        if (e.key === 'Escape' && menuOverlay?.classList.contains('active')) {

            window.toggleMenu();

        }

    });

    // ===== ENHANCED MENU ACCESSIBILITY =====
    const enhanceMenuAccessibility = () => {
        if (!menuOverlay) return;

        const focusableElements = menuOverlay.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled])'
        );

        if (!focusableElements.length) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Trap focus inside menu when open
        menuOverlay.addEventListener('keydown', (e) => {
            if (!menuOverlay.classList.contains('active')) return;

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    };

    enhanceMenuAccessibility();

    // ===== SWIPE TO CLOSE MENU =====
    const addMenuSwipeGesture = () => {
        if (!menuOverlay) return;

        let touchStartY = 0;
        let touchEndY = 0;

        menuOverlay.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        menuOverlay.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            const swipeDistance = touchEndY - touchStartY;
            // Swipe down to close (at least 100px)
            if (swipeDistance > 100 && menuOverlay.classList.contains('active')) {
                window.toggleMenu();
            }
        }, { passive: true });
    };

    addMenuSwipeGesture();

    // ===== 6. MAGNETIC BUTTONS (OPTIMIZED) =====

    const magneticBtns = document.querySelectorAll('.btn-royal, .menu-toggle, .social-links a, .hover-magnetic, .btn-circle');

    // Only enable on non-touch devices

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {

        magneticBtns.forEach(btn => {

            const handleMouseMove = throttle((e) => {

                const rect = btn.getBoundingClientRect();

                const x = e.clientX - rect.left - rect.width / 2;

                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

                const btnText = btn.querySelector('.btn-text');

                if (btnText) {

                    btnText.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;

                }

            }, 16);

            btn.addEventListener('mousemove', handleMouseMove);

            btn.addEventListener('mouseleave', () => {

                btn.style.transform = 'translate(0px, 0px)';

                const btnText = btn.querySelector('.btn-text');

                if (btnText) btnText.style.transform = 'translate(0px, 0px)';

            });

        });

    }

    // ===== 7. ATMOSPHERIC GLOW ORB =====

    const orb = document.querySelector('.glow-orb');

    if (orb && window.matchMedia('(hover: hover)').matches) {

        const handleOrbMove = throttle((e) => {

            const x = (e.clientX / window.innerWidth) * 50;

            const y = (e.clientY / window.innerHeight) * 50;

            orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        }, 32);

        document.addEventListener('mousemove', handleOrbMove, { passive: true });

    }

    // ===== 8. FOOTER UTILITIES =====

    // Live Time with proper timezone handling

    const updateTime = () => {

        const timeEl = document.getElementById('live-time');

        if (timeEl) {

            const now = new Date();

            timeEl.textContent = now.toLocaleTimeString('en-IN', {

                hour: 'numeric',

                minute: '2-digit',

                hour12: true,

                timeZone: 'Asia/Kolkata'

            });

        }

    };

    const timeEl = document.getElementById('live-time');

    if (timeEl) {

        updateTime();

        setInterval(updateTime, 1000);

    }

    // Back to Top with smooth scroll

    const backTopBtn = document.getElementById('back-to-top');

    if (backTopBtn) {

        backTopBtn.addEventListener('click', (e) => {

            e.preventDefault();

            window.scrollTo({

                top: 0,

                behavior: 'smooth'

            });

        });

        // Show/hide button based on scroll position

        const toggleBackBtn = throttle(() => {

            if (window.scrollY > 500) {

                backTopBtn.style.opacity = '1';

                backTopBtn.style.pointerEvents = 'auto';

            } else {

                backTopBtn.style.opacity = '0';

                backTopBtn.style.pointerEvents = 'none';

            }

        }, 100);

        window.addEventListener('scroll', toggleBackBtn, { passive: true });

    }

    // ===== 9. LAZY LOADING IMAGES =====

    if ('IntersectionObserver' in window) {

        const imageObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const img = entry.target;

                    if (img.dataset.src) {

                        img.src = img.dataset.src;

                        img.removeAttribute('data-src');

                    }

                    imageObserver.unobserve(img);

                }

            });

        }, { rootMargin: '50px' });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));

    }

    // ===== 10. FORM VALIDATION & FEEDBACK =====
    const enhanceFormUX = () => {
        const form = document.querySelector('.contact-form form');
        const submitBtn = document.querySelector('.btn-submit');

        if (!form || !submitBtn) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> Sending...';

            // Simulate form submission (replace with actual logic)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '✓ Message Sent!';
                submitBtn.style.background = '#4CAF50';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    form.reset();
                }, 3000);
            }, 2000);
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.validity.valid && input.value) {
                    input.style.borderBottomColor = '#4CAF50';
                } else if (input.value && !input.validity.valid) {
                    input.style.borderBottomColor = '#ff4444';
                } else {
                    input.style.borderBottomColor = '';
                }
            });
        });
    };

    enhanceFormUX();

});

// Add spin animation for loading state
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
