# Fircles Monorepo

This repository contains the code for **Fircles** – a social friend circles app for sharing items. The project is organised as a [TurboRepo](https://turbo.build/) monorepo with the following packages:

- **apps/web** – Next.js 14 frontend using React, Tailwind CSS and Zustand
- **apps/api** – NestJS backend using Prisma ORM and PostgreSQL
- **packages/types** – shared TypeScript models

## Development

Install dependencies for all workspaces and run the build pipeline:

```bash
npm install
npm run build
```

Run tests across all packages:

```bash
npm test
```

Each package can also be started individually using the scripts defined in its `package.json`.
