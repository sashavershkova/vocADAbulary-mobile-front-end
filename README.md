# 📱 Tech Voice — Mobile App (React Native + TypeScript)

Expo-powered React Native client for **Tech voice**: flashcards, wallet, quizzes, sentence builder (learned-words-only), and progress tracking. Talks to the Spring Boot API. Built with TypeScript, React Navigation, and Axios.
**Tech Voice** is a cross-platform mobile application designed for beginner software development students — especially international learners — to help them strengthen their technical vocabulary and communication skills.  
The app is built with **React Native** and **TypeScript**, connects to a Java Spring Boot backend, and supports both iOS and Android.

**Key Features:**
- 📚 **Flashcards** — Learn programming terms with definitions and phonetics.
- 🗂 **Word Wallet** — Organize words into “In Progress” and “Got It!” lists.
- 📝 **Sentence Constructor** — Practice using learned words in code-related sentences.
- 🧠 **Quizzes** — Test your knowledge with topic-based multiple-choice quizzes.
- 📊 **Progress Tracking** — See your learning journey over time.
- 🎨 **Responsive UI** — Consistent look and feel across devices.

## 🧭 What You Can Do in Tech Voice

- **Browse Topics:** Explore key programming concepts organized into topics inspired by real software development curriculum.
- **Learn with Flashcards:** View definitions, phonetics, and example usage for each technical term, listen to pronunciation.
- **Save Words to Your Wallet:** Mark words as *In Progress* or *Got It!* to track your learning.
- **Practice in the Sentence Constructor:** Use only your *Got It!* words to fill in blanks in code-related sentences.
- **Test Yourself with Quizzes:** Take multiple-choice quizzes for different topics. Two right answers in a row hides the quiz as it considered learned.
- **Track Your Progress:** See statistics on learned vs. in-progress words and completed quizzes.
- **Replay & Reset:** Repeat quizzes and sentence builder exercises as part of spaced repetition.

##  Presentation link
https://www.canva.com/design/DAGvVokR-Nk/eTWrnZKH-SmmJjPUvDifsQ/view?utm_content=DAGvVokR-Nk&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h1d96880c87

---

## 0. Tech Stack and Dependencies

### ⚙️ Tech Stack

- **Language:** TypeScript
- **Framework:** React Native (Expo)
- **Navigation:** React Navigation (stack + tabs)
- **State & Data:** React Query
- **HTTP:** Axios
- **Forms (optional):** React Hook Form
- **Testing:** Jest + React Native Testing Library
- **Lint/Format:** ESLint + Prettier
- **Build/Release:** Expo Application Services (EAS)

### 📦 Dependencies

