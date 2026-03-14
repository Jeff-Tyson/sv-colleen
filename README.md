# S/V Colleen — 1984 Cambria 44

Showcase website for S/V Colleen (Hull #1), a 1984 Cambria 44 sailboat. Built with React, Express, Tailwind CSS, and shadcn/ui.

## Features

- **Home Page** — Full-width hero with vessel photo, key specifications, and highlighted features
- **Photo Gallery** — 30 listing photos in a responsive grid with lightbox viewer
- **Survey Tracker** — Interactive table with 41 marine survey findings, filterable by category/priority/status, with inline editing for task assignment, materials, and completion dates
- **Admin Access** — Role-based access control with access codes for admin and viewer roles

## Getting Started

```bash
npm install
npm run dev
```

The app runs on port 5000 with Express backend and Vite frontend.

## Access Codes

- Admin: `COLLEEN-ADMIN-2026`
- Viewer: `COLLEEN-VIEW-2026`

## Tech Stack

- React + TypeScript
- Express.js backend
- Tailwind CSS + shadcn/ui
- TanStack Query
- Wouter (hash routing)
- In-memory storage (swap with Supabase for persistence)

## Photos

Vessel photos are loaded from the Denison Yacht Sales listing. The `attached_assets/` directory (not committed) contains local copies.
