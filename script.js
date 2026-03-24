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

    // Navbar scroll effect
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.background = 'var(--bg-white)';
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