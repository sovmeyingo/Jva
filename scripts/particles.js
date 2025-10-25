// ===== PARTICLE SYSTEM FOR THE LAST OF US WEBSITE =====

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.snowParticles = [];
        this.fireflyParticles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        this.setupEventListeners();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        // Create snow particles
        for (let i = 0; i < 50; i++) {
            this.snowParticles.push(new SnowParticle(this.canvas.width, this.canvas.height));
        }

        // Create firefly particles
        for (let i = 0; i < 8; i++) {
            this.fireflyParticles.push(new FireflyParticle(this.canvas.width, this.canvas.height));
        }

        // Create ambient particles
        for (let i = 0; i < 20; i++) {
            this.particles.push(new AmbientParticle(this.canvas.width, this.canvas.height));
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.recreateParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Mouse interaction for fireflies
        window.addEventListener('mousemove', () => {
            this.fireflyParticles.forEach(firefly => {
                const dx = this.mouse.x - firefly.x;
                const dy = this.mouse.y - firefly.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    firefly.avoidMouse(this.mouse.x, this.mouse.y);
                }
            });
        });
    }

    recreateParticles() {
        this.snowParticles = [];
        this.fireflyParticles = [];
        this.particles = [];
        this.createParticles();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.updateAndDrawParticles(this.particles);
        this.updateAndDrawParticles(this.snowParticles);
        this.updateAndDrawParticles(this.fireflyParticles);
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateAndDrawParticles(particleArray) {
        particleArray.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ===== BASE PARTICLE CLASS =====
class BaseParticle {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = 0;
        this.vy = 0;
        this.life = 1;
        this.maxLife = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.001;
    }

    draw(ctx) {
        // Override in subclasses
    }

    isDead() {
        return this.life <= 0;
    }

    reset() {
        this.life = this.maxLife;
    }
}

// ===== SNOW PARTICLE =====
class SnowParticle extends BaseParticle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.size = Math.random() * 3 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.wind = 0;
        this.maxLife = Math.random() * 1000 + 500;
        this.life = this.maxLife;
    }

    update() {
        super.update();
        
        // Wind effect
        this.wind += (Math.random() - 0.5) * 0.1;
        this.wind *= 0.98;
        this.x += this.wind;
        
        // Reset when off screen
        if (this.y > this.canvasHeight + 10) {
            this.y = -10;
            this.x = Math.random() * this.canvasWidth;
        }
        
        if (this.x < -10 || this.x > this.canvasWidth + 10) {
            this.x = Math.random() * this.canvasWidth;
            this.y = -10;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#E8F4F8';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add sparkle effect
        if (Math.random() < 0.1) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

// ===== FIREFLY PARTICLE =====
class FireflyParticle extends BaseParticle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.glowSize = this.size * 3;
        this.glowIntensity = Math.random() * 0.8 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.maxLife = Math.random() * 2000 + 1000;
        this.life = this.maxLife;
    }

    update() {
        super.update();
        
        // Gentle floating motion
        this.vx += (Math.random() - 0.5) * 0.01;
        this.vy += (Math.random() - 0.5) * 0.01;
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // Boundary checking with wrap-around
        if (this.x < 0) this.x = this.canvasWidth;
        if (this.x > this.canvasWidth) this.x = 0;
        if (this.y < 0) this.y = this.canvasHeight;
        if (this.y > this.canvasHeight) this.y = 0;
        
        // Update pulse
        this.pulsePhase += this.pulseSpeed;
        this.glowIntensity = 0.2 + 0.8 * Math.sin(this.pulsePhase);
    }

    avoidMouse(mouseX, mouseY) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            this.vx += (dx / distance) * force * 0.1;
            this.vy += (dy / distance) * force * 0.1;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.glowSize
        );
        gradient.addColorStop(0, `rgba(198, 123, 92, ${this.glowIntensity})`);
        gradient.addColorStop(0.5, `rgba(198, 123, 92, ${this.glowIntensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(198, 123, 92, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.fillStyle = '#C67B5C';
        ctx.globalAlpha = this.glowIntensity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// ===== AMBIENT PARTICLE =====
class AmbientParticle extends BaseParticle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.size = Math.random() * 1 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.maxLife = Math.random() * 5000 + 2000;
        this.life = this.maxLife;
    }

    update() {
        super.update();
        
        // Slow drift
        this.vx += (Math.random() - 0.5) * 0.005;
        this.vy += (Math.random() - 0.5) * 0.005;
        this.vx *= 0.995;
        this.vy *= 0.995;
        
        // Boundary checking
        if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#4A5F6D';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ===== PARTICLE EFFECTS MANAGER =====
class ParticleEffectsManager {
    constructor() {
        this.effects = [];
        this.isActive = true;
    }

    createExplosion(x, y, color = '#C67B5C') {
        for (let i = 0; i < 20; i++) {
            const particle = new ExplosionParticle(x, y, color);
            this.effects.push(particle);
        }
    }

    createSparkle(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = new SparkleParticle(x, y);
            this.effects.push(particle);
        }
    }

    update(ctx) {
        if (!this.isActive) return;
        
        this.effects = this.effects.filter(effect => {
            effect.update();
            effect.draw(ctx);
            return !effect.isDead();
        });
    }
}

// ===== EXPLOSION PARTICLE =====
class ExplosionParticle extends BaseParticle {
    constructor(x, y, color) {
        super(0, 0);
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.size = Math.random() * 3 + 1;
        this.color = color;
        this.maxLife = 30;
        this.life = this.maxLife;
    }

    update() {
        super.update();
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vy += 0.1; // gravity
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ===== SPARKLE PARTICLE =====
class SparkleParticle extends BaseParticle {
    constructor(x, y) {
        super(0, 0);
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.size = Math.random() * 2 + 1;
        this.maxLife = 20;
        this.life = this.maxLife;
    }

    update() {
        super.update();
        this.vx *= 0.95;
        this.vy *= 0.95;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ===== INITIALIZE PARTICLE SYSTEM =====
document.addEventListener('DOMContentLoaded', () => {
    // Wait for splash screen to finish
    setTimeout(() => {
        if (document.getElementById('particles-canvas')) {
            window.particleSystem = new ParticleSystem();
            window.particleEffectsManager = new ParticleEffectsManager();
        }
    }, 3000);
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleSystem,
        ParticleEffectsManager,
        SnowParticle,
        FireflyParticle,
        AmbientParticle,
        ExplosionParticle,
        SparkleParticle
    };
}
