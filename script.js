// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    const currentTheme = body.getAttribute('data-theme');

    if (currentTheme === 'light') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

// Typing effect for hero tagline
const typingText = document.getElementById('typing-text');
if (typingText) {
    const phrases = [
        'Data analysis that delivers useful insights.',
        'AI/ML projects powered by LLMs and APIs.'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const current = phrases[wordIndex];
        if (isDeleting) {
            typingText.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 85;
        if (!isDeleting && charIndex === current.length) {
            speed = 1400;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % phrases.length;
            speed = 400;
        }
        setTimeout(typeEffect, speed);
    }

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(typeEffect, 500);
    });
}

// Time-based greeting for the AI avatar badge
function setRobotGreeting() {
    const greeting = document.getElementById('robot-greeting');
    if (!greeting) return;

    const hour = new Date().getHours();
    let message = 'Hello';
    if (hour < 12) message = 'Good morning';
    else if (hour < 17) message = 'Good afternoon';
    else if (hour < 21) message = 'Good evening';
    else message = 'Good night';

    greeting.textContent = message;
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeToggle = document.querySelector('.theme-toggle i');

    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    }

    // Initialize animations and counters
    animateCountersAdvanced();

    // Set contextual greeting on the hero badge
    setRobotGreeting();

    // Activate nav link highlighting based on scroll position
    initActiveNavHighlight();
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuButton = document.querySelector('.mobile-menu');
    navLinks.classList.toggle('active');
    if (mobileMenuButton) {
        const isExpanded = navLinks.classList.contains('active');
        mobileMenuButton.setAttribute('aria-expanded', String(isExpanded));
    }
}

// Enhanced counter animation with easing
function animateCountersAdvanced() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Easing function (ease-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easedProgress * target);

            counter.textContent = currentValue;
            counter.style.transform = `scale(${1 + (1 - progress) * 0.1})`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                counter.style.transform = 'scale(1)';
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            const navLinks = document.querySelector('.nav-links');
            const mobileMenuButton = document.querySelector('.mobile-menu');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuButton) {
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
});

// Active nav highlighting on scroll
function initActiveNavHighlight() {
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const pairs = navLinks
        .map(link => {
            const id = link.getAttribute('href');
            const section = document.querySelector(id);
            return section ? { link, section } : null;
        })
        .filter(Boolean);

    if (!pairs.length) return;

    // IntersectionObserver for modern browsers
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute('id');
                navLinks.forEach(l => l.classList.remove('active'));
                const activeLink = navLinks.find(l => l.getAttribute('href') === `#${id}`);
                if (activeLink) activeLink.classList.add('active');
            });
        }, {
            threshold: 0.18,
            rootMargin: '-25% 0px -30% 0px' // looser margins so shorter sections (skills/projects/certs) register
        });

        pairs.forEach(({ section }) => observer.observe(section));
    }

    // Fallback + initial sync using scroll position
    const updateOnScroll = () => {
        const scrollPos = window.scrollY + (window.innerHeight * 0.32);
        let currentId = null;
        pairs.forEach(({ section }) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.getAttribute('id');
            }
        });
        if (currentId) {
            navLinks.forEach(l => l.classList.remove('active'));
            const activeLink = navLinks.find(l => l.getAttribute('href') === `#${currentId}`);
            if (activeLink) activeLink.classList.add('active');
        }
    };

    updateOnScroll();
    window.addEventListener('scroll', updateOnScroll, { passive: true });
}


// Form submission
function submitForm(event) {
    event.preventDefault();

    const button = event.target.querySelector('.submit-button');
    const buttonText = button.querySelector('.button-text');
    const buttonLoading = button.querySelector('.button-loading');

    // Show loading state
    buttonText.style.display = 'none';
    buttonLoading.style.display = 'inline-flex';
    button.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        alert('Thank you for your message! I\'ll get back to you soon.');
        event.target.reset();

        // Reset button state
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        button.disabled = false;
    }, 2000);
}




