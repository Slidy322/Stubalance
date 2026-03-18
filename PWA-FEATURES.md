# Stu-Balance PWA Features

## Progressive Web App Capabilities

### ✅ Installability
- **Install Prompts**: Smart install prompts appear after 3 seconds for first-time users
- **App Shortcuts**: Quick access to Focus Mode and Task Sorter from app launcher
- **Native Icons**: Beautiful gradient icons with task management theme (192x192, 512x512)
- **Maskable Icons**: Adaptive icons for Android devices

### 📴 Offline Support
- **Service Worker**: Caches essential assets for offline access
- **Offline Indicator**: Visual notification when connectivity changes
- **LocalStorage Persistence**: All tasks saved locally and available offline

### 🎨 Native App Experience
- **Standalone Mode**: Runs in its own window without browser UI
- **Theme Color**: Custom theme color matching app design (#1c3d5a)
- **Splash Screen**: Branded loading screen with animated logo
- **Responsive Design**: Works on all screen sizes (mobile, tablet, desktop)

## Key Features

### 📋 Task Dashboard
- Today's tasks with completion tracking
- Weekly tasks (collapsible)
- Auto-prioritized tasks based on urgency and difficulty
- Visual task organization with color-coded sections

### ⏱️ Focus Mode
- Pomodoro-style study timer
- Customizable study/break intervals
- Ambient sound selection (Rain, Forest, Waves, Cafe)
- Total study duration tracking
- Pause/Resume functionality

### 🎯 Task Sorter
- Intelligent task prioritization algorithm
- Factors: Due date urgency + Task difficulty
- Real-time priority score calculation
- Visual difficulty indicators
- Easy task management (add/delete)

## Priority Scoring Algorithm

```
Urgency Score:
- Overdue: 100 points
- Due within 24h: 90 points
- Due within 48h: 70 points
- Due within 72h: 50 points
- Due within 1 week: 30 points
- Due later: | points

Difficulty Multiplier:
- Easy: 1x (15 points)
- Medium: 2x (30 points)
- Hard: 3x (45 points)

Total Score = Urgency + Difficulty
```

## Installation

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Or click "Install" in the app prompt

### Mobile (Android)
1. Tap the menu (⋮)
2. Select "Add to Home Screen"
3. Or use the in-app install prompt

### Mobile (iOS)
1. Tap the Share button
2. Select "Add to Home Screen"
3. Name it "Stu-Balance"

## Technical Stack

- **Framework**: React 18 + TypeScript
- **Routing**: React Router v7 (Data mode)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Storage**: LocalStorage API
- **PWA**: Service Worker + Web App Manifest
- **Build**: Vite

## Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS & macOS)
- ✅ Firefox (Desktop & Mobile)
- ✅ Samsung Internet

## Storage

All data is stored locally in the browser:
- Today's tasks
- Weekly tasks
- Sorted/prioritized tasks
- Install prompt preferences

No server required - works completely offline after first load!
