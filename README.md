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

DO THIS NEXT: 2. Edit the message.create to create a message by updating the existing draft by binding the function with the draftId

0. Instead of calling revalidatePath("/"), create a function to for the amountIndicators to only refetch them. This will keep all the components from getting refreshed
1. Check if all the `revalidation` in actions is correctly placed and in working order
2. Add checks on /new-message to only save the draft if the message is not equal to a empty message in that case

- MESSAGE DISPLAY: Update the message display to look nicer and actually display stuff in the correct manner
  - All recipients should be shown, but most of them should be hidden with an arrow to expand them. And if possible, they should be ordered numerically.
- SCHEDULED PAGE: Add the correct date formatting for scheduled messages, and also display scheduled messages in a different way so that it is easier to tell when they will be sent. What should this look like
  - Created at xxxxx
  - Below that When it will be sent
  - in the message list, on each message item, have it be the sendTime
  - Have a 5-minute refresh timer for polling scheduled message delivery statuses in the root layout so that the amountIndicators also update
  - Display scheduled messages in a different way so that it is easier to tell when they will be sent
- SCHEDULED MESSAGES: - For scheduled messages, it would be better to do polling WHEN THE USER LOGS IN because when our server is not running we might loose callbacks
  - Create a separate thread to get the delivery status while loading everything else

## Bugs

- On `/new-message`, some times the default values don't get filled correctly.

## If there is extra time (after deployment in school)

1. \*\* ** Do a test deployment ** \*\*

- Admin Dashboard with statistics and admin settings
  - Should I keep the option to change the sender? This would also influence the message-display component
  - If it's difficult, keep it as ETPZP for everyone. If easy, the admin could specify some select options that would be applied to all users.
- Make sure you don't pass in undefined values into the database, you should always convert them to `null` instead
- Test the app for bugs
- Consider replacing the suspense boundaries with loading.tsx Next.js file conventions for cleaner code IF in production the loading still doesn't work as it should

## Database

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
