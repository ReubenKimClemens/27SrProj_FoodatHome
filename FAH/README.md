# FAH Mobile – Developer Setup Guide

This guide gets you from nothing to running the FAH mobile app on your computer and phone. It should take about 30–60 minutes the first time, mostly waiting on installs.

**Stack:** TypeScript · React Native + Expo · Supabase

> Replace the placeholders below before sharing:
> - `<GITHUB_REPO_URL>` – e.g. `https://github.com/fah-team/fah-mobile.git`
> - `<REPO_FOLDER>` – the folder name after cloning (add `/mobile` if the app lives in a subfolder)
> - `<EXPO_ORG>` – the Expo organization name
> - `<PROJECT_LEAD>` – who to ask for keys and invites

---

## 1. Get access (do this first)

Ask `<PROJECT_LEAD>` to:

- [ ] **Add you to the GitHub repo** (Settings → Collaborators). Accept the email invite.
- [ ] **Add you to the Expo organization** `<EXPO_ORG>` on expo.dev. Make a free Expo account first if you don't have one.
- [ ] **Send you the Supabase values** for your `.env` file (URL + publishable key). These are never in the repo.
- [ ] *(Optional, iPhone testers)* **Add you as a TestFlight internal tester** in App Store Connect.

---

## 2. Install the tools

### Everyone

1. **Node.js (LTS)** – download from https://nodejs.org. Check it worked:
   ```bash
   node --version
   npm --version
   ```
2. **Git** – check with `git --version`. On a Mac, macOS will offer to install it if missing.
3. **A code editor** – VS Code recommended.
4. **Expo Go on your phone** – free from the App Store (iPhone) or Google Play (Android). This is how you'll test the app. See step 7.

That's all most devs need. You do **not** need Xcode or Android Studio to work on this project.

### Lead dev only (optional): Xcode

Only the lead dev needs this, and only for the iOS Simulator on a Mac or for debugging native iOS issues. TestFlight builds run in Expo's cloud, so they don't need Xcode either.

- **Xcode** from the Mac App Store (about 10+ GB). Open it once and let it install extra components, then make sure an **iOS Simulator** is installed under Xcode → Settings → Components (called Platforms in some versions).

### Optional: Android Studio

Only needed if you want an Android emulator on your computer instead of using a real phone. Get it at https://developer.android.com/studio and create an emulator under Device Manager → Create device.

### Fix npm permissions (Mac) – do this before installing global tools

