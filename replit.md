# VotersView Frontend

## Overview
An Angular 21 single-page application (SPA) frontend project named `votersview-fe`.

## Tech Stack
- **Framework**: Angular 21 (standalone components)
- **Language**: TypeScript (~5.9)
- **Package Manager**: npm
- **Build System**: Angular CLI (`@angular/build`)
- **Testing**: Vitest (unit tests via `ng test`)

## Project Structure
```
/
├── src/
│   ├── main.ts          # App bootstrap entry point
│   ├── styles.css       # Global styles
│   ├── index.html       # HTML shell
│   └── app/
│       ├── app.ts       # Root component
│       ├── app.html     # Root template
│       ├── app.css      # Root styles
│       ├── app.config.ts
│       └── app.routes.ts
├── public/              # Static assets
├── angular.json         # Angular CLI configuration
├── package.json
└── tsconfig*.json
```

## Development
- **Workflow**: "Start application" runs on port 5000
- **Command**: `NG_CLI_ANALYTICS=false ./node_modules/.bin/ng serve --host 0.0.0.0 --port 5000 --configuration development`
- **Host**: `0.0.0.0` (required for Replit proxy)
- **Analytics**: Disabled via `angular.json` CLI config and `NG_CLI_ANALYTICS=false` env var

## Deployment
- **Type**: Static site
- **Build command**: `npm run build`
- **Public directory**: `dist/votersview-fe/browser`

## Key Configuration
- `angular.json` — sets `allowedHosts: true`, `host: 0.0.0.0`, `port: 5000` for the dev server
- Analytics disabled in `angular.json` under `cli.analytics: false`
