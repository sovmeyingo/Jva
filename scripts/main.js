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

        // Check actual audio state instead of relying on isAudioPlaying
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().then(() => {
                this.isAudioPlaying = true;
                this.updateAudioIcon();
            }).catch(e => {
                console.log('Audio play failed:', e);
                this.isAudioPlaying = false;
                this.updateAudioIcon();
            });
        } else {
            this.backgroundMusic.pause();
            this.isAudioPlaying = false;
            this.updateAudioIcon();
        }
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
        if (audioIcon && this.backgroundMusic) {
            // Use actual audio state instead of isAudioPlaying
            if (this.backgroundMusic.paused) {
                audioIcon.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
            } else {
                audioIcon.setAttribute('d', 'M5.64 3.64a.75.75 0 0 1 .106 1.06L6.44 6l-.694.3a.75.75 0 0 1-.954-1.06L5.64 3.64zM12 3.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75zM12 8.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75zM12 12.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75zM12 17.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75z');
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
        
        // VSCO Gallery scroll animations
        this.initializeGalleryScrollAnimations();
    }
    
    initializeGalleryScrollAnimations() {
        // Gallery scroll observer
        const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe gallery section
        const gallerySection = document.querySelector('.art-gallery-section');
        if (gallerySection) {
            galleryObserver.observe(gallerySection);
        }
        
        // Observe YouTube gallery section
        const youtubeGallerySection = document.querySelector('.youtube-gallery-section');
        if (youtubeGallerySection) {
            galleryObserver.observe(youtubeGallerySection);
        }
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

// ===== COMPACT DISCORD WIDGET =====

const DISCORD_USER_ID = '846641377173569537';
const LANYARD_API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

async function fetchDiscordPresence() {
  try {
    const response = await fetch(LANYARD_API_URL);
    const data = await response.json();
    
    if (data.success && data.data) {
      displayCompactPresence(data.data);
    }
  } catch (error) {
    console.error('Presence Error:', error);
  }
}

function displayCompactPresence(presence) {
  const content = document.getElementById('presenceContent');
  const status = presence.discord_status;
  const activities = presence.activities;
  const spotify = presence.spotify;
  
  const statusClass = {
    'online': 'online',
    'idle': 'idle',
    'dnd': 'dnd',
    'offline': 'offline'
  }[status] || 'offline';
  
  const gameActivity = activities.find(a => a.type === 0);
  const hasSpotify = presence.listening_to_spotify && spotify;
  
  let html = `
    <div class="status-bar">
      <div class="status-user">
        <div class="status-dot ${statusClass}"></div>
        <span class="username">Jva</span>
      </div>
      <svg class="discord-logo" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
    </div>
  `;
  
  if (gameActivity || hasSpotify) {
    html += '<div class="activities-stack">';
    
    if (gameActivity) {
      const icon = gameActivity.assets?.large_image 
        ? `https://cdn.discordapp.com/app-assets/${gameActivity.application_id}/${gameActivity.assets.large_image}.png`
        : 'https://via.placeholder.com/40/1A1F2E/C67B5C?text=G';
      
      html += `
        <div class="activity-card">
          <img src="${icon}" class="activity-icon-mini" onerror="this.src='https://via.placeholder.com/40/1A1F2E/C67B5C?text=G'">
          <div class="activity-text">
            <div class="activity-name-mini">${gameActivity.name}</div>
            <div class="activity-detail-mini">${gameActivity.details || 'Oynuyor'}</div>
          </div>
        </div>
      `;
    }
    
    if (hasSpotify) {
      // SPOTIFY PROGRESS - SMOOTH VERSION
      const songName = spotify.song;
      const artist = spotify.artist;
      const albumArt = spotify.album_art_url;
      const startTime = spotify.timestamps?.start;
      const endTime = spotify.timestamps?.end;
      
      if (startTime && endTime) {
        const totalDuration = endTime - startTime;
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
        
        const currentSeconds = Math.floor(elapsed / 1000);
        const totalSeconds = Math.floor(totalDuration / 1000);
        
        html += `
          <div class="activity-card spotify-card">
            <img src="${albumArt}" class="activity-icon-mini">
            <div class="activity-text">
              <div class="activity-name-mini">${songName}</div>
              <div class="activity-detail-mini">${artist}</div>
              <div class="spotify-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="progress-time">
                  <span id="currentTime">${formatTime(currentSeconds)}</span>
                  <span>${formatTime(totalSeconds)}</span>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // SMOOTH COUNTER - Her saniye artacak!
        startSmoothCounter(startTime, endTime);
      } else {
        // Timestamp yoksa normal göster
        html += `
          <div class="activity-card spotify-card">
            <img src="${albumArt}" class="activity-icon-mini">
            <div class="activity-text">
              <div class="activity-name-mini">${songName}</div>
              <div class="activity-detail-mini">${artist}</div>
            </div>
          </div>
        `;
      }
    }
    
    html += '</div>';
  } else {
    html += `
      <div class="idle-card">
        <div class="idle-icon">💤</div>
        <div class="idle-text">Şu an boşta</div>
      </div>
    `;
  }
  
  content.innerHTML = html;
}

// TIME FORMATTER FONKSİYONU
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// SMOOTH COUNTER FONKSİYONU
let counterInterval;

function startSmoothCounter(startTime, endTime) {
  // Eski interval'i temizle
  if (counterInterval) clearInterval(counterInterval);
  
  // Her saniye güncelle
  counterInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const currentSeconds = Math.floor(elapsed / 1000);
    const totalDuration = endTime - startTime;
    const totalSeconds = Math.floor(totalDuration / 1000);
    
    // Süre aştıysa dur
    if (currentSeconds >= totalSeconds) {
      clearInterval(counterInterval);
      return;
    }
    
    // Zamanı güncelle (DOM)
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
      timeElement.textContent = formatTime(currentSeconds);
    }
    
    // Progress bar güncelle
    const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = progressPercent + '%';
    }
  }, 1000); // 1 saniyede bir!
}

function initializeDiscordPresence() {
  fetchDiscordPresence();
  setInterval(fetchDiscordPresence, 2000); // 2 saniyede bir güncelle (progress bar için)
}

// ===== MOBILE FIXES =====

// Prevent zoom on double-tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.createElement('div');
  navOverlay.classList.add('nav-overlay');
  document.body.appendChild(navOverlay);
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      navOverlay.classList.toggle('active');
    });
    
    navOverlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      navOverlay.classList.remove('active');
    });
    
    // Close on link click
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
      });
    });
  }
});

// Viewport height fix (mobile browsers)
function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);
setVH();

// Swipe to hide widget (mobile only)
if (window.innerWidth <= 767) {
  const widget = document.querySelector('.discord-presence-widget');
  if (widget) {
    const indicator = document.createElement('div');
    indicator.classList.add('swipe-indicator');
    widget.prepend(indicator);
    
    let startY = 0;
    let currentY = 0;
    
    widget.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    });
    
    widget.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      if (diff > 0) { // Aşağı kaydırma
        widget.style.transform = `translateY(${diff}px)`;
      }
    });
    
    widget.addEventListener('touchend', () => {
      const diff = currentY - startY;
      
      if (diff > 50) { // 50px'den fazla kaydırırsa gizle
        widget.classList.add('hidden');
      } else {
        widget.style.transform = 'translateY(0)';
      }
    });
    
    // Tıklayınca tekrar göster
    indicator.addEventListener('click', () => {
      widget.classList.remove('hidden');
    });
  }
}

// ===== DISCORD WIDGET FORCE FIXED POSITION =====
function forceDiscordWidgetFixed() {
  if (window.innerWidth <= 767) {
    const widget = document.querySelector('.discord-presence-widget');
    
    if (widget) {
      // Force fixed positioning
      widget.style.position = 'fixed';
      widget.style.bottom = '20px';
      widget.style.left = '1rem';
      widget.style.right = '1rem';
      widget.style.width = 'auto';
      widget.style.zIndex = '9999';
      widget.style.transform = 'none';
      
      // Keep fixed on scroll
      window.addEventListener('scroll', () => {
        widget.style.position = 'fixed';
        widget.style.bottom = '20px';
      });
    }
  }
}

// ===== DISCORD WIDGET DELAYED SHOW =====
function showDiscordWidgetAfterLoad() {
  const widget = document.querySelector('.discord-presence-widget');
  
  // Masaüstü için widget'ı hemen göster
  if (window.innerWidth >= 768) {
    if (widget) {
      widget.style.display = 'block';
      widget.style.opacity = '1';
      widget.style.visibility = 'visible';
      widget.style.pointerEvents = 'auto';
      widget.style.transform = 'translateY(0)';
      widget.classList.add('visible');
    }
    return; // Masaüstü için erken çık
  }
  
  // Mobile için widget'ı başlangıçta gizle
  if (widget) {
    widget.style.display = 'none';
    widget.style.opacity = '0';
    widget.style.visibility = 'hidden';
    widget.style.pointerEvents = 'none';
    widget.style.transform = 'translateY(100%)';
  }
  
  // Intro cinematic'in bitmesini bekle
  const checkIntroComplete = () => {
    const introSection = document.querySelector('.intro-cinematic');
    const heroSection = document.querySelector('.hero');
    
    // Intro section varsa ve gizliyse, hero section görünürse
    if (introSection && heroSection) {
      const introHidden = introSection.style.display === 'none' || 
                         introSection.classList.contains('hidden') ||
                         getComputedStyle(introSection).display === 'none';
      
      const heroVisible = getComputedStyle(heroSection).display !== 'none';
      
      if (introHidden && heroVisible) {
        // Intro bitti, widget'ı göster
        if (widget) {
          widget.style.display = 'block';
          widget.style.transform = 'translateY(0)';
          widget.classList.add('visible');
        }
        return true;
      }
    }
    
    // Intro section yoksa, sadece 3 saniye bekle
    setTimeout(() => {
      if (widget) {
        widget.style.display = 'block';
        widget.style.transform = 'translateY(0)';
        widget.classList.add('visible');
      }
    }, 3000);
    
    return false;
  };
  
  // Intro cinematic aktifken widget'ı sürekli gizle
  const hideWidgetDuringIntro = () => {
    const introSection = document.querySelector('.intro-cinematic');
    if (introSection && widget) {
      const introVisible = introSection.style.display !== 'none' && 
                          !introSection.classList.contains('hidden') &&
                          getComputedStyle(introSection).display !== 'none';
      
      if (introVisible) {
        widget.style.display = 'none';
        widget.style.opacity = '0';
        widget.style.visibility = 'hidden';
        widget.style.pointerEvents = 'none';
        widget.style.transform = 'translateY(100%)';
      }
    }
  };
  
  // Hemen kontrol et
  if (!checkIntroComplete()) {
    // Intro hala devam ediyorsa, 500ms'de bir kontrol et
    const interval = setInterval(() => {
      hideWidgetDuringIntro();
      if (checkIntroComplete()) {
        clearInterval(interval);
      }
    }, 500);
    
    // Maksimum 10 saniye bekle
    setTimeout(() => {
      clearInterval(interval);
      if (widget) {
        widget.style.display = 'block';
        widget.style.transform = 'translateY(0)';
        widget.classList.add('visible');
      }
    }, 10000);
  }
}

// ===== INITIALIZE WEBSITE =====
document.addEventListener('DOMContentLoaded', () => {
    window.lastOfUsWebsite = new LastOfUsWebsite();
    initializeDiscordPresence();
    forceDiscordWidgetFixed();
    showDiscordWidgetAfterLoad();
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LastOfUsWebsite;
}