// Add scroll effect to navbar and progress bar
window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    const progressBar = document.querySelector('.scroll-progress');
    const scrollTopBtn = document.querySelector('.scroll-to-top');
    const isDark = document.body.getAttribute('data-theme') === 'dark';

    // Navbar scroll effect
    if (window.scrollY > 100) {
        nav.style.background = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.background = isDark ? 'var(--bg-white)' : 'var(--bg-white)';
        nav.style.backdropFilter = 'none';
    }

    // Scroll progress bar
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrollPercentage + '%';

    // Scroll to Top visibility
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Scroll to Top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Scroll Reveal Intersection Observer with per-section staggering
const staggerMap = {};
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            if (prefersReducedMotion) {
                el.style.transitionDuration = '0s';
                el.style.animationDuration = '0s';
            }

            if (el.classList.contains('slide-in') && !el.classList.contains('active')) {
                const group = el.closest('section')?.id || 'global';
                const order = prefersReducedMotion ? 0 : (staggerMap[group] || 0);
                const delay = prefersReducedMotion ? 0 : order * 120; // 120ms steps per element in the same section
                el.style.transitionDelay = `${delay}ms`;
                staggerMap[group] = order + 1;
            }

            // Ensure layout has applied before activating (prevents instant jump)
            requestAnimationFrame(() => {
                el.classList.add('active');
            });
            revealObserver.unobserve(el);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
    // Skip the default reveal on the projects section; we’ll animate its contents separately
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
        projectsSection.classList.remove('reveal', 'active');
    }

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Apply left-to-right animation to full project cards only (observer-driven)
    const projectCards = Array.from(document.querySelectorAll('#projects .project-card'));
    projectCards.forEach((card) => {
        card.classList.add('slide-in');
        revealObserver.observe(card);
    });

    // Make the Hire/Collaborate email CTA more reliable (fallback copies email)
    const hireEmailBtn = document.querySelector('#hire-email');
    if (hireEmailBtn) {
        hireEmailBtn.addEventListener('click', () => {
            const mailto = hireEmailBtn.getAttribute('href');
            if (mailto && navigator.clipboard) {
                navigator.clipboard.writeText('shubhamkuya@gmail.com').catch(() => {});
            }
            // let the normal mailto navigation proceed; also force it in case the browser blocked it
            setTimeout(() => {
                if (mailto) {
                    window.location.href = mailto;
                }
            }, 20);
        });
    }

    // Close mobile nav with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuButton = document.querySelector('.mobile-menu');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuButton) {
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
});

// Cursor glow tracking (native cursor stays visible)
const cursorGlow = document.getElementById('cursor-glow');

if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorGlow.style.top = `${posY}px`;
        cursorGlow.style.left = `${posX}px`;

        const target = e.target;
        const isInteractive = target.tagName.toLowerCase() === 'a' ||
            target.tagName.toLowerCase() === 'button' ||
            target.closest('a') ||
            target.closest('button') ||
            target.classList.contains('cta-button');

        const dark = document.body.getAttribute('data-theme') === 'dark';
        const baseShadow = dark ? '0 0 18px 6px rgba(56, 189, 248, 0.5)' : '0 0 18px 6px rgba(118, 75, 162, 0.45)';
        const hoverShadow = dark ? '0 0 24px 8px rgba(56, 189, 248, 0.6)' : '0 0 24px 8px rgba(118, 75, 162, 0.55)';

        if (isInteractive) {
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.2)';
            cursorGlow.style.boxShadow = hoverShadow;
        } else {
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorGlow.style.boxShadow = baseShadow;
        }
    });
}

// Particle background
const bgCanvas = document.getElementById('bg-canvas');

if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let particles = [];

    const isDarkMode = () => document.body.getAttribute('data-theme') === 'dark';

    const mouse = {
        x: null,
        y: null,
        radius: 0
    };

    function setCanvasSize() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        mouse.radius = (bgCanvas.height / 80) * (bgCanvas.width / 80);
    }

    function Particle(x, y, directionX, directionY, size) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
    }

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        const fill = isDarkMode() ? 'rgba(56, 189, 248, 0.5)' : 'rgba(37, 99, 235, 0.5)';
        ctx.fillStyle = fill;
        ctx.fill();
    };

    Particle.prototype.update = function () {
        if (this.x > bgCanvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > bgCanvas.height || this.y < 0) this.directionY = -this.directionY;

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    };

    function initParticles() {
        particles = [];
        let count = (bgCanvas.height * bgCanvas.width) / 9000;
        if (count > 120) count = 120;

        for (let i = 0; i < count; i++) {
            const size = (Math.random() * 2) + 1;
            const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            const directionX = (Math.random() * 1) - 0.5;
            const directionY = (Math.random() * 1) - 0.5;
            particles.push(new Particle(x, y, directionX, directionY, size));
        }
    }

    function connectParticles() {
        const nodes = [...particles];
        let hasMouse = false;
        if (mouse.x !== null && mouse.y !== null) {
            nodes.push({ x: mouse.x, y: mouse.y });
            hasMouse = true;
        }

        const maxDistSq = 180 * 180;
        for (let a = 0; a < nodes.length; a++) {
            for (let b = a + 1; b < nodes.length; b++) {
                const dx = nodes[a].x - nodes[b].x;
                const dy = nodes[a].y - nodes[b].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    let opacity = 1 - (distSq / maxDistSq);
                    const mouseLink = hasMouse && (a === nodes.length - 1 || b === nodes.length - 1);
                    opacity *= mouseLink ? 0.8 : 0.45;
                    const stroke = isDarkMode()
                        ? `rgba(56, 189, 248, ${opacity})`
                        : `rgba(37, 99, 235, ${opacity})`;
                    ctx.strokeStyle = stroke;
                    ctx.lineWidth = mouseLink ? 1.5 : 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[a].x, nodes[a].y);
                    ctx.lineTo(nodes[b].x, nodes[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connectParticles();
    }

    setCanvasSize();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        setCanvasSize();
        initParticles();
    });

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
}