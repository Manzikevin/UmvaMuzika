# UmvaMuzika

UmvaMuzika is a modern, high-performance local music player built with React Native and Expo. Designed with a minimalist aesthetic and a focus on sleek UI/UX, it allows users to manage and play their local audio files with professional-grade transitions and background playback support.

## Features

*   **Local Media Scanning**: Automatic indexing of audio files from device storage using Expo Media Library.
*   **Modern Audio Player**: Full-screen immersive playback interface with support for seek, skip, and volume controls.
*   **Persistent Mini-Player**: A global playback controller that remains accessible while navigating the library.
*   **Production-Ready Permissions**: Configured for Android 14+ and iOS background audio modes.
*   **Minimalist Design**: Glassmorphism-inspired UI with dark mode optimization and Poppins typography.

## Tech Stack

*   **Framework**: Expo (React Native)
*   **Audio**: expo-audio
*   **Navigation**: expo-router (File-based routing)
*   **Animations**: Moti and React Native Reanimated
*   **Icons**: Lucide React Native
*   **Permissions**: expo-media-library

## Getting Started

### Prerequisites

*   Node.js (v20 or higher recommended)
*   Expo Go or a Development Build environment

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/Manzikevin/UmvaMuzika.git](https://github.com/Manzikevin/UmvaMuzika.git)

2. Install Dependencies

   ```bash
   npm install

3. Start the development server

   ```bash
   npx expo start

## Development

The project structure follows the Expo Router convention:
*   `app/`: Main application routes and layouts.
*   `app/(tabs)/`: Primary navigation tabs (Library, Search, etc.).
*   `components/`: Reusable UI components.
*   `utils/`: Helper functions and permission handlers.

## License

This project is licensed under the MIT License - see the LICENSE file for details.