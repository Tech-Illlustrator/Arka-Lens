document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FULL SCREEN MENU LOGIC ---
    const menuBtn = document.querySelector('.menu-trigger');
    const fullMenu = document.querySelector('.fullscreen-menu');
    const header = document.querySelector('.floating-header'); // Select the header
    const menuLinks = document.querySelectorAll('.menu-link');

    if (menuBtn && fullMenu) {
        menuBtn.addEventListener('click', () => {
            fullMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');

            // TOGGLE HEADER COLOR STATE (For Logo visibility)
            if (header) header.classList.toggle('menu-active');

            // Toggle body scroll
            document.body.style.overflow = fullMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                fullMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                if (header) header.classList.remove('menu-active'); // Reset header
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

    // --- 3. CUSTOM CURSOR ---
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursorDot = document.createElement('div');
        const cursorOutline = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        cursorOutline.className = 'cursor-outline';
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // --- 4. MAGNETIC BUTTONS ---
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

    // --- 5. HERO PARALLAX ---
    const heroMedia = document.querySelector('.media-layer');
    if (heroMedia) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const scale = 1.1 - (scrolled * 0.0005);
                heroMedia.style.transform = `scale(${Math.max(1.0, scale)})`;
            }
        }, { passive: true });
    }

    // --- 6. STACK ENGINE (Work Page) ---
    const cards = document.querySelectorAll('.stack-card');
    if (cards.length > 0) {
        const animateStack = () => {
            const windowHeight = window.innerHeight;
            cards.forEach((card, index) => {
                const nextCard = cards[index + 1];
                if (nextCard) {
                    const nextRect = nextCard.getBoundingClientRect();
                    const start = windowHeight;
                    const end = 60;
                    let progress = (start - nextRect.top) / (start - end);
                    progress = Math.max(0, Math.min(1, progress));

                    if (progress > 0) {
                        const scale = 1 - (progress * 0.1);
                        const filter = 1 - (progress * 0.6);
                        card.style.transform = `scale(${scale})`;
                        card.style.filter = `brightness(${filter})`;
                        card.style.opacity = `${1 - (progress * 0.5)}`;
                    } else {
                        card.style.transform = 'scale(1)';
                        card.style.filter = 'brightness(1)';
                        card.style.opacity = '1';
                    }
                }
            });
            requestAnimationFrame(animateStack);
        };
        requestAnimationFrame(animateStack);
    }

    // --- 7. HORIZONTAL REEL ENGINE (UPDATED FOR DESKTOP MODE ON MOBILE) ---
    const reelSection = document.querySelector('.horizontal-scroll-view');
    const track = document.querySelector('.horizontal-track');

    if (reelSection && track) {
        const handleScroll = () => {
            // UPDATED CHECK: Is screen wide (>1024) AND does it have a mouse (hover: hover)?
            // This prevents "Desktop Mode" on phones from triggering the horizontal scroll.
            const isDesktop = window.innerWidth > 1024;
            const hasMouse = window.matchMedia("(hover: hover)").matches;

            if (isDesktop && hasMouse) {
                const offsetTop = reelSection.offsetTop;
                const scrollY = window.scrollY;
                const viewHeight = window.innerHeight;
                const sectionHeight = reelSection.offsetHeight;
                const start = offsetTop;
                const end = offsetTop + sectionHeight - viewHeight;
                let progress = (scrollY - start) / (end - start);
                progress = Math.max(0, Math.min(1, progress));
                const maxScroll = track.scrollWidth - window.innerWidth;
                const translate = maxScroll * progress;
                track.style.transform = `translateX(-${translate}px)`;
            } else {
                // Force vertical layout on Touch Devices or Mobile
                track.style.transform = 'none';
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', () => {
            // Re-check conditions on resize
            const isDesktop = window.innerWidth > 1024;
            const hasMouse = window.matchMedia("(hover: hover)").matches;

            if (!isDesktop || !hasMouse) {
                track.style.transform = 'none';
            } else {
                handleScroll();
            }
        });
    }

    // --- 8. GLOBAL IMAGE PARALLAX ENGINE ---
    const parallaxImages = document.querySelectorAll('.card-visual img, .reel-visual img');
    const parallaxSpeed = 0.15;

    if (parallaxImages.length > 0) {
        const animateParallax = () => {
            const windowHeight = window.innerHeight;
            parallaxImages.forEach(img => {
                const container = img.parentElement;
                const rect = container.getBoundingClientRect();
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const centerY = windowHeight / 2;
                    const containerCenter = rect.top + (rect.height / 2);
                    const distFromCenter = containerCenter - centerY;
                    const translateY = distFromCenter * parallaxSpeed;
                    img.style.transform = `translateY(${translateY}px) scale(1.1)`;
                }
            });
            requestAnimationFrame(animateParallax);
        };
        requestAnimationFrame(animateParallax);
    }

    // --- 9. CONTACT MODAL LOGIC ---
    const modal = document.getElementById('contact-modal');
    const modalTriggers = document.querySelectorAll('.contact-trigger');
    const modalClose = document.querySelector('.modal-close-btn');

    if (modal && modalTriggers.length > 0) {
        // Open Modal
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent jump to #contact
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock scroll

                // If fullscreen menu is open, close it
                const fullMenu = document.querySelector('.fullscreen-menu');
                const menuBtn = document.querySelector('.menu-trigger');
                if (fullMenu && fullMenu.classList.contains('active')) {
                    fullMenu.classList.remove('active');
                    menuBtn.classList.remove('active');
                }
            });
        });

        // Close functions
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scroll
        };

        if (modalClose) modalClose.addEventListener('click', closeModal);

        // Close on clicking outside the box
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- 10. WORK PAGE REVEAL ANIMATION ---
    const workItems = document.querySelectorAll('.work-item');

    if (workItems.length > 0) {
        // Observer for reveal animation
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% visible
        });

        workItems.forEach(item => {
            revealObserver.observe(item);
        });
    }

    // --- 11. AUTO-ACTIVE MENU HIGHLIGHT ---
    const currentPath = window.location.pathname;
    const menuLinksAll = document.querySelectorAll('.menu-link');

    menuLinksAll.forEach(link => {
        // Get the href attribute (e.g., "work.html")
        const linkPath = link.getAttribute('href');

        // If the current path ends with the link path (handles / vs /index.html)
        if (currentPath.endsWith(linkPath) || (currentPath === '/' && linkPath === 'index.html')) {
            link.style.color = 'var(--accent-gold)';
            link.style.paddingLeft = '20px';
        }
    });

    // --- 12. PRELOADER LOGIC ---
    const preloader = document.querySelector('.preloader');
    const barFill = document.querySelector('.bar-fill');

    if (preloader) {
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 10;
            if (width > 100) width = 100;
            barFill.style.width = width + '%';

            if (width === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('complete');
                }, 500);
            }
        }, 100);

        // Safety: ensure it clears on load
        window.addEventListener('load', () => { width = 100; });
    }

    // --- 13. VIDEO LIGHTBOX LOGIC ---
    const videoModal = document.getElementById('video-lightbox');
    const videoFrame = document.getElementById('video-frame');
    const videoTriggers = document.querySelectorAll('.video-trigger');
    const closeVideo = document.getElementById('close-video');

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
            videoFrame.src = ''; // Stops audio
        };

        if (closeVideo) closeVideo.addEventListener('click', hideVideo);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) hideVideo();
        });
    }

    // --- 14. SMART CURSOR HOVER TRIGGERS ---
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverTargets = document.querySelectorAll('.work-item, .card-visual, .reel-visual');

    if (cursorOutline && hoverTargets.length > 0) {
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('active-view');
            });
            target.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('active-view');
            });
        });
    }
});