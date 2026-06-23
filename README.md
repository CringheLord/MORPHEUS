# MORPHEUS

MORPHEUS is a Laravel + React/Inertia web application for managing study cases, audit tasks, artifacts, questionnaires, and AI-assisted analysis through the Morpheus Agent.

## English

### Requirements

- PHP 8.3+
- Composer 2
- Node.js 22+ and npm
- SQLite, MySQL, or PostgreSQL

### Installation

Install the dependencies:

```bash
composer install
npm install
```

Create the environment file:

```bash
cp .env.example .env
php artisan key:generate
```

Configure the database in `.env`. Example with SQLite:

```env
DB_CONNECTION=sqlite
QUEUE_CONNECTION=database
SESSION_DRIVER=database
CACHE_STORE=database
```

Create the SQLite database file if needed:

```bash
touch database/database.sqlite
```

Configure the AI provider keys you want to use:

```env
OPENAI_API_KEY=
# or Azure OpenAI
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_URL=
AZURE_OPENAI_DEPLOYMENT=
```

### Database and seeders

Run the migrations:

```bash
php artisan migrate
```

The only required seed data is the evaluation pattern dataset, because it initializes the core content used by Morpheus audits:

```bash
php artisan db:seed --class=EvaluationPatternImportSeeder
```

If you also want demo/sample data, run all seeders:

```bash
php artisan migrate --seed
```

### Development

Open three terminals.

Terminal 1, Laravel backend:

```bash
php artisan serve
```

Terminal 2, Vite frontend:

```bash
npm run dev
```

Terminal 3, Morpheus queue worker:

```bash
php artisan queue:work database --queue=morpheus
```

The application is available by default at `http://127.0.0.1:8000`.

### Build and checks

```bash
npm run build
composer test
npm run lint:check
npm run types:check
```

### Notes

- Laravel queues use the database connection; keep the `morpheus` worker running while AI audits are processed.
- After changes to `.env`, config, or cache, run `php artisan optimize:clear`.
- In production, set `APP_ENV=production`, `APP_DEBUG=false`, configure a persistent database, and run the queue worker with a process manager.

---

## Italiano

MORPHEUS e' una web application Laravel + React/Inertia per gestire study case, task di audit, artefatti, questionari e analisi AI tramite il Morpheus Agent.

### Requisiti

- PHP 8.3+
- Composer 2
- Node.js 22+ e npm
- SQLite, MySQL o PostgreSQL

### Installazione

Installa le dipendenze:

```bash
composer install
npm install
```

Crea il file di configurazione:

```bash
cp .env.example .env
php artisan key:generate
```

Configura il database nel file `.env`. Esempio con SQLite:

```env
DB_CONNECTION=sqlite
QUEUE_CONNECTION=database
SESSION_DRIVER=database
CACHE_STORE=database
```

Crea il file database SQLite, se necessario:

```bash
touch database/database.sqlite
```

Configura anche le chiavi del provider AI che vuoi usare:

```env
OPENAI_API_KEY=
# oppure Azure OpenAI
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_URL=
AZURE_OPENAI_DEPLOYMENT=
```

### Database e seeders

Esegui le migrazioni:

```bash
php artisan migrate
```

L'unico seed davvero necessario e' quello degli evaluation pattern, perche' inizializza i contenuti fondamentali usati dagli audit Morpheus:

```bash
php artisan db:seed --class=EvaluationPatternImportSeeder
```

Se vuoi caricare anche dati demo/di esempio, esegui tutti i seeders:

```bash
php artisan migrate --seed
```

### Avvio in sviluppo

Apri tre terminali.

Terminale 1, backend Laravel:

```bash
php artisan serve
```

Terminale 2, frontend Vite:

```bash
npm run dev
```

Terminale 3, worker Morpheus:

```bash
php artisan queue:work database --queue=morpheus
```

L'applicazione sara' disponibile di default su `http://127.0.0.1:8000`.

### Build e controlli

```bash
npm run build
composer test
npm run lint:check
npm run types:check
```

### Note utili

- Il sistema usa le queue Laravel su database; il worker `morpheus` deve rimanere attivo durante le analisi AI.
- Dopo modifiche a `.env`, config o cache, puo' essere utile eseguire `php artisan optimize:clear`.
- In produzione ricordati di impostare `APP_ENV=production`, `APP_DEBUG=false`, configurare un database persistente e avviare il worker queue con un process manager.
