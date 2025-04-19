This is a [Next.js](https://nextjs.org) project

## Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

TODO: 
- Write Pages explanations for all the pages
- Move documentation from here and DOCUMENTATION.md to the obsidian document.
- remove front-end console.logs
- Add installation and configuration section
- Find an alternative image to postgres:18-alpine with no critical vulnerabilities

## Important Commands
Deleting all tables
```sql
DROP TABLE IF EXISTS recipient, contact, message, public.user;
```
Simple messages query
```sql
SELECT COUNT(*) FROM message WHERE send_time >= CURRENT_DATE - INTERVAL '1 months' AND in_trash = false AND status NOT IN ('FAILED', 'DRAFTED');
```
### On MacOS/UNIX based system:
Seed the database
```shell
\i ~/dev/etpzp-sms/lib/db/seed.sql
```
Open Nginx config
```shell
code /opt/homebrew/etc/nginx/nginx.conf
```
### Windows
Seed the database
```shell
\i /Users/Utilizador/dev/etpzp-sms/lib/db/seed.sql
```