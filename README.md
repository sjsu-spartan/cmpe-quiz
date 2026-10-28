# CMPE Exam Quiz App v2

A modern, config-driven single-page quiz application for practicing CMPE graduate course exam questions:
- **CMPE 249: Intelligent Autonomous Systems** (AV Architecture, Sensor Fusion, R-CNN/YOLO, Metrics, ViT/DETR, Calibration)
- **CMPE 258: Deep Learning** (Backprop, Optimizers, CNN/ResNet, RNN/LSTM/GRU, Transformers)
- **CMPE 253: AI Threat Intelligence** (FGSM/PGD, DP-SGD, Membership Inference, RAG Poisoning, Fairness, Drift Detection, Risk Scoring)
- **CMPE 260: Reinforcement Learning** (Modules 9–17 · TRPO, PPO, DDPG, SAC, A3C)
- **CMPE 256: Recommender Systems** (CF, MF, Deep Learning, Fairness, Bandits)

Built with **React 19 + TypeScript + Vite**.

## Architecture

```
src/
├── components/     # UI components (Header, CourseSelection, ModeSelection, QuizScreen, etc.)
├── hooks/          # Custom React hooks (useConfig, useQuestions, useQuiz, useTimer, useTheme)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions (themes, markdown, shuffle, formatTime)
├── styles/         # CSS styles
├── App.tsx         # Main app component
└── main.tsx        # Entry point
data/               # JSON config + question/formula banks
guides/             # Markdown study guides per course
```

## Features

- **300+ total questions** — 100 questions per course, loaded dynamically from JSON
- **Interactive Quiz Modes** — Quick 10, Quick 25, Quick 50, All Questions, Custom Random
- **Tier-based filtering** — Practice by exam probability (Tier 1 / Tier 2 / Tier 3)
- **Instant feedback** — Correct/wrong color highlighting with detailed mathematical & conceptual explanations
- **LaTeX MathJax Rendering** — Full math equation support for loss formulas, tensor dimensions, and coordinate decoding
- **Formula sheets modal** — Quick access to key formulas (📐)
- **Study guides modal** — Built-in markdown notes and summaries (📖)
- **Dark/Light theme** — Persistent preference, respecting system settings
- **Timer tracking** — Real-time per-question and total elapsed timer
- **End-of-quiz review** — Filterable by all, correct, or incorrect answers
- **Mobile-friendly** — Responsive touch-friendly layout with viewport-fit cover

## Development

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview production build
```

## Deployment to GitHub Pages

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the app to GitHub Pages upon every push to `main`.
Additionally, the static production build can be served directly from the `gh-pages` branch.
