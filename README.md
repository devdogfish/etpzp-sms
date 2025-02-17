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
1. Translate the entire app - look in actions/, search for toastActionResult(result) (without the translation function parameter)
2. Check if all the `revalidation` in actions is correctly placed and in working order
3. Edit the message.create to create a message by updating the existing draft by binding the function with the draftId
4. Add the correct date formatting for scheduled messages, and also display scheduled messages in a different way so that it is easier to tell when they will be sent
- Update the message display to look nicer and actually display stuff in the correct manner

## If there is extra time (after deployment in school)
1. \*\* ** Do a test deployment ** \*\*

- Admin Dashboard with statistics
- Make sure you don't pass in undefined values into the database, you should always convert them to `null` instead
- Test the app for bugs
- Consider replacing the suspense boundaries with loading.tsx Next.js file conventions for cleaner code IF in production the loading still doesn't work as it should

## Questions
- Do we want to clear settings localstorage on logout and should that be displayed immediately?
- Any advice on the colors? Should I add an empty profile color as default?
- Should I keep the reply-all button to only insert the recipients, or should it also insert sender subject and body?
- Should I keep the option to change the sender? This would also influence the message-display component
- Give the example of edit contact modal and the question is: how should I give feedback to the user, right now I am using both badges and toasts, but only toasting on success. Should it stay like this
- Add the correct date formatting for scheduled messages, and also display scheduled messages in a different way so that it is easier to tell when they will be sent. What should this look like

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
