# 🚀 Deployment Rehberi

Bu rehber The Last of Us Discord profil web sitesini canlıya almak için gerekli adımları içerir.

## 📋 Ön Gereksinimler

### Gerekli Dosyalar
Aşağıdaki asset dosyalarını `assets/` klasörüne ekleyin:

#### Resimler (Zorunlu)
- [ ] `assets/hero/ellie-hero.jpg` (1920x1080)
- [ ] `assets/games/tlou-part1.jpg` (400x400)
- [ ] `assets/games/tlou-part2.jpg` (400x400)
- [ ] `assets/games/horizon.jpg` (400x400)
- [ ] `assets/music/tlou-ost.jpg` (400x400)
- [ ] `assets/gallery/ellie-1.jpg` (800x600)
- [ ] `assets/gallery/ellie-2.jpg` (800x600)
- [ ] `assets/gallery/ellie-3.jpg` (800x600)
- [ ] `assets/gallery/ellie-4.jpg` (800x600)

#### Ses Dosyası (Zorunlu)
- [ ] `assets/audio/longing-redemptions.mp3` (3:45, 128kbps)

### Kişisel Bilgiler
`index.html` dosyasında aşağıdaki alanları güncelleyin:
- [ ] Discord kullanıcı adı ve tag
- [ ] Kişisel bio metni
- [ ] Sosyal medya linkleri
- [ ] Favori oyunlar listesi
- [ ] İstatistikler (Discord üyelik tarihi, Steam seviyesi, vb.)

## 🌐 Hosting Seçenekleri

### 1. Vercel (Önerilen)
```bash
# Vercel CLI ile
npm i -g vercel
vercel

# GitHub ile
# 1. GitHub'a push yapın
# 2. vercel.com'da GitHub repo'yu bağlayın
# 3. Otomatik deployment
```

**Avantajlar:**
- Ücretsiz
- Hızlı CDN
- Otomatik HTTPS
- GitHub entegrasyonu

### 2. Netlify
```bash
# Netlify CLI ile
npm i -g netlify-cli
netlify deploy --prod --dir .

# Drag & Drop ile
# 1. netlify.com'a gidin
# 2. Proje klasörünü sürükleyin
```

**Avantajlar:**
- Ücretsiz
- Kolay setup
- Form handling
- Branch previews

### 3. GitHub Pages
```bash
# 1. GitHub repo oluşturun
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo-name.git
git push -u origin main

# 2. Settings > Pages > Source: Deploy from a branch
# 3. Branch: main, Folder: / (root)
```

**Avantajlar:**
- Ücretsiz
- GitHub entegrasyonu
- Özel domain desteği

### 4. Cloudflare Pages
```bash
# 1. cloudflare.com/pages
# 2. GitHub repo bağlayın
# 3. Build settings: Framework preset: None
# 4. Build command: (boş bırakın)
# 5. Build output directory: /
```

**Avantajlar:**
- Ücretsiz
- Hızlı global CDN
- DDoS koruması

## 🔧 Optimizasyon

### Resim Optimizasyonu
```bash
# WebP formatına çevirin
npx imagemin assets/**/*.{jpg,png} --out-dir=dist/assets --plugin=webp

# Manuel optimizasyon
# - JPEG kalitesi: 80-85%
# - PNG: PNG-8 kullanın
# - Boyutlar: hero (1920x1080), games (400x400), gallery (800x600)
```

### CSS/JS Minification
```bash
# CSS minification
npx clean-css-cli -o dist/styles/ styles/*.css

# JS minification
npx terser scripts/*.js -o dist/scripts/ -c -m
```

### Lazy Loading
```html
<!-- Resimler için lazy loading -->
<img src="placeholder.jpg" data-src="actual-image.jpg" loading="lazy" alt="Description">

<!-- JavaScript ile -->
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});
```

## 🌍 Custom Domain

### Domain Satın Alma
- **Namecheap**: Ucuz ve güvenilir
- **GoDaddy**: Popüler seçenek
- **Cloudflare**: Ücretsiz DNS

### DNS Ayarları

#### Vercel için:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

#### Netlify için:
```
Type: CNAME
Name: www
Value: your-site.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

## 📱 Discord Rich Embed

### Open Graph Meta Tags
```html
<meta property="og:title" content="Jva - The Last of Us Profile">
<meta property="og:description" content="Endure and Survive - My Gaming Journey">
<meta property="og:image" content="https://yourdomain.com/preview.jpg">
<meta property="og:url" content="https://yourdomain.com">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Jva">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Jva - The Last of Us Profile">
<meta name="twitter:description" content="Endure and Survive - My Gaming Journey">
<meta name="twitter:image" content="https://yourdomain.com/preview.jpg">
```

### Preview Image
- **Boyut**: 1200x630px
- **Format**: JPG/PNG
- **İçerik**: Ellie portresi + site başlığı
- **Dosya**: `preview.jpg` (root dizinde)

## 🔍 SEO Optimizasyonu

### Meta Tags
```html
<meta name="description" content="Discord profile inspired by The Last of Us - Endure and Survive">
<meta name="keywords" content="discord, the last of us, gaming profile, ellie, gaming">
<meta name="author" content="Jva">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://yourdomain.com">
```

### Structured Data
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jva",
  "url": "https://yourdomain.com",
  "sameAs": [
    "https://discord.gg/your-server",
    "https://steamcommunity.com/id/your-id",
    "https://github.com/your-username"
  ]
}
</script>
```

## 🚀 Deployment Checklist

### Ön Deployment
- [ ] Tüm asset dosyaları eklendi
- [ ] Kişisel bilgiler güncellendi
- [ ] Sosyal medya linkleri test edildi
- [ ] Responsive tasarım test edildi
- [ ] Müzik dosyası test edildi
- [ ] Tüm animasyonlar çalışıyor
- [ ] Easter eggler test edildi

### Deployment Sonrası
- [ ] Site erişilebilir
- [ ] Tüm resimler yükleniyor
- [ ] Müzik çalıyor
- [ ] Mobil uyumlu
- [ ] Discord embed çalışıyor
- [ ] SEO meta tags aktif
- [ ] HTTPS sertifikası aktif

## 🐛 Troubleshooting

### Yaygın Sorunlar

#### Müzik Çalmıyor
```javascript
// Autoplay policy hatası
// Kullanıcı etkileşimi gerekli
document.addEventListener('click', () => {
  audio.play().catch(e => console.log('Audio play failed:', e));
});
```

#### Resimler Yüklenmiyor
```html
<!-- Fallback resimler ekleyin -->
<img src="placeholder.jpg" 
     onerror="this.src='fallback.jpg'" 
     alt="Description">
```

#### Mobile Performance
```css
/* Animasyonları azaltın */
@media (max-width: 768px) {
  .particle { display: none; }
  .glass-card:hover { transform: none; }
}
```

## 📊 Analytics

### Google Analytics
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring
```javascript
// Core Web Vitals
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.value);
  }
}).observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
```

## 🎯 Son Kontroller

### Performance Test
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### Accessibility Test
- [ ] WCAG AA uyumlu
- [ ] Keyboard navigasyonu
- [ ] Screen reader uyumlu
- [ ] Color contrast > 4.5:1

### Cross-Browser Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

**Endure and Survive!** 🍂

Deployment tamamlandıktan sonra Discord'da profil linkinizi paylaşabilirsiniz!
