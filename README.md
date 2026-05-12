# AquaLog

AquaLog is a browser-based aquarium management app for tracking tanks, water tests, livestock, maintenance, reminders, and backups. It runs entirely in the browser and stores data locally in `localStorage`, so it does not require a backend.

## Features

- Tank management with editable tank profiles
- Water test logging with trend charts and status badges
- Livestock tracking with a large built-in species catalog
- Bioload and size-based stocking management
- Search, filter, and selection tools for fish, shrimp, snails, crabs, corals, and plants
- Maintenance activity logging and reminders
- Local account sign-in and sign-up
- Export and import of all app data as JSON
- Responsive layout for desktop and mobile

## Livestock Database

AquaLog includes a built-in livestock catalog with hundreds of entries covering:

- Freshwater fish
- Shrimp
- Snails
- Crabs and crayfish
- Brackish species
- Saltwater fish and invertebrates
- Corals and aquarium plants

Each catalog entry can include:

- Common and scientific names
- Category and environment
- Adult size estimate
- Minimum recommended tank size
- Bioload score
- Size score
- Difficulty
- Temperament
- Social/group guidance
- Temperature and pH ranges
- Diet, zone, tags, and notes

## Stocking System

The livestock system uses two scores:

- `bioload score` to estimate waste production and filtration pressure
- `size score` to estimate adult size and long-term stocking pressure

The app combines those values into a stocking summary for each tank so you can quickly see whether the system is healthy, near the limit, or overstocked.

Important note:

- These scores are guidance tools, not aquarium science guarantees.
- Real stocking compatibility still depends on behavior, tank shape, aquascape, water quality, filtration, and husbandry.

## Newer Livestock Tools

The livestock page includes:

- Searchable species catalog
- Category, environment, difficulty, and suitability filters
- Tank-specific stocking summary
- Per-species care warnings
- Group-size guidance for social species
- Quick quantity increase/decrease controls
- Custom manual entry with user-defined scores
- Current-stock and alert panels

## File Overview

- [auth.html](./auth.html) - local sign-in and account creation
- [dashboard.html](./dashboard.html) - tank overview and activity snapshot
- [data.js](./data.js) - shared local data layer, catalog, and helper logic
- [livestock.html](./livestock.html) - livestock catalog and stocking manager
- [maintenance.html](./maintenance.html) - maintenance logs and reminders
- [nav.js](./nav.js) - navigation and toast helpers
- [settings.html](./settings.html) - user settings and data export/import
- [style.css](./style.css) - shared visual system and layout styles
- [tanks.html](./tanks.html) - tank creation and tank management
- [water-tests.html](./water-tests.html) - water test logging and trends

## Getting Started

1. Open the project folder in a browser-friendly local server or directly open `auth.html`.
2. Create a local account or sign in.
3. Add at least one tank.
4. Start logging water tests, livestock, and maintenance.

The app does not depend on an external API or database.

## Data Storage

All data is saved locally in the browser using keys such as:

- `aqualog_user`
- `aqualog_users`
- `aqualog_tanks`
- `aqualog_tests`
- `aqualog_logs`
- `aqualog_livestock`
- `aqualog_reminders`

Because storage is local:

- Clearing browser storage will delete your data
- Export backups before switching browsers or devices
- Imports replace the stored data sets present in the JSON file

## Import And Export

Use `Settings` to:

- Export all data to a JSON backup file
- Import a previous AquaLog backup
- Clear all local data if needed

## Typical Workflow

1. Create a tank.
2. Log water parameters.
3. Add livestock from the catalog.
4. Watch stocking status and care warnings.
5. Log maintenance and set reminders.

## Browser Notes

- Best used in a modern Chromium, Firefox, or Safari browser.
- JavaScript must be enabled.
- Since data is local, the app is best treated as a single-device or manually backed-up tool.

## Limitations

- No cloud sync
- No server-side authentication
- No shared multi-user database
- Catalog scores are approximate and should not replace husbandry judgment

## Development Notes

The app is built with plain HTML, CSS, and JavaScript. There is no framework build step.

If you edit the livestock catalog or stocking rules, the shared logic lives in `data.js`, and the livestock UI lives in `livestock.html`.

## License

No license file is currently included. Add one if you want to publish or redistribute AquaLog.
