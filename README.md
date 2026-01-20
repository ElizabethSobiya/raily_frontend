# Railway Tracking App - React Native Frontend

A premium railway tracking mobile app for Indian Railways built with **React Native**, **Expo**, and **TypeScript**.

## Features

- Real-time train tracking
- PNR status check
- Live journey updates
- Delay predictions
- Push notifications
- Offline support

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Styling**: StyleSheet (dark theme)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

```bash
# Clone the repository
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API URL
```

### Development

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── common/     # Button, Card, Badge, etc.
│   │   ├── journey/    # Journey-specific components
│   │   └── ticket/     # Ticket components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation setup
│   ├── store/          # Zustand stores
│   ├── services/       # API services
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Helpers & constants
│   ├── types/          # TypeScript types
│   └── config/         # Configuration
├── assets/             # Images, fonts
├── App.tsx             # App entry point
└── app.json            # Expo configuration
```

## Design System

### Colors

- **Primary**: `#2DD4BF` (Teal/Cyan)
- **Background**: `#000000`
- **Card**: `#0F1419`
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

### Typography

- System fonts with monospace for codes
- Bold headings, regular body text

## API Integration

The app connects to the backend API at the URL configured in `.env`:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/v1
```

## Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## License

MIT
