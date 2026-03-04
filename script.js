document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------
    // CUSTOM CURSOR LOGIC
    // ----------------------------------------
    const cursor = document.querySelector('.custom-cursor');
    const cursorGlow = document.querySelector('.custom-cursor-glow');

    // Check if it's a touch device or mobile screen
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768;

    if (!isTouchDevice && cursor && cursorGlow) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let glowX = mouseX, glowY = mouseY;
        let rotation = 0;

        // Zero-latency update for the main cursor using 3D transforms
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dynamic paper-dart / diamond shape
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) rotate(45deg)`;
        });

        // Smooth animation loop for the trailing glow using Lerp
        function renderCursor() {
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            rotation += 3; // Smooth endless rotation

            cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%) rotate(${rotation}deg)`;

            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        // Hover effect for links and buttons
        const hoverElements = document.querySelectorAll('a, button, .tilt-card, .btn');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '60px';
                cursorGlow.style.height = '60px';
                cursorGlow.style.backgroundColor = 'rgba(79, 195, 247, 0.1)';
                cursorGlow.style.borderRadius = '30px'; // morph into a circle on hover
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '30px';
                cursorGlow.style.height = '30px';
                cursorGlow.style.backgroundColor = 'transparent';
                cursorGlow.style.borderRadius = '3px'; // back to square
            });
        });
    }

    // ----------------------------------------
    // TYPEWRITER EFFECT
    // ----------------------------------------
    const roles = ["ML Engineer", "Frontend Developer", "AI Enthusiast", "Problem Solver"];
    const typewriterElement = document.getElementById("typewriter");
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWriter() {
        if (!typewriterElement) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // normal typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // pause before typing next word
        }

        setTimeout(typeWriter, typingSpeed);
    }

    // Start typewriter
    if (typewriterElement) {
        setTimeout(typeWriter, 1000); // 1s delay before starting
    }

    // ----------------------------------------
    // NAVBAR SURFER & MOBILE MENU
    // ----------------------------------------
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (navbar) {
        // Add scrolled class on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if (hamburger && navLinks) {
        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // ----------------------------------------
    // SCROLL REVEAL / INTERSECTION OBSERVER
    // ----------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Remove observer after revealing once for performance
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------
    // 3D TILT EFFECT FOR CARDS
    // ----------------------------------------
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation amount (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset transformation
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            // Add a smooth transition for reset
            card.style.transition = 'transform 0.5s ease';

            // Remove the transition after it's done so mousemove is responsive again
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    });

    // ----------------------------------------
    // SMOOTH SCROLL OFFSET FOR FIXED NAVBAR
    // ----------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                    top: targetPosition - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ----------------------------------------
    // PARALLAX EFFECTS ON SCROLL
    // ----------------------------------------
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Hero graphics subtle parallax
        const heroGraphics = document.querySelector('.hero-graphics');
        if (heroGraphics && scrolled < window.innerHeight) {
            heroGraphics.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroGraphics.style.opacity = 1 - (scrolled / window.innerHeight) * 1.5;
        }

        // Sub-elements parallax inside revealed container
        document.querySelectorAll('.reveal.active .glass-card, .reveal.active .about-text').forEach((el) => {
            const rect = el.getBoundingClientRect();
            // Calculate distance from center of window
            const distance = (window.innerHeight / 2) - (rect.top + rect.height / 2);
            // Apply a very slight Y movement for parallax (just floating effect)
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Ensure transform doesn't overwrite scale and rotation from CSS animations immediately
                // This blends parallax with existing transforms from staggered animations
                el.style.transform = `translateY(${distance * -0.05}px)`;
            }
        });
    });
});
