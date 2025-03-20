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
1. For scheduled messages, it would be better to do polling WHEN THE USER LOGS IN because when our server is not running we might lose callbacks
  - Create a separate thread to get the delivery status while loading everything else





- Add a alert warning dialog, if the user selects a date and it is in the past, when he clicks send. This should ask the user if he wants to continue, and if he does, the message will be sent now

- Don't save invalid recipients to database (we don't want to suggest invalid ones) or filter them out on the frontend. These recipients belong to drafts so maybe update the query to search for recipients that are not in the drafts or just filter out the invalid ones using javascript
- Create application Logo. Add meta data like tab image and title
- Implement DNS

#### SCHEDULED PAGE:
- !!IMPORTANT!!: Save the sendtime in the context and keep the scheduled popup open when component re-renders as well as schedule dropdown. Think about how I can prevent mis-clicks on the submit button with the intention to schedule the message (ask people for suggestions).
- Have a 5-minute refresh timer for polling scheduled message delivery statuses in the root layout so that the amountIndicators also update
- Add error handling in toasts for buttons that interact with the api such as canceling scheduled messages
- Ask gatewayApi support if they recommend to refetch for message status to make sure the message arrived or they never have any issues.

### ADMIN DASHBOARD
- ADMIN_DASHBOARD: Choose a period to filter results, see per user sms sending stats
- Admin Dashboard with statistics and admin settings
  - Should I keep the option to change the sender? This would also influence the message-display component
    - If it's difficult, keep it as ETPZP for everyone. If easy, the admin could specify some select options that would be applied to all users.

### Latest Conversation
- For Domain name, we will use a dynamic IP service called No-IP. This is a program that you need to run on the server which will open a connection to their server. Their server will accept requests on that domain name, and will redirect that traffic to my server. Since the connection is established from inside to outside of our network, it won't require any router traffic forwarding.

## Low Priority
- Medium Priority: Maybe add links to a the item you just modified/created in the success toast messages, so that the user can easily view more details
- Test the app for bugs
- Maybe add some shades of blue between the different columns, to show a hierarchy
- Consider adding some contact information to the message item in the list
- Maybe add the possibility to upload images for the contact
- Make sure you don't pass in undefined values into the database, you should always convert them to `null` instead

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