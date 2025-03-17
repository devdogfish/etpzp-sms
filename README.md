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

# TODO
1. For scheduled messages, it would be better to do polling WHEN THE USER LOGS IN because when our server is not running we might lose callbacks
  - Create a separate thread to get the delivery status while loading everything else
#### AFTER THAT - SCHEDULED PAGE:
- On new-message, fix the popup bugs, as well as functionality for the buttons in the select dropdown and the schedule now button.
- Make it so that the form doesn't get automatically submitted, the date should get chosen, and the submit button should change to schedule for...
  - Have a 5-minute refresh timer for polling scheduled message delivery statuses in the root layout so that the amountIndicators also update
- Make sure when the server components re-refetch because of revalidation, that the contexts update their state values with the newly fetched data!
- Add scrolling with a fixed header on message-display
- scheduled canceling doesn't work anymore + add error handling in toasts for buttons that interact with the api such as canceling scheduled messages
- save the sendtime in the context and keep the scheduled popup open when component re-renders 
- Failed page should have a retry sending button which will try to send the message again and update that exact message object instead of creating a new one.

## If there is extra time (after deployment in school)
- Make it so when recipients input is off focused the value of the input gets added as a recipient
- clear the url parameter when a message is sent successfully
- Fix styles for insert modal.
- Don't save invalid recipients to database (we don't want to suggest invalid ones) or filter them out on the frontend. These recipients belong to drafts so maybe update the query to search for recipients that are not in the drafts or just filter out the invalid ones using javascript
- Admin Dashboard with statistics and admin settings
  - Should I keep the option to change the sender? This would also influence the message-display component
  - If it's difficult, keep it as ETPZP for everyone. If easy, the admin could specify some select options that would be applied to all users.
- Make sure you don't pass in undefined values into the database, you should always convert them to `null` instead
- Test the app for bugs
- Maybe add links to a the item you just modified/created in the success toast messages, so that the user can easily view more details
- Maybe make it so that the insert-recipient-modal gets hidden and shown again after creating a new contact from there
- Maybe add the possibility to upload images for the contact
- Maybe add some shades of blue between the different columns, to show a hierarchy
- Consider adding some contact information to the message item in the list

## Important Commands
Deleting all tables
```sql
DROP TABLE IF EXISTS recipient, contact, message, public.user;
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