If `npm install --global ...` gives an `EACCES: permission denied` error, run this once (don't use `sudo`):

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### EAS CLI (Expo's build tool)

```bash
npm install --global eas-cli
eas --version
```

> Can't install it globally? Use `npx eas-cli@latest` anywhere this guide says `eas`.

---

## 3. Get the code

```bash
git clone <GITHUB_REPO_URL>
cd <REPO_FOLDER>
npm install
```

`npm install` downloads all the packages the app needs (it creates `node_modules/`, which is never committed).

---

## 4. Add your environment variables

The repo has a template file called `.env.example`. Copy it:

```bash
cp .env.example .env
```

Open `.env` and paste in the values from `<PROJECT_LEAD>`:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=xxxxx
```

**Rules:**
- Never commit `.env`. It's already in `.gitignore` – check with `git check-ignore -v .env` (it should print a line).
- Never put the Supabase **service role** key in the app or the repo.
- If you change `.env`, restart the dev server (step 6) for it to take effect.

---

## 5. Log in to Expo

```bash
eas login
eas whoami
```

`eas whoami` should print your Expo username. The project is already linked to `<EXPO_ORG>` through `app.json`, so you don't need to run `eas init`.

---

## 6. Run the app

```bash
npx expo start
```

A QR code appears in the terminal. Scan it with your phone to open the app (full walkthrough in step 7).

Useful keys in the terminal:

| Press | What happens |
| --- | --- |
| `r` | Reloads the app on every connected phone |
| `m` | Opens the developer menu on your phone |
| `i` | Opens the iOS Simulator (lead dev with Xcode only) |
| `a` | Opens the Android emulator (only if you installed Android Studio) |
| `Ctrl + C` | Stops the dev server |

Save a file and the app updates on your phone automatically.

If something looks broken after pulling new changes, clear the cache:

```bash
npx expo start -c
```

---

## 7. Test on a real iPhone with Expo Go

This is the main way to test while you're coding. Your phone runs the app live from your computer, and every time you save a file, it updates on your phone within a second or two.

### One-time setup

1. On your iPhone, install **Expo Go** from the App Store.
2. Open Expo Go and **sign in with your Expo account** (the same one from step 5). This isn't strictly required, but it makes your project show up in the app automatically.
3. Make sure your **iPhone and computer are on the same Wi-Fi network**. School or public Wi-Fi often blocks this. If you're on campus Wi-Fi, skip to "Can't connect?" below.

### Every time you test

1. In Terminal, inside the project folder, run:
   ```bash
   npx expo start
   ```
2. A **QR code** appears in the terminal.
3. Open the iPhone's built-in **Camera** app and point it at the QR code.
4. Tap the **"Open in Expo Go"** banner that pops up.
5. The first time, your iPhone may ask to **find devices on your local network**. Tap **Allow**. If you tapped "Don't Allow" by accident, go to Settings → Privacy & Security → Local Network and turn on Expo Go.
6. Wait for the progress bar ("Bundling…"). The first load takes the longest.
7. The app opens. Edit a file on your computer, save it, and watch it update on your phone.

After the first time, the project also shows up on Expo Go's home screen under **Development servers**, so you can just tap it instead of scanning again (as long as `npx expo start` is running).

### Handy things while testing

- **Shake your iPhone** (or press `m` in the terminal) to open the developer menu. From there you can reload, see performance info, or open the debugger.
- **Red error screen?** That's a code error. It shows the file and line number. Fix the code and save, and it reloads on its own.
- **Yellow warning box?** It's a warning, not a crash. You can tap it to read it or dismiss it.
- **Several teammates can test at once.** Each person runs their own `npx expo start` and scans their own QR code.

### Can't connect?

If the QR code won't load (common on school Wi-Fi, which often blocks phone-to-laptop connections), use tunnel mode:

```bash
npx expo start --tunnel
```

This routes the connection through the internet instead of your local network. It's a bit slower but works on almost any Wi-Fi, or even with your phone on cellular data. The first time, it may ask to install a helper package. Say yes.

Other fixes:

- Make sure both devices really are on the same network (not one on "Drexel Guest" and one on another network, for example).
- Turn off any VPN on your computer or phone.
- Close Expo Go completely (swipe it away) and scan again.
- If Expo Go says the project needs a **different SDK version**, update Expo Go from the App Store. If it still doesn't match, tell `<PROJECT_LEAD>`.

### What Expo Go can't test

Expo Go is great for screens, layouts, navigation and Supabase data, but it can't fully test:

- Login that redirects back into the app (magic links, Google or Apple sign-in)
- Deep links
- Push notifications
- Any package that adds custom native code

For those, use one of these instead:

- **Development build:** a version of our app with developer tools built in. Ask `<PROJECT_LEAD>` for the install link, then run `npx expo start` and open that app instead of Expo Go. (The lead dev creates it with `eas build --profile development --platform ios`. On iPhone, your device has to be registered first, so send the lead your iPhone details when asked.)
- **TestFlight:** the "real" app, the closest thing to the App Store version. If you were added as an internal tester, install the **TestFlight** app from the App Store and accept the invite email. New builds show up there automatically.

### Android phones

Same steps, except you open **Expo Go** and tap **Scan QR code** inside the app instead of using the Camera.

---

## 8. How we work together

1. **Always start from the latest code:**
   ```bash
   git checkout main
   git pull
   npm install        # in case someone added a package
   ```
2. **Make a branch for your work:**
   ```bash
   git checkout -b your-name/short-description
   # e.g. git checkout -b reuben/habit-list-screen
   ```
3. **Commit often with clear messages:**
   ```bash
   git add .
   git commit -m "Add habit list screen"
   ```
4. **Push and open a pull request:**
   ```bash
   git push -u origin your-name/short-description
   ```
   Then on GitHub, click **Compare & pull request**. Ask a teammate to review before merging into `main`.
5. **Adding a package?** Use `npx expo install <package>` (not plain `npm install`) so you get a version that matches our Expo SDK, and mention it in your PR.

---

## 9. Project layout

```
<REPO_FOLDER>/
├── app/                 Screens and routes (Expo Router – each file is a screen)
│   ├── _layout.tsx      App-wide layout and navigation
│   └── index.tsx        Home screen
├── components/          Reusable UI pieces
├── lib/                 Supabase client, types, data functions
│   └── supabase.ts
├── assets/              Images, icons, fonts
├── global.css           Tailwind (NativeWind) setup
├── app.json             App name, bundle ID, Expo project ID
├── eas.json             Build settings
├── .env.example         Template for your .env (no real values)
└── package.json         Dependencies and scripts
```

**Styling:** we use NativeWind, so you style with Tailwind classes:
```tsx
<View className="flex-1 items-center justify-center bg-white">
  <Text className="text-2xl font-bold">Hello</Text>
</View>
```
Use `View`, `Text`, `Pressable`, `TextInput`, and `FlatList` instead of HTML tags.

---

## 10. Troubleshooting

| Problem | Fix |
| --- | --- |
| `EACCES: permission denied` on `npm install --global` | Run the npm permissions fix in step 2, or use `npx eas-cli@latest` |
| `eas: command not found` | Close and reopen Terminal, or run `source ~/.zshrc` |
| App shows old code or weird errors after `git pull` | `npm install`, then `npx expo start -c` |
| Supabase errors / "undefined" URL | Check `.env` exists, values are filled in, and restart the dev server |
| Styles (Tailwind classes) not working | `npx expo start -c` to clear the cache |
| `i` doesn't open the simulator (lead dev) | Open Xcode once, check a simulator is installed, then try again |
| `a` doesn't open Android | Start an emulator from Android Studio's Device Manager first |
| Phone can't connect to Expo Go | Same Wi-Fi as your computer, allow Local Network access, or run `npx expo start --tunnel` (see step 7) |
| Expo Go says wrong SDK version | Update Expo Go from the App Store, then tell `<PROJECT_LEAD>` if it still fails |
| Package version warnings | `npx expo install --fix` |

Still stuck? Post the full error message in the team chat or ask `<PROJECT_LEAD>`.

---

## Quick reference

```bash
git pull && npm install      # get latest
npx expo start               # run the app
npx expo start -c            # run with cache cleared
npx expo install <package>   # add a package
eas whoami                   # check Expo login
npx testflight               # build + send to TestFlight (project lead)
```