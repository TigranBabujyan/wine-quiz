# WineWise Quizzes

An AI-powered wine education and quiz platform. Test your knowledge across categories like Wine Varieties, Wine Regions, Winemaking Process, Food Pairing, and more — with multiple game modes and both AI-generated and offline question banks.

---

## Live Demo

> **Try the app here:** [wine-quiz-lqag.vercel.app](https://wine-quiz-lqag.vercel.app)

---

## Features

- **AI Mode** — quizzes generated on the fly by Google Gemini 2.5 Flash, unique every time
- **Local Mode** — fully offline question bank, no API key required
- **Single Player** — choose category, difficulty, number of questions, and timer
- **Multiplayer** — two-player turn-based quiz on one device
- **Arcade Mode** — rapid-fire questions, no timer pressure
- **Learning Mode** — AI explains why each answer is correct or wrong
- **Custom Quiz Generator** — paste any text and the AI builds a quiz from it

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)
- A Google Gemini API key _(optional — the app works without one in Local Mode)_

### Installation

```bash
git clone https://github.com/TigranBabujyan/wine-quize.git
cd wine-quize
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## Setting up your Gemini API Key

AI Mode requires a free Google Gemini API key.

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in and create an API key
3. **Copy** the key
4. On the WineWise home page, click the **Gemini logo button** — the key is read from your clipboard and saved automatically

The key is stored in a local `.env` file and never leaves your machine.

> **No key?** Select **Local Mode** in the quiz setup to play from the built-in question bank — no configuration needed.

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for AI-generated quizzes |

Create a `.env` file in the project root (or use the in-app button):

```
GEMINI_API_KEY=your_key_here
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| AI | Google Genkit + Gemini 2.5 Flash |
| UI | shadcn/ui + Tailwind CSS |
| Language | TypeScript |

---

## Author

**Tigran Babujyan**

- LinkedIn: [linkedin.com/in/tigran-babujyan](https://www.linkedin.com/in/tigran-babujyan/)
- GitHub: [github.com/TigranBabujyan](https://github.com/TigranBabujyan)
