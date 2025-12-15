# VeloKit

A mobile-first Progressive Web App that recommends cycling clothing based on weather conditions.

## Features

- **Location-based weather**: Uses browser geolocation or manual city input
- **Smart recommendations**: Rule-based clothing recommendations based on temperature, wind, and rain
- **PWA support**: Installable on iOS and Android with offline fallback
- **Native mobile apps**: iOS and Android apps built with Capacitor
- **Mobile-first design**: Optimized for mobile devices

## Setup

1. Install dependencies:
```bash
npm install
```

2. Get an OpenWeather API key:
   - Sign up at [openweathermap.org](https://openweathermap.org/api)
   - Get your free API key
   - Enter it in the app's Settings page

3. Generate PWA icons (optional):
   - Create `public/pwa-192x192.png` (192x192px)
   - Create `public/pwa-512x512.png` (512x512px)
   - Or use an online tool to generate from a source image

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173/VeloKit/`

## Build

### Web/PWA Build

```bash
npm run build
```

The built files will be in the `dist` directory.

### Native Mobile Apps (iOS & Android)

VeloKit uses [Capacitor](https://capacitorjs.com/) to build native iOS and Android apps.

#### Prerequisites

**For iOS:**
- macOS with Xcode installed
- CocoaPods: `sudo gem install cocoapods`

**For Android:**
- Android Studio installed
- Android SDK configured
- Java Development Kit (JDK)

#### Building for Native Platforms

1. Build the app for native platforms:
```bash
npm run build:native
```

2. Sync the web assets to native platforms:
```bash
npm run cap:sync
```

This builds the app and copies the web assets to both iOS and Android projects.

#### Opening in Native IDEs

**iOS:**
```bash
npm run cap:ios
```
This opens the project in Xcode where you can build and run on simulators or devices.

**Android:**
```bash
npm run cap:android
```
This opens the project in Android Studio where you can build and run on emulators or devices.

#### Development Workflow

1. Make changes to your React code
2. Run `npm run cap:sync` to sync changes to native platforms
3. Test in Xcode (iOS) or Android Studio (Android)
4. For web/PWA testing, use `npm run dev` (runs on `/VeloKit/` base path)
5. For native testing, use `npm run build:native` then `npm run cap:sync`

**Note:** The app automatically detects if it's running as a native app or PWA and adjusts the base path accordingly.

## Deployment

The app is configured to deploy to GitHub Pages at `/VeloKit/`.

### Quick Deployment (Recommended)

Simply run:
```bash
npm run deploy
```

This will build the project and deploy it to the `gh-pages` branch automatically.

Alternatively, use the shell script:
```bash
./deploy.sh
```

**Note:** Make sure GitHub Pages is configured to serve from the `gh-pages` branch:
- Go to repository Settings → Pages
- Source: Deploy from a branch
- Branch: `gh-pages` / `(root)`

### Automatic Deployment (GitHub Actions)

Push to the `main` branch and GitHub Actions will automatically build and deploy to the `gh-pages` branch.

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to GitHub Pages:
```bash
npx gh-pages -d dist
```

## Configuration

- **Base path**: `/VeloKit/` (configured in `vite.config.ts`)
- **API key**: Stored in localStorage (user-provided)
- **Weather cache**: 30 minutes in localStorage
- **Units**: Metric (°C / km/h) or Imperial (°F / mph)

