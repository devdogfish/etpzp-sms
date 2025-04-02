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
## In Progress
- Add meta data like tab image and title
- Change colors on pie chart to be more unique
- Fix mobile panel expanding sheet animation
⁃ Recipient chips are not aligned
- Add saved state to mobile new-message

### Project Regrets
- No uniform way to name functions or rules for type names
- No snippets for repetitive code
- Using safeParse instead of parse with zod causing error handling code to live in the try block which doesn't adhere to separation of concerns
- Not having clear/consistent naming conventions for schemas, and especially types 
- Not use all the features provided by i18next, and i18nexus with plural and translation branching
- No really uniform way to handle errors in server actions
- Repeating the scroll area calculation so often

### Latest Conversation
- For Domain name, we will use a dynamic IP service called No-IP. This is a program that you need to run on the server which will open a connection to their server. Their server will accept requests on that domain name, and will redirect that traffic to my server.

## Low Priority
- Medium Priority: Maybe add links to a the item you just modified/created in the success toast messages, so that the user can easily view more details
- Test the app for bugs
- Maybe add some shades of blue between the different columns, to show a hierarchy
- Maybe add links to the GatewayApi sign in to admin dashboard cards
- Consider adding some contact information to the message item in the list
- Maybe add the possibility to upload images for the contact
- Make sure you don't pass in undefined values into the database, you should always convert them to `null` instead
- Should I keep the option to change the sender? This would also influence the message-display component
  - If it's difficult, keep it as ETPZP for everyone. If easy, the admin could specify some select options that would be applied to all users.
- Auth cookie max-age setting for admins
- Option back up and restore database from admin panel

#### MESSAGE POLLING AND DELIVERY STATUSes:
- The database field `status` should always be true
  - Do message polling to update it conditionally. When?
    - Do it right after sending the message, and for scheduled set a timeout to fetch the status after it got sent
    - On User Login, check all the messages for confirmed_delivery flag.
  - Add delivery errors to individual recipients
  - Maybe add another field like was_scheduled or scheduled_send to show how the message was sent
- Have a 5-minute refresh timer for polling scheduled message delivery statuses in the root layout so that the amountIndicators also update
- Add error handling in toasts for buttons that interact with the api such as canceling scheduled messages

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