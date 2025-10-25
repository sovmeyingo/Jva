# The Last of Us Tribute Discord Profile Website

🎮 **Endure and Survive** - Sinematik, etkileşimli Discord profil web sitesi

## 🌟 Özellikler

### 🎨 Tasarım
- **The Last of Us Part 1 & 2** temalı post-apokaliptik tasarım
- **Dark/Light mode** geçişi
- **Glassmorphism** efektleri
- **Parallax scrolling** animasyonları
- **Responsive** tasarım (mobil- masaüstü)

### 🎵 Ses & Müzik
- **Gustavo Santaolalla** - "Longing (Redemptions)" arka plan müziği
- **Müzik kontrolleri** (play/pause, volume)
- **Ses görselleştirici** animasyonları

### ✨ Animasyonlar
- **Parçacık efektleri** (kar, ateş böceği)
- **Scroll animasyonları** (fade-in, slide-in)
- **Hover efektleri** (lift, glow, scale)
- **Loading ekranı** (splash screen)
- **Typewriter** efektleri

### 🎯 İçerik Bölümleri
- **Hero Section** - Ellie portresi ve tanıtım
- **About Me** - Kişisel bilgiler ve Discord detayları
- **Social Links** - Discord, Spotify, Steam, GitHub
- **Games & Music** - Favori oyunlar ve müzik player
- **Stats** - Discord, Steam, oyun saatleri
- **Gallery** - Ellie fotoğrafları (lightbox)

### 🎪 Easter Eggs
- **Konami Code** - Infected mode aktivasyonu
- **Ellie'nin şakaları** - Rastgele şaka gösterimi
- **Gizli etkileşimler** - Mouse hover efektleri

## 🚀 Kurulum

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- Yerel web sunucusu (önerilen)

### Adımlar
1. Projeyi klonlayın veya indirin
2. Asset dosyalarını `assets/` klasörüne ekleyin
3. Yerel sunucu başlatın:
   ```bash
   # Python ile
   python -m http.server 8000
   
   # Node.js ile
   npx serve .
   
   # VS Code Live Server extension
   ```

### Asset Dosyaları
Aşağıdaki dosyaları `assets/` klasörüne ekleyin:

#### Resimler
- `assets/hero/ellie-hero.jpg` (1920x1080)
- `assets/games/tlou-part1.jpg` (400x400)
- `assets/games/tlou-part2.jpg` (400x400)
- `assets/games/horizon.jpg` (400x400)
- `assets/music/tlou-ost.jpg` (400x400)
- `assets/gallery/ellie-1.jpg` (800x600)
- `assets/gallery/ellie-2.jpg` (800x600)
- `assets/gallery/ellie-3.jpg` (800x600)
- `assets/gallery/ellie-4.jpg` (800x600)

#### Ses
- `assets/audio/longing-redemptions.mp3` (3:45, 128kbps)

## 🎨 Özelleştirme

### Renk Paleti
```css
/* Dark Mode */
--bg-primary: #1A1F2E
--bg-secondary: #252C3A
--text-primary: #E8F4F8
--accent-rust: #C67B5C
--accent-green: #5C7C5F
--accent-blue: #4A5F6D

/* Light Mode */
--bg-primary: #F5F0E8
--bg-secondary: #FFFFFF
--text-primary: #2C2C2C
--accent-rust: #A8654C
```

### Kişisel Bilgiler
`index.html` dosyasında aşağıdaki alanları güncelleyin:
- Discord kullanıcı adı
- Kişisel bio metni
- Sosyal medya linkleri
- Favori oyunlar listesi
- İstatistikler

## 📱 Responsive Tasarım

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

### Mobil Optimizasyonlar
- Touch-friendly butonlar (min 44x44px)
- Basitleştirilmiş animasyonlar
- Optimize edilmiş resim yükleme
- Hamburger menü (gerekirse)

## ♿ Erişilebilirlik

### Özellikler
- **ARIA** etiketleri
- **Keyboard** navigasyonu
- **Focus** göstergeleri
- **Reduced motion** desteği
- **WCAG AA** uyumlu kontrast

### Klavye Kısayolları
- `Tab` - Elementler arası gezinme
- `Enter/Space` - Buton aktivasyonu
- `Escape` - Lightbox kapatma
- `Arrow Keys` - Galeri navigasyonu

## 🎮 Easter Eggs

### Konami Code
```
↑ ↑ ↓ ↓ ← → ← → B A
```
**Sonuç**: Infected mode aktivasyonu (kırmızı filtre)

### Ellie'nin Şakaları
Sayfa yüklendikten 5 saniye sonra rastgele şaka gösterilir.

### Gizli Etkileşimler
- **Firefly hover**: Mouse'dan kaçma animasyonu
- **Social cards**: Platform-specific hover efektleri
- **Gallery**: Ken Burns zoom efekti

## 🚀 Performans

### Optimizasyonlar
- **Lazy loading** resimler için
- **CSS/JS minification** (production)
- **WebP** format desteği
- **Debounced scroll** events
- **RequestAnimationFrame** animasyonlar

### Yükleme Süreleri
- **Splash screen**: 3 saniye
- **İlk render**: < 1 saniye
- **Tam yükleme**: < 3 saniye

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - ES6+ features
- **Canvas API** - Parçacık efektleri
- **Web Audio API** - Müzik kontrolleri

### Tarayıcı Desteği
- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

## 📄 Lisans

Bu proje **The Last of Us** oyununun telif haklarına tabidir. Sadece kişisel kullanım için tasarlanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Discord**: Jva#1234
- **GitHub**: [@jva](https://github.com/jva)

---

**Endure and Survive!** 🍂

*"I'm gonna find... and I'm gonna kill... every last one of them"* - Ellie
