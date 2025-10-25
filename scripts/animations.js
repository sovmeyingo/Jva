// ===== ADVANCED ANIMATIONS FOR THE LAST OF US WEBSITE =====

class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
        this.setupTypewriterEffect();
        this.setupParallaxEffects();
        this.setupCardAnimations();
        this.setupMusicVisualizer();
    }

    // ===== SCROLL ANIMATIONS =====
    setupScrollAnimations() {
        if (this.isReducedMotion) return;

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                } else {
                    // Geri scroll yaparken animasyonu kaldır
                    entry.target.classList.remove('animate');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(`
            .scroll-animate,
            .scroll-animate-left,
            .scroll-animate-right,
            .scroll-animate-scale,
            .glass-card,
            .social-card,
            .game-card,
            .stat-card,
            .gallery-item
        `);

        animatedElements.forEach(el => {
            this.scrollObserver.observe(el);
        });
    }

    animateElement(element) {
        if (element.classList.contains('animate')) return;

        element.classList.add('animate');
        
        // Add stagger effect for multiple elements
        const siblings = element.parentElement.children;
        const index = Array.from(siblings).indexOf(element);
        
        if (index > 0) {
            element.style.animationDelay = `${index * 0.1}s`;
        }
    }

    // ===== HOVER ANIMATIONS =====
    setupHoverAnimations() {
        if (this.isReducedMotion) return;

        // Glass cards hover effect
        const glassCards = document.querySelectorAll('.glass-card');
        glassCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addHoverEffect(card, 'lift');
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeHoverEffect(card, 'lift');
            });
        });

        // Social cards special effects
        const socialCards = document.querySelectorAll('.social-card');
        socialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.activateSocialHover(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.deactivateSocialHover(card);
            });
        });

        // Gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.activateGalleryHover(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.deactivateGalleryHover(item);
            });
        });
    }

    addHoverEffect(element, effectType) {
        switch(effectType) {
            case 'lift':
                element.style.transform = 'translateY(-5px) translateZ(0)';
                element.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                break;
            case 'scale':
                element.style.transform = 'scale(1.05) translateZ(0)';
                break;
            case 'glow':
                element.style.boxShadow = '0 8px 25px rgba(198, 123, 92, 0.3)';
                break;
        }
    }

    removeHoverEffect(element, effectType) {
        element.style.transform = 'translateZ(0)';
        element.style.boxShadow = '';
    }

    activateSocialHover(card) {
        const platform = card.dataset.platform;
        const icon = card.querySelector('.social-icon');
        
        // Platform-specific effects
        switch(platform) {
            case 'discord':
                icon.style.background = 'linear-gradient(45deg, #5865F2, #7289DA)';
                this.addRippleEffect(card);
                break;
            case 'spotify':
                icon.style.background = 'linear-gradient(45deg, #1DB954, #1ED760)';
                this.addPulseEffect(icon);
                break;
            case 'steam':
                icon.style.background = 'linear-gradient(45deg, #171a21, #2a475e)';
                this.addSteamEffect(card);
                break;
            case 'github':
                icon.style.background = 'linear-gradient(45deg, #333, #555)';
                this.addOctocatEffect(icon);
                break;
        }
        
        this.addHoverEffect(card, 'lift');
    }

    deactivateSocialHover(card) {
        const icon = card.querySelector('.social-icon');
        icon.style.background = '';
        this.removeHoverEffect(card, 'lift');
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    addPulseEffect(element) {
        element.style.animation = 'pulse 1s ease-in-out infinite';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 2000);
    }

    addSteamEffect(element) {
        // Create steam particles
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createSteamParticle(element);
            }, i * 100);
        }
    }

    createSteamParticle(parent) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: steam-rise 2s ease-out forwards;
        `;
        
        const rect = parent.getBoundingClientRect();
        particle.style.left = (rect.width / 2) + 'px';
        particle.style.bottom = '0px';
        
        parent.style.position = 'relative';
        parent.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }

    addOctocatEffect(element) {
        element.style.animation = 'wiggle 0.5s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    activateGalleryHover(item) {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        
        if (img) {
            img.style.transform = 'scale(1.05)';
        }
        
        if (overlay) {
            overlay.style.transform = 'translateY(0)';
        }
        
        this.addHoverEffect(item, 'lift');
    }

    deactivateGalleryHover(item) {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        
        if (img) {
            img.style.transform = '';
        }
        
        if (overlay) {
            overlay.style.transform = 'translateY(100%)';
        }
        
        this.removeHoverEffect(item, 'lift');
    }

    // ===== LOADING ANIMATIONS =====
    setupLoadingAnimations() {
        // Splash screen animations
        this.animateSplashScreen();
        
        // Page load animations
        window.addEventListener('load', () => {
            this.animatePageLoad();
        });
    }

    animateSplashScreen() {
        const fireflyLogo = document.querySelector('.firefly-logo');
        const splashTitle = document.querySelector('.splash-title');
        const loadingBar = document.querySelector('.loading-progress');
        
        if (fireflyLogo) {
            fireflyLogo.style.animation = 'firefly-glow 2s ease-in-out infinite alternate';
        }
        
        if (splashTitle) {
            splashTitle.style.animation = 'fade-in-up 1s ease-out 0.5s both';
        }
        
        if (loadingBar) {
            loadingBar.style.animation = 'loading-progress 3s ease-in-out';
        }
    }

    animatePageLoad() {
        const heroTitle = document.querySelector('.hero-title');
        const heroDescription = document.querySelector('.hero-description');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (heroTitle) {
            heroTitle.style.animation = 'fade-in-up 1s ease-out';
        }
        
        if (heroDescription) {
            heroDescription.style.animation = 'fade-in-up 1s ease-out 0.3s both';
        }
        
        if (scrollIndicator) {
            scrollIndicator.style.animation = 'fade-in-up 1s ease-out 0.6s both';
        }
    }

    // ===== TYPEWRITER EFFECT =====
    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            this.animateTypewriter(element);
        });
    }

    animateTypewriter(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--accent-rust)';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
    }

    // ===== PARALLAX EFFECTS =====
    setupParallaxEffects() {
        if (this.isReducedMotion) return;

        window.addEventListener('scroll', this.throttle(() => {
            this.updateParallax();
        }, 16));
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        
        // Hero background parallax
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Sadece hero section için parallax, diğer kartlar için parallax kaldırıldı
        // Bu, kartların yerinden oynamasını önler
    }

    // ===== CARD ANIMATIONS =====
    setupCardAnimations() {
        if (this.isReducedMotion) return;

        // Game cards flip effect
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardFlip(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardFlip(card, false);
            });
        });
    }

    animateCardFlip(card, isFlipping) {
        if (isFlipping) {
            card.style.transform = 'perspective(1000px) rotateY(5deg) scale(1.02)';
        } else {
            card.style.transform = 'perspective(1000px) rotateY(0deg) scale(1)';
        }
    }

    // ===== MUSIC VISUALIZER =====
    setupMusicVisualizer() {
        const visualizer = document.querySelector('.music-visualizer');
        if (!visualizer) return;

        // Create visualizer bars
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            bar.style.height = '10px';
            visualizer.appendChild(bar);
        }

        // Animate bars
        this.animateVisualizer();
    }

    animateVisualizer() {
        const bars = document.querySelectorAll('.visualizer-bar');
        
        bars.forEach((bar, index) => {
            const height = Math.random() * 30 + 10;
            bar.style.height = height + 'px';
        });
        
        setTimeout(() => {
            this.animateVisualizer();
        }, 150);
    }

    // ===== UTILITY FUNCTIONS =====
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===== DESTROY ANIMATIONS =====
    destroy() {
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
    }
}

// ===== CSS ANIMATION KEYFRAMES (INJECTED VIA JS) =====
const injectAnimationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes steam-rise {
            0% {
                transform: translateY(0) scale(1);
                opacity: 0.6;
            }
            100% {
                transform: translateY(-50px) scale(0.5);
                opacity: 0;
            }
        }
        
        @keyframes visualizer-bounce {
            0%, 100% {
                height: 10px;
            }
            50% {
                height: 30px;
            }
        }
    `;
    document.head.appendChild(style);
};

// ===== INITIALIZE ANIMATION MANAGER =====
document.addEventListener('DOMContentLoaded', () => {
    injectAnimationStyles();
    window.animationManager = new AnimationManager();
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}
