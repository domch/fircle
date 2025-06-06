# fircle
Yet another app for friend circles!

This repository is organized as a Node.js monorepo. It currently contains two packages under `packages/`:

- **api**: an Express API with a `/health` endpoint
- **web**: a small utility module for the web client

## Development

Install dependencies and run tests for all packages:

```bash
npm install
npm test
```

You can start the API server with:

```bash
npm start --workspace=@fircle/api
```
