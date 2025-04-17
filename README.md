# miniastro

**miniastro** is a minimalist, opinionated, Astro starter template designed to get you building web applications quickly and efficiently using AI.

## Features

- **Framework:** [Astro](https://astro.build/) (Static Site Generation & Server-Side Rendering)
- **UI Library:** [React](https://react.dev/) (via Astro integration)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with `clsx` / `tailwind-merge` (`cn` utility)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** [SQLite](https://www.sqlite.org/index.html) (via `better-sqlite3`)
- **Authentication:** [better-auth](https://github.com/LucianGratian/better-auth) (Email/Password, Social - Google example included)
- **API Layer:** Type-safe client/server actions (inspired by tRPC)
- **State Management:** [React Query](https://tanstack.com/query/latest) (with persistence via `localStorage`)
- **Testing:** [vitest](https://vitest.dev/)
- **Deployment:** Configured for [Fly.io](https://fly.io/) (Dockerfile included)
- **Package Manager:** [pnpm](https://pnpm.io/)

## Getting Started

1.  **Install dependencies:**

    ```bash
    pnpm install
    ```

2.  **Set up environment variables:**

    - Copy `.env.example` to `.env` (if an example file exists) or create a `.env` file.
    - Define necessary variables, primarily `DATABASE_URL`. For local development, you can use:

      ```env
      DATABASE_URL=./local.db
      ```

    - Add any required credentials for authentication providers (e.g., Google OAuth).

3.  **Run database migrations:**

    - Migrations are automatically applied when starting the dev server.
    - To generate migrations after changing `src/schema.ts`: `pnpm drizzle generate`
    - To apply migrations manually: `pnpm drizzle migrate`

4.  **Start the development server:**

    ```bash
    pnpm dev
    ```

    The app will be available at `http://localhost:4321`.

## Key Commands

- `pnpm dev`: Starts the development server with hot reloading. Also runs database migrations.
- `pnpm build`: Builds the application for production.
- `pnpm check`: Runs linters (ESLint, Prettier) and type checking (TypeScript).
- `pnpm test`: Runs unit and integration tests using vitest.
- `pnpm drizzle generate`: Generates SQL migration files based on schema changes.
- `pnpm drizzle migrate`: Applies pending database migrations.
- `fly deploy`: Deploys the application to Fly.io (requires `flyctl` and setup).

## Project Structure

The project follows a feature-driven structure:

```
.
├── public/                 # Static assets
├── src/
│   ├── actions/            # Type-safe server actions (business logic)
│   ├── assets/             # Project-specific assets (images, svgs)
│   ├── components/         # Reusable React components (UI, pages)
│   ├── components/pages/   # Reusable React components (UI, pages)
│   ├── domain/             # Core domain logic and types
│   ├── layouts/            # Astro layout components
│   ├── lib/                # Shared utilities (auth, db client, utils)
│   ├── pages/              # Astro pages (routing)
│   ├── styles/             # Global CSS
│   ├── bin.ts              # Script for running migrations (used by `pnpm dev`)
│   ├── db.ts               # Drizzle client instance setup
│   ├── middleware.ts       # Astro middleware (e.g., authentication)
│   └── schema.ts           # Drizzle database schema definitions
├── astro.config.mjs        # Astro configuration
├── drizzle.config.ts       # Drizzle configuration
├── fly.toml                # Fly.io deployment configuration
└── ...                     # Other config files
```

Refer to `CONVENTIONS.md` for detailed guidelines on naming, code style, and structure.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request. Ensure your contributions adhere to the guidelines in `CONVENTIONS.md`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (or add an MIT license file if one doesn't exist).
