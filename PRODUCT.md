# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary groups, weighted equally (confirmed by the owner):

- IT students and self-taught beginners learning in the evenings and at weekends, who start at Newbie and need visible progress (streaks, lessons passed) to keep going.
- Working adults switching careers into IT, with little time, who need a clear path plus projects and job guidance to get hired.

Interface language is Vietnamese first; the UI also ships in English, Japanese, Korean, Chinese, French, German and Spanish.

## Product Purpose

DevMaster Hub takes a learner from Newbie to Master in a programming technology: read the theory, run the code in the browser, take a generated quiz, do exercises graded by AI, build a project, then get career advice and matching jobs. Success means the learner keeps coming back and reaches the next level.

## Positioning

The owner wants all of these surfaced equally, as one path rather than separate tools:

- A 5-level path (Newbie, Junior, Mid, Senior, Master) for 35 technologies, unlocked in order.
- An AI tutor beside every lesson that hints instead of handing over answers, grades exercises and generates quizzes.
- Practice inside the browser: live IDE with preview and AI design edits, simulated Linux terminal, Nginx lab, CTF challenges, Project Lab with AI review on 4 criteria.
- Career advice that reads pasted job links, plus job search across several boards with a fit score.

## Operating Context

- Main loop: Dashboard (streak calendar, next lesson, all technologies) → roadmap of a technology → lesson tabs (theory, code lab, quiz, exercise) with the tutor alongside.
- Daily study goal in minutes and a study-day streak drive return visits.
- Learners often use a laptop at home; phones are used too, so every screen must work at 375px.
- Light and dark mode, with a switch in the top bar.

## Capabilities and Constraints

- Stack: React 19 + TypeScript + Vite, Tailwind CSS v4 + shadcn/ui on Radix, react-router, TanStack Query; Express server; Supabase auth and data.
- All UI copy goes through `data/i18n.json` (8 languages); tests read Vietnamese strings from `web/src/test/ban-dich-vi.ts`.
- Each technology has a fixed brand color in `curriculum/index.json`; the five levels have fixed meaning and order.
- Free product: no pricing, plans or payment.

## Brand Commitments

- Name: DevMaster Hub. No logo file exists; the mark is drawn in code.
- Visual reference the owner made binding for the app (2026-10-17): the "Dei" learning-plan dashboard: soft pastel cards, generous rounding, a white main canvas, a connected learning path, colorful but easy on the eyes, gentle in feel.
- The owner rejected: looking "AI-made" (emoji as icons, purple-pink gradients), a stiff/hard look, and large near-black fills.

## Evidence on Hand

- Real content: 35 technologies, 361 lessons with theory, code samples, quizzes and exercises (`web/public/curriculum/`).
- No testimonials, user counts, press or partner logos exist; none may be invented.
- Social preview image: `web/public/assets/og-image.png`.

## Product Principles

- Progress is always visible: where you are on the path and the next step are never more than one glance away.
- Practice beats reading: every lesson leads to running, answering or building something.
- The AI helps you think, it does not think for you.
- Calm motivation: encouraging and colorful, never noisy or guilt-driven.

## Accessibility & Inclusion

- WCAG AA contrast in both light and dark mode; full keyboard use; screen-reader labels in the active language.
- Respect `prefers-reduced-motion` (the owner's own machine has it on, so reduced variants must still feel alive, not dead).
