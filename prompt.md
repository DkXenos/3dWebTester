# StudyNest — Context Prompt for Rebuilding

> Copy and paste this entire document to another AI agent to rebuild the StudyNest website. **Design/colors are excluded** — apply your own color palette and visual identity.

---

## Overall Concept

**StudyNest** is a gamified study platform built as a **Next.js web application** that mimics a **desktop operating system (OS)** interface. The user experience is designed as an immersive journey:

1. **Landing → Video Scroll** — A scroll-driven intro video plays as the user scrolls down
2. **Lock Screen** — After the video ends, a macOS-style lock screen appears (username → password flow)
3. **Desktop OS** — After unlocking, a full desktop environment loads with a top menu bar, floating app windows, and a dock

The app is targeted at **university students** (the demo content is in Indonesian/Bahasa) and combines productivity tools with gamification elements (EXP, coins, streaks, leaderboards, daily rewards).

### Tech Stack
- **Framework**: Next.js (App Router, `'use client'` components)
- **Animation**: Framer Motion (`motion`, `AnimatePresence`)
- **Scroll Engine**: GSAP (`ScrollTrigger`) + Lenis (smooth scroll)
- **Styling**: Inline CSS styles (no Tailwind, no external CSS framework)
- **Fonts**: `Outfit` (headings/numbers) + `Inter` (body/UI)

---

## Phase 1: Video Scroll Effect

### How it works
A `<video>` element is **scrubbed by scroll position** (not auto-playing). The user scrolls down a tall container (500vh) and the video playback progresses proportionally.

### Technical Implementation

1. **Scrollable container**: A `div` with `height: 500vh` and `position: relative`, black background.

2. **Fixed video viewport**: A `div` with `position: fixed; inset: 0`, containing the `<video>` element styled with `object-fit: cover` to fill the entire screen.

3. **Scroll-to-video mapping** using GSAP ScrollTrigger:
   - `trigger`: the scrollable container
   - `start: 'top top'`, `end: 'bottom bottom'`
   - `scrub: 0.5`
   - On each scroll update: `video.currentTime = progress * video.duration`

4. **Lenis smooth scroll** is initialized alongside for buttery scrolling:
   ```
   duration: 1.4
   easing: Math.min(1, 1.001 - Math.pow(2, -10 * t))
   smoothWheel: true
   ```
   Lenis is connected to GSAP ticker via `lenis.on('scroll', ScrollTrigger.update)`.

5. **Fade-to-black overlay**: Starting at 80% scroll progress, a black overlay div fades in:
   - At 80%: opacity 0
   - At 90%: opacity 1
   - `opacity = (progress - 0.80) / 0.10` clamped to [0, 1]

6. **Transition to OS**: At 90% scroll progress, the `isInsideOS` state becomes `true`, which:
   - Hides the video (exits with fade animation)
   - Shows the Lock Screen component
   - Includes hysteresis: becomes false again only when scrolling back above 87%

7. **"Scroll to Enter" prompt**: Fixed at the bottom center of the screen while the video is visible:
   - Text: "Scroll to Enter" with uppercase styling
   - An animated arrow bouncing up/down (infinite animation)
   - A progress bar that fills up as the user scrolls
   - All three elements fade out when `isInsideOS` becomes true

### Video File Location
Place the video file at: `public/asset/video/video2.mp4`
> **Leave this directory empty** — the video will be added manually later.

### Component Flow
```
page.tsx
  └── VideoHero.tsx (dynamically imported, SSR disabled)
        ├── Scroll container (500vh)
        │   ├── Fixed video viewport with <video>
        │   ├── Fade-to-black overlay
        │   └── "Scroll to Enter" prompt
        ├── LockScreen (shown when isInsideOS && !isUnlocked)
        └── DesktopOverlay (shown when isInsideOS && isUnlocked)
```

---

## Phase 2: Lock Screen

After the video scroll ends, a **lock screen** appears with:

1. **Background**: Full-screen dark background with subtle radial gradients and a noise texture overlay.

2. **Clock Display**: Large time (HH:MM, 24h format) + full date below in a lighter, smaller font.

