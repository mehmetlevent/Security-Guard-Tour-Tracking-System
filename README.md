# Güvenlik Görevlisi Tur Takip Sistemi

Bu proje, güvenlik görevlilerinin tur kontrollerini NFC etiketleri ve konum takibi ile yönetmelerini sağlayan bir mobil uygulamadır.

## Gereksinimler

- Node.js (v18 veya üzeri)
- Expo CLI
- Supabase hesabı
- NFC özellikli bir Android/iOS cihaz
- Git (opsiyonel)

## Kurulum Adımları

### 1. Supabase Kurulumu

1. [Supabase](https://supabase.com)'a gidin ve ücretsiz hesap oluşturun
2. Yeni bir proje oluşturun
3. Proje ayarlarından şu bilgileri alın:
   - Project URL
   - Project Anon Key

### 2. Proje Kurulumu

1. Projeyi bilgisayarınıza indirin
2. Terminal veya komut istemcisinde proje klasörüne gidin
3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

### 3. Ortam Değişkenlerini Ayarlama

1. Proje ana dizininde `.env` dosyası oluşturun
2. Aşağıdaki değişkenleri Supabase proje bilgilerinizle doldurun:
   ```
   EXPO_PUBLIC_SUPABASE_URL=sizin-proje-urlniz
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sizin-anonim-keyiniz
   ```

## Uygulamayı Çalıştırma

1. Geliştirme sunucusunu başlatın:
   ```bash
   npm start
   ```

2. Expo Go uygulamasını telefonunuza indirin:
   - [Android için Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS için Expo Go](https://apps.apple.com/app/expo-go/id982107779)

3. Telefonunuzda Expo Go uygulamasını açın

4. QR kodu okutun veya projenizi Expo Go üzerinden bulun

## Test Hesabı Oluşturma

1. Uygulamayı açın
2. "Kayıt Ol" butonuna tıklayın
3. E-posta ve şifre ile kayıt olun
4. Giriş yapın

## NFC Test Noktası Oluşturma

Supabase veritabanında test için kontrol noktası eklemek:

1. Supabase Dashboard'a gidin
2. SQL Editör'ü açın
3. Aşağıdaki SQL kodunu çalıştırın:
   ```sql
   INSERT INTO checkpoints (name, nfc_id, location, sequence, expected_time)
   VALUES 
   ('Giriş Kapısı', 'test-nfc-1', '41.0082,28.9784', 1, '08:00:00'),
   ('Güvenlik Odası', 'test-nfc-2', '41.0082,28.9785', 2, '08:15:00');
   ```

## Sorun Giderme

1. **NFC Çalışmıyor**
   - Telefonunuzun NFC özelliğinin açık olduğundan emin olun
   - NFC ayarlarını kontrol edin

2. **Konum Hatası**
   - Konum izinlerini kontrol edin
   - GPS'in açık olduğundan emin olun

3. **Giriş Yapılamıyor**
   - İnternet bağlantınızı kontrol edin
   - Doğru e-posta ve şifre kullandığınızdan emin olun

## Notlar

- Uygulama gerçek NFC etiketleri gerektirir
- Test için sahte NFC ID'leri kullanabilirsiniz
- Konum servisleri açık olmalıdır
- E-posta bildirimleri için internet bağlantısı gereklidir

## Destek

Sorularınız için: support@company.com