# Last.fm API Kurulum Rehberi

## 🎵 Last.fm API Nasıl Alınır:

### 1. Last.fm Hesabı Oluşturun
1. [last.fm](https://www.last.fm) sitesine gidin
2. "Sign Up" ile ücretsiz hesap oluşturun
3. Email doğrulaması yapın

### 2. API Key Alın
1. [Last.fm API](https://www.last.fm/api) sayfasına gidin
2. "Get an API account" butonuna tıklayın
3. Formu doldurun:
   - **Application name**: "Jva's Website"
   - **Application description**: "Personal website music integration"
   - **Application homepage**: Website URL'niz
   - **Application callback URL**: Website URL'niz
4. "Submit" butonuna tıklayın
5. **API Key** ve **Shared Secret** alacaksınız

### 3. API Key'i Website'e Ekleyin

`scripts/main.js` dosyasında şu satırları bulun:

```javascript
this.lastfmApiKey = 'YOUR_LASTFM_API_KEY_HERE';
this.lastfmUsername = 'YOUR_LASTFM_USERNAME_HERE';
```

Ve şu şekilde değiştirin:

```javascript
this.lastfmApiKey = 'GERÇEK_API_KEY_BURAYA';
this.lastfmUsername = 'LASTFM_KULLANICI_ADINIZ';
```

### 4. Last.fm Scrobbling Kurulumu

Müziğinizin otomatik olarak algılanması için:

1. **Spotify + Last.fm**:
   - Spotify'da Last.fm uygulamasını bağlayın
   - [Last.fm Spotify App](https://www.last.fm/settings/applications) sayfasından bağlayın

2. **Diğer Müzik Uygulamaları**:
   - Last.fm desktop uygulamasını indirin
   - Müzik uygulamanızla entegre edin

### 5. Test Etme

1. API key'i ekledikten sonra sayfayı yenileyin
2. About Me bölümünde gerçek müzik bilgisi görünecek
3. Console'da hata varsa kontrol edin

## 🔧 Önemli Notlar:

- **API Limit**: 1000 istek/gün ücretsiz
- **Güvenlik**: API key'i public repository'de paylaşmayın
- **Fallback**: API çalışmazsa örnek müzikler gösterilir
- **Güncelleme**: Her 30 saniyede bir güncellenir

## 🚀 Alternatif Seçenekler:

1. **Discord Rich Presence**: Discord bot ile müzik algılama
2. **Spotify Web API**: Daha gelişmiş entegrasyon
3. **Manuel Güncelleme**: Statik müzik listesi

## 📞 Yardım:

API kurulumunda sorun yaşarsanız:
- Last.fm API dokümantasyonu: [last.fm/api](https://www.last.fm/api)
- GitHub issues
- Console hatalarını kontrol edin
