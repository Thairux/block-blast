# 🌌 Aether

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Expo](https://img.shields.io/badge/Powered%20by-Expo-000020.svg?style=flat&logo=expo&logoColor=white)](https://expo.dev)
[![GitHub stars](https://img.shields.io/github/stars/Thairux/block-blast?style=social)](https://github.com/Thairux/block-blast/stargazers)
[![Deployment](https://github.com/Thairux/block-blast/actions/workflows/release-web.yml/badge.svg)](https://github.com/Thairux/block-blast/actions)

**Aether** is a high-fidelity, strategic block-placing experience redesigned for precision, visual excellence, and infinite challenge. Built with React Native, Expo, and a high-performance backtracking engine.

[**Play Aether Web**](https://thairux.github.io/block-blast/) • [**Documentation**](./docs/README.md) • [**Report Bug**](https://github.com/Thairux/block-blast/issues)

---

## ✨ Key Features

- **🛡️ Indestructible Infinite Mode:** Powered by a look-ahead backtracking engine that guarantees a valid survival path exists for every hand.
- **💎 Strategic Puzzle Mode:** Structured level progression where you clear targeted blocks to collect gems.
- **🎨 3D Beveled Visuals:** High-quality, mitered 3D block graphics with dynamic lighting and shadows.
- **🤖 Survival Governor:** An adaptive system that intelligently scales piece complexity based on board density.
- **📱 Universal Compatibility:** Seamless drag-and-drop gameplay across Web, iOS, and Android.

---

## 🕹️ Game Modes

| Mode | Challenge | Goal |
| :--- | :--- | :--- |
| **Infinite** | "Try and Fail" | Survive the loop. The engine works against your mistakes. |
| **Classic** | Pure Strategy | Traditional block clearing with random piece generation. |
| **Puzzle** | Precision | Collect gems hidden in blocks to advance levels. |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- **Android:** Android Studio & SDK (for local builds)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Thairux/block-blast.git
   cd block-blast
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Mobile Deployment

#### Android
To build a local APK for testing:
```bash
npx expo run:android
```

For production builds (AAB), use EAS:
```bash
eas build --platform android
```

---

## 🛠️ Architecture

Aether is built on a modern reactive stack designed for 60FPS performance:

- **Core:** [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/)
- **Animation:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **State:** [Jotai](https://jotai.org/) (Atomic State Management)
- **Interaction:** [@mgcrea/react-native-dnd](https://github.com/mgcrea/react-native-dnd)
- **Engine:** Custom recursive backtracking solver for piece generation.

---

## 📈 Growth

[![GitHub Stars Grid](https://reporoster.com/stars/Thairux/block-blast)](https://github.com/Thairux/block-blast/stargazers)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by the Aether Team
</p>
