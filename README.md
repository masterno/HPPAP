# Holistic Pain Profile & Action Planner (HPPAP)

A modern, privacy-focused web app for holistic pain self-assessment, profiling, and action planning. HPPAP guides users through evidence-based sections to capture pain experience, identify patterns, set personal goals, and generate a summary report for self-management or sharing with healthcare providers.

## Features
- **Multi-Section Assessment:**
  - Pain Snapshot
  - Pain Patterns & Triggers
  - Impact on Daily Life
  - Emotional Well-being & Pain
  - Coping & Management Strategies
  - Personal Goals & Action Planning
- **Summary Report:** Auto-generated, shareable summary at the end
- **Modern UI:** Built with React and TypeScript
- **Local-First:** All data stays in your browser unless you export/share
- **AI Integration:** Gemini API support for enhanced insights (optional)

## Tech Stack
- React 19 + TypeScript
- Vite (development/build tooling)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)

### Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app locally:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or as shown in your terminal).

## Usage
- Complete each section of the assessment
- Review your personalized summary report
- Use the action planner to set and track goals

## Project Structure
- `App.tsx` — Main application logic and section flow
- `components/` — UI components and section forms
- `constants.ts`, `types.ts` — App data models and defaults
- `public/`, `index.html` — App entry point

## License
MIT (or your chosen license)

## Acknowledgments
- Inspired by holistic pain management frameworks and patient-centered care principles.
