# Motif 8

A daily habit tracker built around 8 pillars — Body, Mind, Growth, Diet, Focus,
Reflection, Sleep, and Progress — with a strict 90-day transformation streak.
Miss a section on any day and the streak resets to Day 1. All data, including
progress photos, is stored locally on your device only.

## Stack

- **Expo (React Native)** — one codebase for iOS and Android
- **AsyncStorage** — local persistence, no backend, no accounts
- **expo-image-picker** + **expo-file-system** — camera capture, photos saved
  to the app's local document directory
- **react-native-svg** — the progress ring and streak heatmap
- **React Navigation** — bottom tabs (Today, Gallery, Notes, Streak) + modal
  screens (Diet log, camera, reminders, day complete, day 90, failure)

## Project structure

```
App.js                        entry point, navigation container
src/
  theme.js                    colors, spacing, radius tokens
  constants/sections.js       the 8 sections + diet sub-items
  storage/AppContext.js       all persisted state + business logic
  components/                 ProgressRing, SectionRow
  screens/                    one file per screen
  navigation/RootNavigator.js tabs + stack
```

## Core logic (src/storage/AppContext.js)

- **Rollover**: on every app open, compares today's date to the last opened
  date. If yesterday was fully checked off and locked, the day advances. If it
  wasn't, a failure is recorded and stays pending until you tap "start day 1
  again" — nothing is force-shown at midnight, only on your next open.
- **Diet** counts as done once at least one of water / protein / vitamins /
  calories is logged.
- **Day 90**: closing out all 8 sections on day 90 shows the completion screen
  immediately instead of the normal daily one.
- Nothing is editable once a day is locked (all 8 sections checked).

## Running it yourself

You'll need the free **Expo Go** app on your phone (App Store / Play Store)
to test this with live reload and real camera access — a simulator can't take
photos.

1. Install [Node.js](https://nodejs.org) (LTS) if you don't have it.
2. Clone this repo and install dependencies:
   ```
   npm install
   ```
3. Start the dev server:
   ```
   npx expo start
   ```
4. Scan the QR code with your phone's camera (iOS) or the Expo Go app
   (Android). The app opens live on your phone.

### Using Replit instead

Import this GitHub repo into a new Replit project using Replit's "Import from
GitHub" option, choose the Node.js/Expo template if prompted, then run
`npx expo start --tunnel` in the Replit shell. Scan the QR code Replit shows
with Expo Go the same way.

## Suggested next steps

- Wire up `expo-notifications` with the times set in the Reminders screen
  (currently the screen saves times but doesn't yet schedule real
  notifications — that's the next milestone).
- Replace the emoji trophy on the Day 90 screen with a custom icon/graphic.
- Add a proper native time picker to the Reminders screen instead of a text
  field.
