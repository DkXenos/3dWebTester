# Desktop Website Features Implementation Guide for AI Agent

This document provides context and actionable instructions for an AI agent to implement the core features of the desktop web application. The application is built using Next.js (App Router), React, Tailwind CSS, and uses a desktop-OS-like interface window management system.

## 1. AI Smart Note (`NotesAIWindow.tsx`)
**Concept:** An intelligent note-taking application that assists users by auto-summarizing, extracting key concepts, and formatting study materials using AI.

**AI Implementation Steps:**
- **UI/UX:** Build a split-pane layout. The primary pane is a text editor (can be a standard textarea or a rich text editor like TipTap). The secondary pane displays AI-generated insights.
- **Functionality:** 
  - Manage state for the note's text content.
  - Create internal API routes (Next.js Route Handlers or Server Actions) to simulate or connect to an LLM for processing the note content.
  - Implement actionable buttons: "Summarize", "Extract Keywords", "Generate Flashcards".
- **Integration:** Ensure the window behaves correctly within the custom desktop window manager (draggable, minimizable, closable).

## 2. Focus Space Timer (`StudyModeWindow.tsx`)
**Concept:** A Pomodoro-style productivity timer integrated with ambient background functionality to enhance user focus.

**AI Implementation Steps:**
- **UI/UX:** A clean, distraction-free interface featuring a large countdown clock and intuitive controls (Play, Pause, Reset, Skip).
- **Functionality:**
  - Build a robust timer mechanism using React hooks (`useEffect` with `setInterval`) that handles strict tick updates.
  - Implement configurable session states (Focus: 25 mins, Short Break: 5 mins, Long Break: 15 mins).
  - Add integrated audio playback for ambient noise/lo-fi beats (utilizing the HTML5 Audio API).
- **Gamification hooks:** Trigger an event upon successful completion of a Focus session to award XP (connects to the Task Manager).

## 3. Gamified Task Manager
**Concept:** A dynamic to-do list where completing study tasks grants XP, levels up the user profile, and unlocks daily rewards (interacting with `DailyRewardsWindow.tsx` and `LeaderboardWindow.tsx`).

**AI Implementation Steps:**
- **UI/UX:** An engaging task list featuring checkboxes, an input field to add new tasks, and a prominent user progress bar showing current Level and XP.
- **Functionality:**
  - Create state management for tasks (id, title, completed, xp_value).
  - Implement an XP and leveling system (e.g., every 100 XP = 1 Level Up).
  - Add visual feedback: Use Framer Motion or CSS animations for satisfying checkmark bursts and XP bar fill animations when a task is completed.
  - Integrate a "Daily Streak" tracker that increments when tasks are completed consecutively.

## 4. Peer Study Forum (`ForumWindow.tsx`)
**Concept:** A built-in community board allowing users to post questions, share resources, and help peers within the platform.

**AI Implementation Steps:**
- **UI/UX:** A structured layout with a sidebar for categories/subjects (e.g., "Mathematics", "Computer Science") and a main feed for discussion threads.
- **Functionality:**
  - Define mock data structures for `Posts`, `Comments`, and `Users`.
  - Implement view states: A feed view listing all posts and a detailed thread view for reading and replying to a specific post.
  - Build a rich "Create Post" form.
  - Implement interactivity such as an upvote/downvote system for posts and comments to surface top study materials.