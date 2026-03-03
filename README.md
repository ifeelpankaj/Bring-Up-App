# BringUp - Task Management Mobile App

A React Native / Expo mobile application for task assignment and management. Built with modern best practices for scalability and maintainability.

## Live Demo

[BringUp APK](https://drive.google.com/drive/folders/1Lqh_pvc42JW8xHUwm-RwyhIjNMsx6yoN?usp=sharing)

## 🚀 Features

- **Google Authentication** - Secure sign-in with Google via Firebase
- **Task Management** - Create, assign, and track tasks
- **Push Notifications** - Real-time notifications for task updates
- **Inbox/Outbox** - Organized view of assigned and created tasks
- **Task Categories** - Automatic categorization (new, missed, expired, pending, in-progress, closed)

## 📁 Project Structure

```
src/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout with providers
│   ├── index.tsx           # Landing/Auth screen
│   └── (tabs)/             # Tab navigation screens
│       ├── assigned.tsx    # Inbox - tasks assigned to you
│       ├── created.tsx     # Outbox - tasks you created
│       ├── create.tsx      # Create new task
│       ├── notifications.tsx # Notification center
│       └── profile.tsx     # User profile
├── components/             # Reusable UI components
│   ├── ErrorBoundary.tsx   # Error handling
│   ├── Loading.tsx         # Loading states & skeletons
│   ├── EmptyState.tsx      # Empty list states
│   ├── TabBar.tsx          # Custom tab bar
│   ├── InboxTaskCard.tsx   # Task card for inbox
│   ├── OutboxTaskCard.tsx  # Task card for outbox
│   └── google-auth.tsx     # Google sign-in button
├── config/                 # Configuration
│   ├── env.ts              # Environment configuration
│   ├── constants.ts        # App constants
│   ├── theme.ts            # Design system & theming
│   └── firebase.ts         # Firebase configuration
├── hooks/                  # Custom React hooks
│   ├── usePushNotifications.ts
│   ├── useTaskCategorization.ts
│   └── useOutboxTaskCategorization.ts
├── provider/               # Context providers
│   └── store-provider.tsx  # Redux store provider
├── store/                  # Redux state management
│   ├── index.ts            # Store configuration
│   ├── hooks.ts            # Typed hooks
│   ├── api/                # RTK Query APIs
│   │   ├── auth.api.ts
│   │   ├── task.api.ts
│   │   ├── alert.api.ts
│   │   └── base.query.ts
│   └── slices/             # Redux slices
│       └── auth.slice.ts
├── types/                  # TypeScript types
│   └── task.types.ts
└── utils/                  # Utility functions
    ├── task.utils.ts
    └── outbox.utils.ts
```

## 🛠 Tech Stack

- **Framework**: Expo SDK 54 with React Native 0.81
- **Navigation**: Expo Router v6
- **State Management**: Redux Toolkit with RTK Query
- **Authentication**: Firebase Auth with Google Sign-In
- **Notifications**: Expo Notifications
- **UI**: React Native with custom design system
- **Language**: TypeScript (strict mode)

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Android Studio / Xcode for local development

### Installation

1. Install dependencies:

```bash
npm install
```

2. **Set up environment variables:**

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
# - API_BASE_URL_DEV: Your local server IP
# - FIREBASE_* variables from Firebase Console
# - EXPO_PROJECT_ID from Expo Dashboard
```

3. **Set up Firebase (Android):**

```bash
# Copy the example google-services file
cp google-services.json.example google-services.json

# Replace with your actual google-services.json from Firebase Console
# Download from: Firebase Console > Project Settings > Your Android App
```

4. Start the development server:

```bash
npm start
```

5. Run on Android:

```bash
npm run android
```

6. Run on iOS:

```bash
npm run ios
```

## 🔐 Environment Configuration

All sensitive configuration is managed through environment variables:

| Variable                 | Description                                 |
| ------------------------ | ------------------------------------------- |
| `API_BASE_URL_DEV`       | Development API URL                         |
| `API_BASE_URL_STAGING`   | Staging API URL                             |
| `API_BASE_URL_PROD`      | Production API URL                          |
| `FIREBASE_WEB_CLIENT_ID` | Firebase OAuth Web Client ID                |
| `FIREBASE_PROJECT_ID`    | Firebase Project ID                         |
| `FIREBASE_API_KEY`       | Firebase API Key                            |
| `EXPO_PROJECT_ID`        | Expo Project ID                             |
| `APP_ENV`                | Environment: development/staging/production |

**Important:** Never commit `.env`, `google-services.json`, or `*-firebase-adminsdk.json` files to git.

## 📱 Building for Production

### Development Build

```bash
eas build --profile development --platform android
```

### Preview Build (Internal Testing)

```bash
eas build --profile preview --platform android
```

### Production Build

```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

## 🔧 Configuration

### Environment Configuration

Update `src/config/env.ts` for different environments:

- **Development**: Local API server
- **Staging**: Staging API server
- **Production**: Production API server

### Firebase Setup

1. Add `google-services.json` for Android
2. Add `GoogleService-Info.plist` for iOS
3. Update Firebase configuration in `src/config/env.ts`

## 📝 Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run lint       # Run ESLint
```

## 🏗 Architecture Principles

- **Modular Design**: Each feature is self-contained
- **Type Safety**: Full TypeScript with strict mode
- **Centralized Config**: All constants and configurations in one place
- **Error Handling**: Global error boundary with graceful fallbacks
- **Design System**: Consistent theming and styling
- **API Layer**: RTK Query for efficient data fetching and caching

## 📄 License

MIT License
