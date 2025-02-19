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

0. Instead of calling revalidatePath("/"), create a function to for the amountIndicators to only refetch them. This will keep all the components from getting refreshed
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

## Bugs

- Message schedule cancel doesn't work anymore
- Recipient suggestions is getting corrupted if there are less than a couple and we are adding contacts with the same phone number

## Questions

- Should I keep the reply-all button to only insert the recipients, or should it also insert sender subject and body?
  Yes have a button for all inputs but also add a button to delete all recipients at once on new-message-page

- Should I keep the option to change the sender? This would also influence the message-display component
  If it's difficult, keep it as ETPZP for everyone. If easy, the admin could specify some select options that would be applied to all users.

- Give the example of edit contact modal and the question is: how should I give feedback to the user, right now I am using both badges and toasts, but only toasting on success. Should it stay like this
  Should stay like this

- For scheduled messages, it would be better to do polling WHEN THE USER LOGS IN because if our server is not running we might loose callbacks

  - Create a separate thread to get the delivery status while loading everything else

- Add the correct date formatting for scheduled messages, and also display scheduled messages in a different way so that it is easier to tell when they will be sent. What should this look like

  - Created at xxxxx
  - Below that When it will be sent
  - in the message list, on each message item, have it be the sendTime
  - Have a 5-minute refresh timer for polling scheduled message delivery statuses in the root layout so that the amountIndicators also update

Message Display

- All recipients should be shown, but most of them should be hidden with an arrow to expand them. And if possible, they should be ordered numerically.

## Database

Deleting all tables

- Any advice on the colors? Should I add an empty profile color as default?

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