**Core**
- [React](https://react.dev/) — 19.0.0  
- [React Native](https://reactnative.dev/) — 0.79.5  
- [TypeScript](https://www.typescriptlang.org/) — ~5.8.3  

**Navigation**
- [@react-navigation/native](https://reactnavigation.org/docs/getting-started) — ^7.1.14  
- [@react-navigation/native-stack](https://reactnavigation.org/docs/native-stack-navigator) — ^7.3.21  

**UI & Components**
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler) — ~2.24.0  
- [react-native-screens](https://reactnative.dev/docs/screens) — ~4.11.1  
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) — 5.4.0  
- [react-native-element-dropdown](https://github.com/hoaphantn760/react-native-element-dropdown) — ^2.12.4  
- [react-native-linear-gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient) — ^2.8.3  
- [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) — ~14.1.5  

**Data & Storage**
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) — 2.1.2  
- [@react-native-community/checkbox](https://github.com/react-native-checkbox/react-native-checkbox) — ^0.5.20  
- [@react-native-picker/picker](https://github.com/react-native-picker/picker) — ^2.11.1  

**Networking**
- [Axios](https://axios-http.com/) — ^1.10.0  
- [Buffer](https://github.com/feross/buffer) — ^6.0.3  

**Media & Animation**
- [expo-av](https://docs.expo.dev/versions/latest/sdk/av/) — ~15.1.7  
- [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/) — ~0.4.8  
- [expo-video](https://docs.expo.dev/versions/latest/sdk/video/) — ~2.2.2  
- [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/) — ~18.1.11  
- [expo-font](https://docs.expo.dev/versions/latest/sdk/font/) — ~13.3.2  
- [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native) — 7.2.2  

**Expo Core**
- [Expo](https://docs.expo.dev/) — ~53.0.17  
- [expo-status-bar](https://docs.expo.dev/versions/latest/sdk/status-bar/) — ~2.2.3  

**Animation**
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) — ~3.17.4  

---

### 🛠 Dev Dependencies
- [@babel/core](https://babel.dev/) — ^7.25.2  
- [@types/react](https://www.npmjs.com/package/@types/react) — ~19.0.10  
- [@types/react-native](https://www.npmjs.com/package/@types/react-native) — ^0.72.8  
- [react-native-dotenv](https://www.npmjs.com/package/react-native-dotenv) — ^3.4.11  

---

## 1. Architecture at a Glance

- **Screens** (`/src/screens`) — top-level views (Topics, Quiz, Flashcard, Progress, Settings).
- **Components** (`/src/components`) — reusable UI building blocks.
- **API layer** (`/src/api`) — Axios instance + typed request helpers.
- **Navigation** (`/src/navigation`) — stacks/tabs linking screens.
- **Styles** (`/src/styles`) — shared style modules (per your preference).
- **Types** (`/src/types`) — app-wide TypeScript types/interfaces.
- **Utils** (`/src/utils`) — helpers (formatters, mappers).

**Typical request flow**  
`Screen → hook/useQuery → api/* (Axios) → Backend` → normalized/typed data → render.

---

## 2. Project Structure (General Tree)

```plaintext
src
│   ├── api
│   │   ├── auth.ts
│   │   ├── axiosInstance.ts
│   │   ├── flashcards.ts
│   │   ├── summary.ts
│   │   ├── topics.ts
│   │   ├── userFlashcards.ts
│   │   └── wallet.ts
│   ├── assets
│   │   ├── adaptive-icon.png
│   │   ├── favicon.png
│   │   ├── fonts
│   │   │   └── ArchitectsDaughter-Regular.ttf
│   │   ├── icon.png
│   │   ├── images
│   │   │   ├── bluestick.png
│   │   │   ├── button.png
│   │   │   ├── exit.png
│   │   │   ├── greenstick.png
│   │   │   ├── lavenderstick.png
│   │   │   ├── progress.png
│   │   │   ├── quiz.png
│   │   │   ├── settings.png
│   │   │   ├── splash-bg.jpeg
│   │   │   ├── stickman.png
│   │   │   └── wallet.png
│   │   └── splash-icon.png
│   ├── context
│   │   └── UserContext.tsx
│   ├── navigation
│   │   └── AppNavigator.tsx
│   ├── screens
│   │   ├── ConstructorScreen.tsx
│   │   ├── FallbackScreen.tsx
│   │   ├── FlashcardScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LearnedFlashcardScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── NewFlashcardScreen.tsx
│   │   ├── PopoverHint.tsx
│   │   ├── ProgressScreen.tsx
│   │   ├── QuizScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── SplashScreen.tsx
│   │   ├── TopicScreen.tsx
│   │   ├── TopicsScreen.tsx
│   │   └── WalletScreen.tsx
│   ├── styles
│   │   ├── constructorStyles.ts
│   │   ├── flashcardStyles.ts
│   │   ├── homeStyles.ts
│   │   ├── loginStyles.ts
│   │   ├── newflashcardStyles.ts
│   │   ├── progressStyles.ts
│   │   ├── quizStyles.ts
│   │   ├── settingsStyles.ts
│   │   ├── signUpStyles.ts
│   │   ├── splashStyles.ts
│   │   ├── topicsStyles.ts
│   │   ├── topicStyles.ts
│   │   └── walletStyles.ts
│   ├── types
│   │   ├── images.d.ts
│   │   ├── models.ts
│   │   ├── navigation.ts
│   │   └── sentences.ts
│   └── utils
│       ├── audioPlayer.ts
│       ├── formatDate.ts
│       └── ttsUtils.ts
```

## 3. Environment & Configuration

This app uses Expo’s public env vars for runtime config (available on the client).

Create a .env file at the project root:
```
bash

EXPO_PUBLIC_API_URL=http://192.168.1.23:8085   # your backend base URL for devices
EXPO_PUBLIC_ENV=local
```
On simulators http://localhost:8085 is fine; on a physical device, use your computer’s LAN IP.

Where API base URL is read: src/config/env.ts (imported by src/api/client.ts).

## 4. Local Setup

Prerequisites
Make sure you have:
- **Node.js 18+** (LTS recommended)
- **npm** (comes with Node)
- **Expo Go** app installed on your physical device (from App Store or Google Play)  
  _or_ iOS Simulator / Android Emulator set up
- Access to the backend URL (local or prod)
- **Expo Go** app installed on your physical device:
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **Simulator/Emulator for local testing** (optional but recommended):
  - **iOS** — Install [Xcode](https://developer.apple.com/xcode/) and enable iOS Simulator.
  - **Android** — Install [Android Studio](https://developer.android.com/studio) and create a virtual device (Pixel recommended).

1) Fork/Clone & install dependencies
```
bash

git clone <link from the frontend github repo>
cd <repo>
npm install
```
2) Environment variables
```
bash

# for local use
# EXPO_PUBLIC_API_URL=http://localhost:8080/

# for production use
EXPO_PUBLIC_API_URL=https://vocadabulary-mobile-back-end.onrender.com/
```
3) Start the app
```
bash

npx expo start -c
# then press: i (iOS), a (Android), or scan QR for Expo Go
```

## 5. Backend Connection (Base URLs)
- **Local (sim/emulator): http://localhost:8085**
- **Local (physical device): http://<YOUR_LAN_IP>:8085**
- **Prod (Render): https://vocadabulary-mobile-back-end.onrender.com**

Set these via EXPO_PUBLIC_API_URL so builds don’t need code changes.

## 6. API Layer (Axios)

src/api/client.ts:

- **Reads EXPO_PUBLIC_API_URL.**
- **Sets JSON headers.**
- **(Optional) Attaches mock user headers from your Spring Boot interceptor:**
  - **X-Mock-User-Id**
  - **X-Mock-User-Role**

Update or remove if you switch to real auth.