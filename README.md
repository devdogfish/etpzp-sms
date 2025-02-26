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

#### UP NEXT - MESSAGE DISPLAY:

- Add a new-message-page skeleton
- Make sure when the server components re-refetch because of revalidation, that the contexts update their state values with the newly fetched data!

Latest conversation

- maybe add the possibility to upload images for the contact,
- Maybe add some shades of blue between the different columns, to show a hierarchy
- Move all messages where an gateway Api error got returned, to **Failed** page, and add an error code so that the user can ask for tech support/help and they can research the error code then.
- Add badges for message cards only in trash, as sent, scheduled, and failed will always only have that exact type of message and that would leave the user looking through all the messages, if there is one that isn't of that type.
- Consider adding some contact information to the message item

## Bugs

- When sending a new message, subject and body don't get cleared
- When adding all suggested and then typing a custom phone number, it says duplicate recipients even though the number is unique

#### AFTER THAT - SCHEDULED PAGE:

- Add the correct date formatting for scheduled messages, and also display scheduled messages in a different way so that it is easier to tell when they will be sent. What should this look like
  - Created at xxxxx
  - Below that When it will be sent
  - in the message list, on each message item, have it be the sendTime
  - Have a 5-minute refresh timer for polling scheduled message delivery statuses in the root layout so that the amountIndicators also update
  - Display scheduled messages in a different way so that it is easier to tell when they will be sent
- SCHEDULED MESSAGES: - For scheduled messages, it would be better to do polling WHEN THE USER LOGS IN because when our server is not running we might lose callbacks
  - Create a separate thread to get the delivery status while loading everything else
- Implement `TODO` comments

## If there is extra time (after deployment in school)

1. \*\* ** Do a test deployment ** \*\*

- Admin Dashboard with statistics and admin settings
  - Should I keep the option to change the sender? This would also influence the message-display component
  - If it's difficult, keep it as ETPZP for everyone. If easy, the admin could specify some select options that would be applied to all users.
- Make sure you don't pass in undefined values into the database, you should always convert them to `null` instead
- Test the app for bugs
- Consideration: Add links to a the item you just modified/created and display them in the success toast messages, so that the user can easily view more details

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
