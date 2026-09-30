# Weekflow

> A minimalist, monochrome productivity planner built for focused work and intentional planning.

![License](https://img.shields.io/badge/license-proprietary-lightgrey.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 🎯 Overview

Weekflow is a sleek, browser-based weekly planner designed for anyone who values clean design and powerful functionality. Built with vanilla JavaScript and no build step, it's fast and private.

For now: No accounts, no cloud sync, no subscriptions—just open the file and start planning. All your data stays in your browser, making it perfect for those who prioritize privacy and simplicity.

## ✨ Features

### Core Functionality
- **📅 Multi-Week Planning** - Create and switch between unlimited weeks
- **✅ Task Management** - Add, edit, delete, and check off tasks with ease
- **⏱️ Time Estimates** - Track how long tasks should take
- **🕐 Time Scheduling** - Assign specific times to tasks
- **📝 Daily Notes** - Reflect on your day with built-in note sections
- **💾 Auto-Save** - Everything saves automatically to browser localStorage

### Productivity Tools
- **🍅 Pomodoro Timer** - Built-in focus timer (25-min work / 5-min break)
- **📊 Progress Tracking** - Real-time completion statistics
- **🎨 Clean UI** - Minimalist monochrome design that stays out of your way

### Technical Highlights
- **No Build Step** - Pure HTML, CSS, and JavaScript; the only library (SortableJS) and the fonts are bundled locally
- **Offline First** - Works completely offline, no internet required, no external requests
- **Privacy Focused** - All data stays in your browser, nothing sent to servers
- **Responsive Design** - Works on desktop and mobile devices
- **Data Persistence** - Uses localStorage, with validation, schema versioning, and a warning if saving fails
- **Backup & Restore** - Export and import your planner as JSON (imports are validated before use)

## 🚀 Quick Start

### Option 1: Download and Run Locally
1. Download `index.html` (or clone this repo)
2. Open the file in any modern web browser
3. Start planning!

### Option 2: Try It Live
Visit the [live demo](https://briakgodfrey.github.io/weekflow) (GitHub Pages)

## 📖 How to Use

### Creating Your First Week
1. The planner starts with a default week beginning today
2. Click **"+ New Week"** to create additional weeks
3. Switch between weeks using the sidebar navigation

### Managing Tasks
- Click **"+ Add Section"** to create task categories (e.g., "Workout", "Study")
- Click **"+ Task"** within a section to add tasks
- Click any text to edit it inline
- Check boxes to mark tasks complete
- Click **"+ Est"** to add time estimates
- Click **"+ Time"** to schedule when you'll do it

### Using the Pomodoro Timer
1. Click **"Start"** in the sidebar to begin a 25-minute focus session
2. The timer will automatically switch to a 5-minute break
3. Notifications alert you when sessions complete (enable browser notifications)

### Daily Notes
- Each day card has a notes section at the bottom
- Perfect for reflections, wins, or things you learned
- Auto-saves as you type

## 🛠️ Technical Details

**Built With:**
- HTML5
- CSS3 (Custom properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- SortableJS (bundled in `vendor/`, MIT)
- Manrope and IBM Plex Mono (self-hosted in `assets/fonts/`, SIL OFL 1.1)

**Browser Compatibility:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Data Storage:**
- localStorage (5-10MB limit depending on browser)
- Data persists between sessions
- Export with **Ctrl+S**, import from a JSON backup
- If saved data can't be read, a copy is kept under a `plannerData.corrupt-<timestamp>` key and the app starts fresh

## 🎨 Design Philosophy

The design embraces **refined minimalism**:
- Monochrome color palette for reduced visual noise
- IBM Plex Mono for technical precision
- Manrope for readable, modern display text
- Subtle animations and micro-interactions
- Focus on content, not decoration

## 🔮 Future Enhancements

- [X] Dark mode toggle
- [X] Data export (JSON/CSV)
- [X] Drag-and-drop task reordering
- [ ] Recurring tasks
- [ ] Calendar view
- [ ] Time blocking visualization
- [ ] Weekly/monthly analytics
- [ ] Import from Google Calendar
- [ ] Mobile app version

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests for improvements
- Fork and customize for your own use

## 📄 License

Proprietary License - Free to use as-is for personal or commercial purposes. Modifications and derivative works are not permitted. See LICENSE file for full terms.

## 👩‍💻 About

Built by **Bria** ([Briabytes](https://github.com/briakgodfrey))

This planner was born from a simple need: a productivity tool that's fast, private, and doesn't require creating yet another account. No cloud sync, no subscription, no tracking—just a solid planner that works offline and respects your data.

Perfect for students juggling coursework, developers managing side projects, or anyone who wants to plan their week without the bloat of traditional productivity apps.

**Connect:**
- 🌐 [Blog](https://briabytes.com)
- 📺 [Twitch](https://twitch.tv/briabytes)

## 🙏 Acknowledgments

- Fonts: [Manrope](https://fonts.google.com/specimen/Manrope) & [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (SIL Open Font License 1.1, see `assets/fonts/`)
- Drag and drop: [SortableJS](https://github.com/SortableJS/Sortable) (MIT, see `vendor/sortablejs/LICENSE`)
- Inspired by the need for a productivity tool that's beautiful, functional, and respects user privacy

---

⭐ **Star this repo if you find it useful!** ⭐
