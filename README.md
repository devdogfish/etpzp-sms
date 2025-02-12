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

## TODO

- Update the message display to look nicer and actually display stuff in the correct manner
- Sometimes this happens: Database query error error: duplicate key value violates unique constrain
  t "recipient_message_id_phone_key"

## If there is extra time (after deployment in school)

1. \*\* ** Do a test deployment ** \*\*

- Admin Dashboard with statistics
- Make sure you don't pass in undefined values into the database, you should always convert them to `null` instead

## Database

Deleting all tables

#### Deleting all tables

```sql
DROP TABLE IF EXISTS recipient, contact, message, public.user;
```

#### Seed files

On UNIX Operating system

```psql
\i ~/dev/etpzp-sms/lib/db/seeds/seed.sql
```

On Windows psql shell

```psql
\i /Users/Utilizador/dev/etpzp-sms/lib/db/seeds/seed.sql
```
