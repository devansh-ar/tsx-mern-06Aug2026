# Star Wars Character App

**Live Demo:** [https://astonishing-alpaca-32d99a.netlify.app](https://astonishing-alpaca-32d99a.netlify.app)

A React + TypeScript app to explore Star Wars characters using the [SWAPI](https://swapi.dev) public API.

## Features

- **Character grid** — paginated list of all SWAPI characters with Picsum random images
- **Species-based card colors** — each card's background reflects the character's species
- **Hover animations** — smooth lift + scale effect with image zoom on hover
- **Character modal** — click any card to view:
  - Name (modal header)
  - Height in meters, mass in kg
  - Birth year
  - Date added to the API (dd-MM-yyyy format)
  - Number of films the character appears in
  - Homeworld: name, terrain, climate, number of residents
- **Search** — partial or full character name search
- **Filters** — filter by species, homeworld, or film; fully combinable with search
- **Loading & error states** — animated spinner and retry button
- **JWT auth (mocked)** — login/logout UI with silent token refresh before expiry

## Screenshots

> Run the app locally and add screenshots here.

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Bundler | Vite |
| HTTP | Axios |
| Dates | date-fns |
| Testing | Vitest + Testing Library |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Running Tests

```bash
npm test
```

10 integration tests cover the character modal: name display, height in meters, mass in kg, birth year, film count, date formatting (dd-MM-yyyy), homeworld data, close via button, close via Escape key, and null character rendering.

## Demo Login

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `password123` |

The token expires after 5 minutes with a silent refresh scheduled 30 seconds before expiry.

## Deployment

Hosted on **Netlify**: [https://astonishing-alpaca-32d99a.netlify.app](https://astonishing-alpaca-32d99a.netlify.app)

- **Build command:** `npm run build`
- **Output directory:** `dist`
# tsx-mern-06Aug2026
