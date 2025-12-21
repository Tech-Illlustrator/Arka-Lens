document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FULL SCREEN MENU LOGIC ---
    const menuBtn = document.querySelector('.menu-trigger');
    const fullMenu = document.querySelector('.fullscreen-menu');
    const header = document.querySelector('.floating-header');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (menuBtn && fullMenu) {
        menuBtn.addEventListener('click', () => {
            fullMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');

            // Toggle header color state
            if (header) header.classList.toggle('menu-active');

            // Toggle body scroll
            document.body.style.overflow = fullMenu.classList.contains('active') ? 'hidden' : '';
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                fullMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                if (header) header.classList.remove('menu-active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- 2. TIME CLOCK ---
    const timeEl = document.getElementById('local-time');
    if (timeEl) {
        const updateTime = () => {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit', minute: '2-digit', hour12: true
            }) + ' IST';
        };
        setInterval(updateTime, 1000);
        updateTime();
    }

    // --- 3. CUSTOM CURSOR (OPTIMIZED) ---
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursorDot = document.querySelector('.cursor-dot') || document.createElement('div');
        const cursorOutline = document.querySelector('.cursor-outline') || document.createElement('div');

        if (!document.querySelector('.cursor-dot')) {
            cursorDot.className = 'cursor-dot';
            cursorOutline.className = 'cursor-outline';
            document.body.appendChild(cursorDot);
            document.body.appendChild(cursorOutline);
        }

        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Move dot instantly
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        // Smooth follow loop
        const animateCursor = () => {
            // Lerp (Linear Interpolation) for smoothness
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;

            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();
    }

    // --- 4. MAGNETIC BUTTONS (Performance Tweak) ---
    const magneticBtns = document.querySelectorAll('.apple-button');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- 5. HERO PARALLAX (Only when visible) ---
    const heroMedia = document.querySelector('.media-layer');
    if (heroMedia) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const scale = 1.1 - (scrolled * 0.0005);
                // Use translateZ for GPU
                heroMedia.style.transform = `scale(${Math.max(1.0, scale)}) translateZ(0)`;
            }
        }, { passive: true });
    }

    // --- 6. OPTIMIZED STACK ENGINE (Observer + RequestAnimationFrame) ---
    const stackSection = document.querySelector('.stack-engine');
    const stackCards = document.querySelectorAll('.stack-card');

    if (stackSection && stackCards.length > 0) {
        let isStackVisible = false;

        const observer = new IntersectionObserver((entries) => {
            isStackVisible = entries[0].isIntersecting;
        }, { rootMargin: "200px 0px" });
        observer.observe(stackSection);

        const animateStack = () => {
            if (isStackVisible) {
                const windowHeight = window.innerHeight;
                stackCards.forEach((card, index) => {
                    const nextCard = stackCards[index + 1];
                    if (nextCard) {
                        const nextRect = nextCard.getBoundingClientRect();
                        const start = windowHeight;
                        const end = 60;
                        let progress = (start - nextRect.top) / (start - end);
                        progress = Math.max(0, Math.min(1, progress));

                        if (progress > 0) {
                            card.style.transform = `scale(${1 - (progress * 0.1)})`;
                            card.style.filter = `brightness(${1 - (progress * 0.6)})`;
                            card.style.opacity = `${1 - (progress * 0.5)}`;
                        } else {
                            card.style.transform = 'scale(1)';
                            card.style.filter = 'brightness(1)';
                            card.style.opacity = '1';
                        }
                    }
                });
            }
            requestAnimationFrame(animateStack);
        };
        animateStack();
    }

    // --- 7. HORIZONTAL REEL ENGINE (Desktop Only) ---
    const reelSection = document.querySelector('.horizontal-scroll-view');
    const track = document.querySelector('.horizontal-track');

    if (reelSection && track) {
        const handleScroll = () => {
            const isDesktop = window.innerWidth > 1024;
            const hasMouse = window.matchMedia("(hover: hover)").matches;

            if (isDesktop && hasMouse) {
                const offsetTop = reelSection.offsetTop;
                const scrollY = window.scrollY;
                const viewHeight = window.innerHeight;
                const sectionHeight = reelSection.offsetHeight;

                // Only calculate if section is roughly in view
                if (scrollY + viewHeight > offsetTop && scrollY < offsetTop + sectionHeight) {
                    const start = offsetTop;
                    const end = offsetTop + sectionHeight - viewHeight;
                    let progress = (scrollY - start) / (end - start);
                    progress = Math.max(0, Math.min(1, progress));
                    const maxScroll = track.scrollWidth - window.innerWidth;
                    const translate = maxScroll * progress;
                    track.style.transform = `translateX(-${translate}px)`;
                }
            } else {
                track.style.transform = 'none';
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', () => {
            const isDesktop = window.innerWidth > 1024;
            const hasMouse = window.matchMedia("(hover: hover)").matches;
            if (!isDesktop || !hasMouse) track.style.transform = 'none';
            else handleScroll();
        });
    }

    // --- 8. GLOBAL IMAGE PARALLAX (Observer Optimized) ---
    const parallaxImages = document.querySelectorAll('.card-visual img, .reel-visual img');

    if (parallaxImages.length > 0) {
        // Mark images as 'in-view' so we only animate what we see
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('in-view');
                else entry.target.classList.remove('in-view');
            });
        });

        parallaxImages.forEach(img => observer.observe(img));

        const animateParallax = () => {
            const windowHeight = window.innerHeight;
            const activeImages = document.querySelectorAll('img.in-view');

            activeImages.forEach(img => {
                const container = img.parentElement;
                const rect = container.getBoundingClientRect();
                const centerY = windowHeight / 2;
                const containerCenter = rect.top + (rect.height / 2);
                const translateY = (containerCenter - centerY) * 0.15;
                // GPU accelerated translation
                img.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.1)`;
            });
            requestAnimationFrame(animateParallax);
        };
        animateParallax();
    }

    // --- 9. CONTACT MODAL & VIDEO LIGHTBOX ---
    const modal = document.getElementById('contact-modal');
    const modalTriggers = document.querySelectorAll('.contact-trigger');
    const modalClose = document.querySelector('.modal-close-btn');

    const videoModal = document.getElementById('video-lightbox');
    const videoFrame = document.getElementById('video-frame');
    const videoTriggers = document.querySelectorAll('.video-trigger');
    const closeVideo = document.getElementById('close-video');

    // Contact Modal Logic
    if (modal && modalTriggers.length > 0) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                // Close menu if open
                const fullMenu = document.querySelector('.fullscreen-menu');
                const menuBtn = document.querySelector('.menu-trigger');
                if (fullMenu && fullMenu.classList.contains('active')) {
                    fullMenu.classList.remove('active');
                    menuBtn.classList.remove('active');
                }
            });
        });
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        if (modalClose) modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
    }

    // Video Modal Logic
    if (videoModal && videoTriggers.length > 0) {
        videoTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const videoId = btn.getAttribute('data-video-id');
                if (videoId) {
                    videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    videoModal.classList.add('active');
                }
            });
        });
        const hideVideo = () => {
            videoModal.classList.remove('active');
            videoFrame.src = '';
        };
        if (closeVideo) closeVideo.addEventListener('click', hideVideo);
        videoModal.addEventListener('click', (e) => { if (e.target === videoModal) hideVideo(); });
    }

    // --- 10. REVEAL ON SCROLL (Work Page) ---
    const workItems = document.querySelectorAll('.work-item');
    if (workItems.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('reveal');
            });
        }, { threshold: 0.1 });
        workItems.forEach(item => revealObserver.observe(item));
    }

    // --- 11. ACTIVE MENU HIGHLIGHT ---
    const currentPath = window.location.pathname;
    const menuLinksAll = document.querySelectorAll('.menu-link');
    menuLinksAll.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.endsWith(linkPath) || (currentPath === '/' && linkPath === 'index.html')) {
            link.style.color = 'var(--accent-gold)';
            link.style.paddingLeft = '20px';
        }
    });

    // --- 12. REAL PRELOADER (Load-based) ---
    const preloader = document.querySelector('.preloader');
    const barFill = document.querySelector('.bar-fill');

    if (preloader) {
        // Collect all images/videos to monitor
        const media = [...document.querySelectorAll('img'), ...document.querySelectorAll('video')];
        let loadedCount = 0;

        const updateProgress = () => {
            loadedCount++;
            const percent = Math.round((loadedCount / media.length) * 100);
            barFill.style.width = `${percent}%`;

            if (loadedCount >= media.length) {
                setTimeout(() => {
                    preloader.classList.add('complete');
                }, 500);
            }
        };

        if (media.length === 0) {
            barFill.style.width = '100%';
            setTimeout(() => preloader.classList.add('complete'), 500);
        } else {
            media.forEach(file => {
                if (file.complete) {
                    updateProgress();
                } else {
                    file.addEventListener('load', updateProgress);
                    file.addEventListener('error', updateProgress);
                }
            });
        }
    }

    // --- 13. CURSOR HOVER STATES ---
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverTargets = document.querySelectorAll('.work-item, .card-visual, .reel-visual, a, button');

    if (cursorOutline && hoverTargets.length > 0) {
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            target.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }
    // --- 14. EMAILJS INTEGRATION (The Engine) ---
    const contactForm = document.getElementById('contact-form'); // Ensure you added id="contact-form" to your HTML <form>

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page reload

            // 1. Get the button to change its text state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            // 2. Visual Feedback: "Sending..."
            submitBtn.innerText = 'SENDING...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            // 3. Gather Data
            const formData = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                // Add the current time for your reference
                timestamp: new Date().toLocaleString()
            };

            // 4. Send to EmailJS
            // REPLACE 'service_ID' and 'template_ID' with your actual IDs from Phase 1
            emailjs.send('service_jwzflrh', 'template_fkw01bj', formData)
                .then(() => {
                    // SUCCESS STATE
                    submitBtn.innerText = 'MESSAGE SENT';
                    submitBtn.style.backgroundColor = '#bf9b30'; // Gold
                    submitBtn.style.color = '#5e0b15'; // Maroon

                    // Clear form
                    contactForm.reset();

                    // Close modal after 2 seconds
                    setTimeout(() => {
                        document.querySelector('.modal-backdrop').classList.remove('active');
                        document.body.style.overflow = '';
                        // Reset button for next time
                        submitBtn.innerText = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.color = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                    }, 2000);
                })
                .catch((error) => {
                    // ERROR STATE
                    console.error('Email Error:', error);
                    submitBtn.innerText = 'FAILED. TRY AGAIN.';
                    submitBtn.style.backgroundColor = 'red';

                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                    }, 3000);
                });
        });
    }
    // --- 15. BEFORE/AFTER SLIDER LOGIC ---
    const compRange = document.querySelector('.comparison-range');
    const compBefore = document.querySelector('.comp-img.before');
    const compLine = document.querySelector('.slider-line');

    if (compRange && compBefore && compLine) {
        compRange.addEventListener('input', (e) => {
            const val = e.target.value;
            // Update the clipping of the top image
            // inset(top right bottom left) -> we change 'right' based on 100 - val
            compBefore.style.clipPath = `inset(0 ${100 - val}% 0 0)`;

            // Move the gold line
            compLine.style.left = `${val}%`;
        });
    }
});