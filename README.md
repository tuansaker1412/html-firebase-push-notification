# FCM Push Notification Tester

Mini project HTML thuần để test nhận thông báo Firebase Cloud Messaging.

## Cấu trúc

```
firebase-fcm-test/
├── index.html               # UI chính
├── firebase-messaging-sw.js # Service Worker (bắt buộc)
└── README.md
```

## Setup

### 1. Lấy Firebase Config
1. Vào [Firebase Console](https://console.firebase.google.com)
2. Project Settings → General → Your apps → Web app
3. Copy `firebaseConfig`

### 2. Lấy VAPID Key
1. Project Settings → Cloud Messaging
2. Tab **Web configuration** → Generate key pair (hoặc dùng key đã có)

### 3. Cập nhật Service Worker
Mở `firebase-messaging-sw.js`, điền config vào `firebase.initializeApp({...})` — **bắt buộc** vì SW chạy độc lập, không đọc được từ UI.

### 4. Serve với HTTPS hoặc localhost
Service Worker **chỉ chạy trên HTTPS** hoặc `localhost`.

```bash
# Option 1: serve package
npx serve .

# Option 2: Python
python3 -m http.server 8080

# Option 3: VS Code Live Server extension
```

Truy cập: `http://localhost:8080`

### 5. Sử dụng UI

1. Điền Firebase Config vào form (hoặc Load Saved)
2. Click **Initialize FCM**
3. Cho phép notification khi browser hỏi
4. Copy FCM Token
5. Điền Backend URL của bạn (endpoint nhận token + title + body)
6. Click **Send via Backend** → nhận notification!

## Backend API expected format

Frontend gửi POST với body:

```json
{
  "token": "FCM_DEVICE_TOKEN",
  "title": "Notification title",
  "body": "Notification body text",
  "data": { "key": "value" }
}
```

Backend dùng token này để gọi Firebase Admin SDK gửi notification.

## Background vs Foreground

| Trạng thái | Xử lý ở đâu |
|---|---|
| Tab đang mở & focus | `messaging.onMessage()` trong `index.html` → hiện popup trong UI |
| Tab mở nhưng không focus | Service Worker → `showNotification()` → notification của OS |
| Tab đóng | Service Worker → `showNotification()` → notification của OS |