3. **Login Flow** (3 steps, animated transitions between them):

   **Step 1 — Username**:
   - Generic user silhouette avatar (SVG circle icon)
   - Text input for username (centered, transparent background)
   - Round "next" arrow button (the arrow becomes highlighted when there's text)
   - "Create Account" link below

   **Step 2 — Password**:
   - Avatar showing the first letter of the entered username
   - Display of the username
   - Password input field
   - "Sign In" button (gradient)
   - "Not [username]? Switch User" link to go back
   - Note: any password works for demo

   **Step 3 — Register** (accessed from "Create Account"):
   - "Create Account" heading
   - Three inputs: Full Name, Username, Password
   - "Create Account" button (only activates when all fields are filled)
   - "← Back to Login" link

4. **Unlock animation**: When login is submitted, the lock screen fades out with a scale+blur effect, then the Desktop Overlay appears.

5. **Bottom branding**: "✦ StudyNest" with "Your digital sanctuary" tagline at the bottom.

---

## Phase 3: Desktop OS Interface

The desktop overlay is a **full-screen fixed overlay** that simulates a desktop OS with these components:

### 3A. Wallpaper
A full-screen radial/linear gradient background (dark, atmospheric).

### 3B. Top Menu Bar
A 32px-tall bar at the top with three sections:

**Left — Brand + Menus**:
- "✦ StudyNest" brand name
- Three dropdown menus: **File**, **Edit**, **View**
- Each dropdown opens on click with animated slide-down
- Hovering between menus while one is open switches menus instantly

**File menu items**:
| Item | Shortcut | Action |
|------|----------|--------|
| New Note | ⌘N | Opens Notes window |
| Upload File to AI | ⌘U | Opens Notes window |
| Import Audio / Video | ⌘I | Opens Notes window |
| — divider — | | |
| Open AI Companion | ⌘A | Opens AI window |
| Start Study Session | ⌘S | Opens Study window |
| — divider — | | |
| Open GPA Calculator | | Opens GPA window |
| Open Forum | | Opens Forum window |
| — divider — | | |
| Export Notes as PDF | | Toast notification |
| Print | ⌘P | Toast notification |

**Edit menu items**:
| Item | Shortcut | Action |
|------|----------|--------|
| Undo | ⌘Z | Toast |
| Redo | ⌘⇧Z | Toast |
| — divider — | | |
| Cut | ⌘X | Toast |
| Copy | ⌘C | Toast |
| Paste | ⌘V | Toast |
| — divider — | | |
| AI Personality Settings | | Opens AI window |
| Study Timer Preferences | | Opens Study window |
| — divider — | | |
| Clear All Notes | | Toast |

**View menu items**:
| Item | Shortcut | Action |
|------|----------|--------|
| Show All Windows | | Opens all windows |
| Close All Windows | ⌘⇧W | Closes all windows |
| — divider — | | |
| Leaderboard | ⌘L | Opens Leaderboard |
| Daily Rewards | ⌘D | Opens Rewards |
| Quiz Mode | ⌘Q | Opens Quiz |
| — divider — | | |
| Toggle Full Screen | ⌘F | Toast |
| Zoom In | ⌘+ | Toast |
| Zoom Out | ⌘- | Toast |

**Center — Gamification HUD**:
- 🔥 Streak counter (e.g., "7 Hari")
- ⚡ EXP progress bar with current value (e.g., 2,340)
- 🪙 Coin count (e.g., 1,280)

**Right — System**:
- Battery indicator (🔋 100%)
- Wi-Fi label
- Live clock (HH:MM, updates every 10 seconds)

### 3C. Desktop Area
- **Welcome splash**: "Welcome to StudyNest" with "Your digital sanctuary is ready" shows for 2.5 seconds on load, then fades away.
- **Empty state hint**: "Open apps from the dock below" shown when no windows are open.
- **App windows**: Floating, draggable-style windows (each opened/closed independently).

### 3D. Dock
A centered bottom bar containing 8 app icons in a row:
- Each icon is an emoji in a rounded square
- Hover effect: icon rises up and scales (translateY(-8px) scale(1.15))
- Active indicator: small dot below open apps
- Active apps have a highlighted border/glow

The 8 dock apps (each toggles its corresponding window):

| ID | Name | Icon |
|----|------|------|
| notes | StudyNotes | 📝 |
| ai | AI Companion | 🤖 |
| study | Study Mode | ⏱️ |
| quiz | Quiz | 📊 |
| forum | Forum | 💬 |
| leaderboard | Leaderboard | 🏆 |
| gpa | GPA Calc | 🎓 |
| rewards | Daily Rewards | 🎁 |

### 3E. Toast Notifications
A small notification that slides down from the top center, auto-dismisses after 2 seconds. Used for menu actions that don't open a window.

---

## Phase 4: App Windows (Features)

All windows share:
- Glassmorphic styling (blur/saturate backdrop, semi-transparent background)
- macOS-style title bar with red close button + two inactive dots
- Window title centered in the title bar
- Entry animation: scale(0.92) + y(20) → scale(1) + y(0)
- Exit animation: reverse of entry

---

### 4.1 StudyNotes AI (📝)

A **three-panel note-taking app** with AI features.

**Left panel — Note list sidebar** (~200px wide):
- Section header: "My Notes"
- List of notes, each with:
  - Title (e.g., "Kalkulus Bab 3 — Integral")
  - Tag badge (e.g., "Matematika", "Informatika")
  - Shared indicator if shared (e.g., "📤 @rizkidev")
- Clicking a note selects it and shows its content

**Center panel — Note content**:
- Displays the note in a `<pre>` block with markdown-like formatting
- Below the note content, AI-generated sections can be toggled:
  - **AI Summary**: A summarized version of the note with study tips and estimated study time
  - **Audio Transcription**: AI-generated transcription from lecture audio with confidence score
  - **Video Summary**: AI-generated video summary with slide breakdowns and timestamps

**Right panel — AI Tools / Share** (~210px wide):
- Tabbed panel: "🤖 AI Tools" | "📤 Share"
- **AI Tools tab**:
  - "✨ Generate Summary" button (toggles the AI summary panel)
  - "🎙️ Generate from Audio" button (toggles audio transcription)
  - "🎬 Generate Video Summary" button (toggles video summary)
  - File upload dropzone: "Drop PDF, image, audio, or video to generate notes"
- **Share tab**:
  - Input field for username/email
  - "Share Note" button
  - List of users the note is currently shared with (with remove option)

---

### 4.2 AI Companion (🤖)

A **chat-based AI tutor** with customizable personality and avatar.

**Header area**:
- Avatar (switchable between Anime and Realistic styles, both rendered as inline SVGs)
- AI name: "Nestly" + current personality emoji
- Personality description
- Audio waveform visualizer (animated when "listening")

**Chat area**:
- Message bubbles (AI on left, user on right)
- AI messages and user messages have different styles (different border-radius corners)
- New messages animate in with a slide-up effect

**Input area**:
- 🎙️ Microphone button (toggles "listening" mode — waveform animates, button turns red)
- Text input field
- "Generate" button to trigger an AI response

**Customize panel** (toggleable sidebar from a ⚙️ button):
- Toggle avatar style (🎨 Anime / 📷 Realistic)
- Personality selector with 4 options:
  - 🧑‍🏫 Supportive Tutor — "Sabar, detail, penuh semangat"
  - 🥋 Strict Sensei — "Tegas, to the point"
  - 😎 Chill Friend — "Santai dan relatable"
  - ✨ Anime Senpai — "Kawaii dan encouraging~"
- Custom instructions textarea

---

### 4.3 Study Mode (⏱️)

A **multi-feature study tool** with 4 tabs:

**Tab 1 — Timer (Pomodoro)**:
- Customizable study/break durations (number inputs, default 25/5 minutes)
- Circular progress ring (SVG circle with animated stroke-dashoffset)
- Digital time display (MM:SS) with FOCUS/BREAK label
- Start/Pause button + Focus/Break toggle
- Coin earnings display: "+X coins earned this session!" (earns 50 coins per completed focus session)

**Tab 2 — Flashcards**:
- Card counter: "Card X/Y"
- Flip card with question on front, answer revealed on click
- Cards animate in with a rotateY flip effect
- "Show/Hide Answer" + "Next →" buttons
- Pre-loaded flashcards on math, algorithms, physics, and databases

**Tab 3 — Study Rooms**:
- List of virtual study rooms, each showing:
  - Room name
  - Public/Private badge
  - Topic (e.g., "Integral & Diferensial")
  - Member count (X/Y) with "Join" button
- Both public and private rooms are listed

**Tab 4 — Study With (Virtual Companions)**:
- 2x2 grid of virtual study companions (fictional characters from K-Pop and Anime)
- Each card shows: emoji, name, type badge (K-Pop/Anime), and "Study With" button
- Hover effect: subtle scale

---

### 4.4 Quiz (📊)

An **interactive quiz system** with multiple quiz sets.

**Quiz selection tabs**: Each quiz is a tab (e.g., "Kalkulus — Integral", "Struktur Data — Tree") + a "🏆 Board" tab.

**Quiz view**:
- Progress bar + "Question X/Y" counter + live score (correct/answered)
- Question displayed in a styled card
- Multiple choice options (A, B, C, D)
- After selecting: correct answer turns green, wrong answer turns red
- Feedback text: "✓ Benar! +50 EXP" or "✗ Salah"
- "Next →" button, or final score display on last question

**Leaderboard view** (within Quiz):
- Ranked list with emoji medals (🥇🥈🥉) for top 3
- Current user is highlighted
- Shows name + score in points

---

### 4.5 Forum Q&A (💬)

A **question-and-answer forum** with AI auto-answers and coin bounties.

**List view**:
- List of questions, each showing:
  - Title + description
  - Lecture tag (e.g., "Kalkulus II")
  - Coin bounty (🪙) if offered
  - Upvote count (▲) + answer count (💬)
  - Difficulty badge (+15/30/50 EXP based on Easy/Medium/Hard)
- "+ Ask Question" button

**Detail view** (clicking a question):
- Full question with title, description, lecture tag, bounty, upvotes
- **AI Answer section**: Automatically generated answer, shown by default
- **Human answers**: Listed below AI answer, each with username and response
- Answer input: text field + "Post" button

**Ask Question view**:
- Title input
- Description textarea
- Lecture selector dropdown
- Coin bounty slider (0–100, step 10)
- Info note: "AI will review your question and assign EXP based on difficulty"
- "Post Question" button

---

### 4.6 Leaderboard (🏆)

A **full leaderboard** with tab filtering.

**Tabs**: 🌐 Global | 🌐 University | 🌐 Friends

**Table columns**:
| Column | Description |
|--------|-------------|
| # | Rank (with emoji medals for top 3) |
| Player | Username (current user highlighted) |
| EXP | Total experience points (formatted with commas) |
| Lvl | Current level |
| 🔥 | Streak days (high streaks get an orange color) |

- Top 10 entries displayed
- Current user row is highlighted with a border and background
- Each row animates in with a staggered delay

---

### 4.7 GPA Calculator (🎓)

A **semester-by-semester GPA calculator** with AI improvement suggestions.

**Semester tabs**: Sem 1 | Sem 2 | Sem 3 | Sem 4

**IPK Display** (below tabs):
- Side by side: "IPK Semester" (semester GPA) and "IPK Kumulatif" (cumulative GPA)
- Both animate with a scale effect when switching tabs

**Course table**:
| Column | Description |
|--------|-------------|
| Mata Kuliah | Course name |
| SKS | Credit hours |
| Nilai | Grade (color-coded: green for A/A-, amber for B+/B, red for lower) |
| Bobot | Grade point value |

**Grade scale**: A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, D=1.0, E=0

**AI Improvement Plan**: Button at the bottom that toggles an AI-generated analysis showing:
- Which courses to improve and how
- Target GPA prediction
- Priority advice (focus on high-SKS courses first)

---

### 4.8 Daily Rewards (🎁)

A **daily login reward and activity tracking** system.

**Streak display**:
- Animated fire emoji (🔥) with pulsing scale
- "X Hari Streak!" counter
- "Login setiap hari untuk bonus!" subtitle

**Weekly calendar**:
- 7 day cells (Mon–Sun / Sen–Min)
- Completed days show ✅, current day shows 📦, future shows ⬜
- Each cell shows the day abbreviation
- Hover scale effect on each cell

**Today's reward card**:
- Shows "🎁 Day X Reward" with amount (e.g., "+100 🪙 🎁")
- "Claim Reward!" button → changes to "✓ Claimed! +50 EXP, +100 🪙"

**Recent Activity log**:
- Chronological list of recent actions with:
  - Activity icon
  - Description text
  - EXP or coin reward earned
  - Time ago (e.g., "2 jam lalu", "Kemarin")
- Activities include: note-taking, forum answers, pomodoro sessions, quiz scores, AI generation

---

## Summary of Gamification System

The following gamification elements are shared across the entire app:

| Element | Description |
|---------|-------------|
| **EXP** | Earned from quizzes (+50 per correct), forum answers (difficulty-based), study sessions, AI interactions |
| **Coins (🪙)** | Earned from Pomodoro sessions (+50 per completed), daily rewards, forum bounties |
| **Streak (🔥)** | Consecutive daily login counter |
| **Level** | Derived from total EXP |
| **Leaderboard** | Global, university, friends rankings by EXP |

---

## Directory Structure

```
app/
├── page.tsx                          — Main page, dynamically imports VideoHero
├── layout.tsx                        — Root layout
├── globals.css                       — Global styles
└── components/
    ├── VideoHero.tsx                  — Video scroll + orchestrator
    ├── LockScreen.tsx                — Login/register screen
    ├── DesktopOverlay.tsx            — Desktop OS shell (menu bar, dock, wallpaper)
    ├── NotesAIWindow.tsx             — StudyNotes AI app
    ├── AICompanionWindow.tsx         — AI Companion chat app
    ├── StudyModeWindow.tsx           — Timer, flashcards, rooms, companions
    ├── QuizWindow.tsx                — Quiz + mini leaderboard
    ├── ForumWindow.tsx               — Forum Q&A app
    ├── LeaderboardWindow.tsx         — Full leaderboard app
    ├── GPAWindow.tsx                 — GPA calculator app
    └── DailyRewardsWindow.tsx        — Daily rewards + activity log

public/
└── asset/
    └── video/
        └── (place video file here)    — The scroll-driven intro video
```
