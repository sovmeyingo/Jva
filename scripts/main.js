// ===== MAIN JAVASCRIPT FUNCTIONALITY =====

class LastOfUsWebsite {
    constructor() {
        this.isLoaded = false;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.isAudioPlaying = false;
        this.audioVolume = 0.2;
        this.currentImageIndex = 0;
        this.galleryImages = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.initializeAudio();
        this.initializeScrollAnimations();
        this.initializeGallery();
        this.initializeStats();
        this.initializeEasterEggs();
        this.setupCinematicIntro();
        this.setupMusicPlayer();
        this.startSplashScreen();
    }

    // ===== SPLASH SCREEN =====
    startSplashScreen() {
        const splashScreen = document.getElementById('splash-screen');
        const mainContent = document.getElementById('main-content');
        
        // Simulate loading time
        setTimeout(() => {
            splashScreen.style.opacity = '0';
            splashScreen.style.visibility = 'hidden';
            mainContent.classList.remove('hidden');
            this.isLoaded = true;
            
            // Start particles after splash
            this.initializeParticles();
            
            // Start audio after user interaction
            this.setupAudioInteraction();
        }, 3000);
    }

    // ===== THEME MANAGEMENT =====
    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Audio toggle
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => this.toggleAudio());
        }

        // Music player controls
        const playPauseBtn = document.getElementById('play-pause');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.toggleMusic());
        }

        // Gallery lightbox
        this.setupGalleryEvents();

        // Scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));
        
        // Resize events
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
        
        // Add transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon path');
        if (themeIcon) {
            if (this.currentTheme === 'dark') {
                themeIcon.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
            } else {
                themeIcon.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
            }
        }
    }

    // ===== AUDIO MANAGEMENT =====
    initializeAudio() {
        this.backgroundMusic = document.getElementById('background-music');
        if (this.backgroundMusic) {
            // İdeal ses seviyesi - ne çok yüksek ne çok düşük
            this.backgroundMusic.volume = 0.15; // %15 - ideal seviye
            
            // Loop ayarları - müzik bitince otomatik tekrar başlasın
            this.backgroundMusic.loop = true; // HTML'deki loop attribute'u ile birlikte çalışır
            
            // Ek güvenlik için ended event listener
            this.backgroundMusic.addEventListener('ended', () => {
                console.log('Müzik bitti, tekrar başlatılıyor...');
                this.backgroundMusic.currentTime = 0;
                this.backgroundMusic.play().catch(e => console.log('Loop play failed:', e));
            });
            
            // Loadeddata event - müzik yüklendiğinde loop'u aktif et
            this.backgroundMusic.addEventListener('loadeddata', () => {
                this.backgroundMusic.loop = true;
                console.log('Müzik yüklendi, loop aktif');
            });
        }
    }

    setupAudioInteraction() {
        // Start audio on first user interaction
        const startAudio = () => {
            if (this.backgroundMusic && !this.isAudioPlaying) {
                // Ses seviyesini ideal seviyeye ayarla
                this.backgroundMusic.volume = 0.15;
                // Loop'u aktif et
                this.backgroundMusic.loop = true;
                this.backgroundMusic.play().catch(e => console.log('Audio autoplay prevented:', e));
                console.log('İlk müzik başlatıldı - Loop aktif');
            }
            document.removeEventListener('click', startAudio);
            document.removeEventListener('keydown', startAudio);
        };

        document.addEventListener('click', startAudio);
        document.addEventListener('keydown', startAudio);
    }

    toggleAudio() {
        if (!this.backgroundMusic) return;

        if (this.isAudioPlaying) {
            this.backgroundMusic.pause();
            this.isAudioPlaying = false;
        } else {
            this.backgroundMusic.play().then(() => {
                this.isAudioPlaying = true;
            }).catch(e => {
                console.log('Audio play failed:', e);
            });
        }
        
        this.updateAudioIcon();
    }

    toggleMusic() {
        if (!this.backgroundMusic) return;

        if (this.backgroundMusic.paused) {
            // Çalarken ses seviyesini ideal seviyeye ayarla
            this.backgroundMusic.volume = 0.15;
            // Loop'u aktif et
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();
            this.isAudioPlaying = true;
            console.log('Müzik başlatıldı - Loop aktif');
        } else {
            this.backgroundMusic.pause();
            this.isAudioPlaying = false;
            console.log('Müzik durduruldu');
        }
        
        this.updateMusicIcon();
    }

    updateAudioIcon() {
        const audioIcon = document.querySelector('.audio-icon path');
        if (audioIcon) {
            if (this.isAudioPlaying) {
                audioIcon.setAttribute('d', 'M5.64 3.64a.75.75 0 0 1 .106 1.06L6.44 6l-.694.3a.75.75 0 0 1-.954-1.06L5.64 3.64zM12 3.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75zM12 8.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75zM12 12.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75zM12 17.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75z');
            } else {
                audioIcon.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
            }
        }
    }

    updateMusicIcon() {
        const playPauseBtn = document.getElementById('play-pause');
        if (playPauseBtn) {
            const svg = playPauseBtn.querySelector('svg path');
            if (svg) {
                if (this.isAudioPlaying) {
                    svg.setAttribute('d', 'M6 4h4v16H6V4zm8 0h4v16h-4V4z');
                } else {
                    svg.setAttribute('d', 'M8 5v14l11-7z');
                }
            }
        }
    }

    // ===== SCROLL ANIMATIONS =====
    initializeScrollAnimations() {
        // Scroll animasyonları kaldırıldı - tüm elementler varsayılan olarak görünür
        const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
        animatedElements.forEach(el => {
            el.classList.add('animate');
        });
    }

    handleScroll() {
        // Parallax effect for hero background only
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3; // Reduced parallax intensity
            hero.style.transform = `translateY(${rate}px) translateZ(0)`;
        }

        // Update scroll indicator
        this.updateScrollIndicator();
    }

    updateScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            const scrolled = window.pageYOffset;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min(scrolled / maxScroll, 1);
            
            if (progress > 0.1) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }
    }

    // ===== GALLERY LIGHTBOX =====
    initializeGallery() {
        this.galleryImages = Array.from(document.querySelectorAll('.gallery-item')).map(item => ({
            src: item.dataset.src,
            title: item.querySelector('.gallery-title')?.textContent || ''
        }));
    }

    setupGalleryEvents() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.currentImageIndex = index;
                this.openLightbox();
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.closeLightbox());
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => this.previousImage());
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => this.nextImage());
        }

        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
    }

    openLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        
        if (lightbox && lightboxImage && this.galleryImages[this.currentImageIndex]) {
            lightboxImage.src = this.galleryImages[this.currentImageIndex].src;
            lightboxImage.alt = this.galleryImages[this.currentImageIndex].title;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        this.updateLightboxImage();
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const lightboxImage = document.getElementById('lightbox-image');
        if (lightboxImage && this.galleryImages[this.currentImageIndex]) {
            lightboxImage.src = this.galleryImages[this.currentImageIndex].src;
            lightboxImage.alt = this.galleryImages[this.currentImageIndex].title;
        }
    }

    // ===== STATS COUNTER =====
    initializeStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(stat);
        });
    }

    // ===== EASTER EGGS =====
    initializeEasterEggs() {
        // Konami Code
        this.konamiCode = [];
        this.konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        
        document.addEventListener('keydown', (e) => {
            this.konamiCode.push(e.keyCode);
            if (this.konamiCode.length > this.konamiSequence.length) {
                this.konamiCode.shift();
            }
            
            if (this.arraysEqual(this.konamiCode, this.konamiSequence)) {
                this.activateEasterEgg();
            }
        });

        // Hidden Ellie joke
        this.setupEllieJoke();
    }

    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }

    activateEasterEgg() {
        // Infected mode theme
        document.body.style.filter = 'hue-rotate(120deg) saturate(1.5)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
        
        // Show easter egg message
        this.showEasterEggMessage('Infected Mode Activated! 🍄');
    }

    setupEllieJoke() {
        // Mesaj kaldırıldı - artık otomatik mesaj gösterilmiyor
        // setTimeout(() => {
        //     this.showEasterEggMessage('Jva Sunar');
        // }, 3000);
    }

    showEasterEggMessage(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-rust);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.3rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slide-in-right 0.3s ease;
            font-size: 0.9rem;
            font-weight: 500;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slide-in-right 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
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

    handleResize() {
        // Handle responsive adjustments
        this.updateParticles();
    }

    updateParticles() {
        // Update particle system on resize
        if (this.particleSystem) {
            this.particleSystem.resize();
        }
    }

    // ===== PARTICLE SYSTEM INITIALIZATION =====
    initializeParticles() {
        // This will be handled by particles.js
        if (typeof ParticleSystem !== 'undefined') {
            this.particleSystem = new ParticleSystem();
        }
    }

    // ===== CINEMATIC INTRO =====
    setupCinematicIntro() {
        const intro = document.getElementById('cinematic-intro');
        const skipBtn = document.querySelector('.skip-btn');
        
        // Show intro every time (no storage check)
        intro.style.display = 'flex';
        document.body.classList.add('intro-active');
        
        // Skip button functionality
        skipBtn.addEventListener('click', () => {
            this.hideIntro();
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideIntro();
        }, 5000);
    }
    
    hideIntro() {
        const intro = document.getElementById('cinematic-intro');
        const mainContent = document.getElementById('main-content');
        
        // Add fade-out class
        intro.classList.add('intro-hidden');
        
        // Hide intro and show main content after transition
        setTimeout(() => {
            intro.style.display = 'none';
            document.body.classList.remove('intro-active');
            mainContent.classList.remove('hidden');
        }, 1000);
        
        // No storage needed - intro shows every time
    }

    // ===== MUSIC PLAYER =====
    setupMusicPlayer() {
        const playBtn = document.querySelector('.play-btn');
        if (!playBtn) return;

        let currentAudio = null;
        let isPlaying = false;

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Gallery item click'ini engelle
            
            const audioSrc = playBtn.getAttribute('data-audio');
            console.log('Audio source:', audioSrc); // Debug log
            
            if (!currentAudio) {
                currentAudio = new Audio(audioSrc);
                currentAudio.preload = 'auto';
                
                // Audio load event listeners
                currentAudio.addEventListener('loadstart', () => {
                    console.log('Audio loading started');
                });
                
                currentAudio.addEventListener('canplay', () => {
                    console.log('Audio can play');
                });
                
                currentAudio.addEventListener('error', (error) => {
                    console.error('Audio error:', error);
                    alert('Müzik dosyası yüklenemedi: ' + audioSrc);
                });
            }

            if (isPlaying) {
                // Pause
                currentAudio.pause();
                playBtn.classList.remove('playing');
                isPlaying = false;
                console.log('Audio paused');
            } else {
                // Play
                currentAudio.play().then(() => {
                    playBtn.classList.add('playing');
                    isPlaying = true;
                    console.log('Audio playing');
                }).catch((error) => {
                    console.error('Audio play failed:', error);
                    alert('Müzik çalınamadı. Hata: ' + error.message);
                });
            }
        });

        // Audio ended event
        if (currentAudio) {
            currentAudio.addEventListener('ended', () => {
                playBtn.classList.remove('playing');
                isPlaying = false;
            });
        }
    }

}

// ===== INITIALIZE WEBSITE =====
document.addEventListener('DOMContentLoaded', () => {
    window.lastOfUsWebsite = new LastOfUsWebsite();
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LastOfUsWebsite;
}
