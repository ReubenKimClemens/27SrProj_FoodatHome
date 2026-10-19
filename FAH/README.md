# Food at Home

Food at Home is a mobile app for iOS, Android and the web. It's built with [React Native](https://reactnative.dev) and [Expo](https://expo.dev) as a senior project.

## Tech stack

- **Expo SDK 57** with **React Native 0.86** and **React 19**
- **TypeScript** (strict mode)
- **Expo Router** for file-based navigation
- **EAS** for cloud builds, owned by the `cronch-team` Expo account

## Project structure

The Expo app lives in the `FAH/` folder of the repository.

```
FAH/
├── src/
│   └── app/            # Screens and routes (Expo Router). Every file here is a route.
│       ├── _layout.tsx # Root navigator
│       └── index.tsx   # Home screen
├── assets/
│   ├── images/         # App icon, splash screen, Android icons, favicon
│   └── expo.icon/      # iOS app icon
├── app.json            # Expo config: app name, icons, plugins
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript config (`@/` import alias points to `src/`)
└── AGENTS.md           # Notes for AI coding assistants
```

Keep code that isn't a screen (components, hooks, utilities) outside `src/app/`, for example in `src/components/` or `src/hooks/`. You can import it with the `@/` alias, as in `import { Button } from "@/components/Button"`.

The `ios/` and `android/` folders aren't committed. Expo generates them when needed, so don't create or edit them by hand. Change native settings in `app.json` instead.

## Onboarding for new developers

### 1. Install the prerequisites

- [Node.js](https://nodejs.org) LTS (v20 or newer) and npm
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) is recommended. Install the Expo Tools extension when VS Code prompts you.
- A way to run the app. Pick at least one:
  - **Expo Go** on your phone (iOS App Store or Google Play). This is the easiest option.
  - **iOS Simulator** (macOS only). Install Xcode from the Mac App Store, then accept its license once:
    ```bash
    sudo xcodebuild -license
    ```
  - **Android Emulator**. Install [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/) and create a virtual device.

### 2. Clone the repository and install dependencies

```bash
git clone <repo-url>
cd 27SrProj_FoodatHome/FAH
npm install
```

Run all project commands from inside `FAH/`. Running `npx expo …` from the repository root downloads a different copy of Expo and won't work.

### 3. Start the app

```bash
npx expo start
```

Then do one of the following:

- Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android). Your phone and computer must be on the same Wi-Fi network.
- Press `i` to open the iOS Simulator.
- Press `a` to open the Android Emulator.
- Press `w` to open the app in a web browser.

The app reloads automatically when you save a file.

### 4. Get access to the Expo account (optional)

You only need this for EAS builds and updates. Create a free account at [expo.dev](https://expo.dev), ask a team member to add you to the `cronch-team` organization, and then sign in:

```bash
npx eas-cli@latest login
```

## Everyday commands

Run these from `FAH/`.

| Command | What it does |
| --- | --- |
| `npx expo start` | Start the dev server |
| `npx expo install <package>` | Add a package. Use this instead of `npm install <package>` so the version matches the Expo SDK. |
| `npx tsc --noEmit` | Check types |
| `npx expo lint` | Lint the code |
| `npx expo-doctor` | Check for dependency and config problems |
| `npx expo install --fix` | Fix packages that don't match the Expo SDK |

Before you open a pull request, run the typecheck and the lint, and make sure the app still starts.

## Learn more

- [Expo docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native docs](https://reactnative.dev/docs/getting-started)
