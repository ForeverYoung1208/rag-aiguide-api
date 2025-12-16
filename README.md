# Project start

## AI AGENTS INSTRUCTIONS
Look at AI-AGENTS-INSTRUCTIONS.md for instructions for AI agents



## 1. Start app

```bash
$ docker compose up
```

## 2. Run DB migrations

```bash
$ docker compose exec api npm run migration:run
```

## 3. Deploy to AWS

See infra/README.md