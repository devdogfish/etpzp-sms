This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Packages

### i18Next for internationalization

> Disclaimer: This internationalization library changes the url path by injecting the language `local`, which might cause unexpected outcomes.

#### How to use

To use it in client components:

```tsx
"use client";
import { useTranslation } from "react-i18next";
// ...
    const { t } = useTranslation();
    return <h1>{t("sent_messages")}</h1>;
}
```

To use it in server components:

```tsx
import initTranslations from "@/app/i18n";
// ...
    // These are the namespaces, the first one is the default one.
    // In this case `Home` is the default namespace and it will look for the `sent_messages` key in the `Home` namespace.
    // If you want to access the `Common` namespace it would look like this: `t("sent_messages:Common")
    const i18nNamespaces = ["Home", "Common"];
    const { t } = useTranslation(i18nNamespaces);
    return <h1>{t("sent_messages")}</h1>;
}
```

### pg for connecting to postgres

#### Tips

1. If you want to use the functions above, make sure you are using it inside the **TranslationsProvider**:
2. When logging an object and it is logging `[object Object]`, `JSON.stringify()` actually logs the object
3. Actions are publicly accessible, for this reason, don't pass the user_id through params, the function should get the user's id itself on the server

```tsx
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // retrieve the current `locale` from the URL parameters
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    // Create translations provider - using i18n outside of this provider won't work
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
    // ...
```

2. The easiest way to retrieve the current `locale` from anywhere in the app is to read from the `NEXT_LOCALE` cookie.
3. Also you don't need to worry about integrating the locale every `href`, i18nNext does that automatically for you, but for SEO optimization it is better to integrate it into every href like the guy explains [here](https://youtu.be/J8tnD2BWY28?feature=shared&t=1696).
4. If you want to change the location of the `i18n.js` file, change the path in the `next.config.ts` file, as well as in the `i18nConfig.ts`
   Watch the [full tutorial](https://www.youtube.com/watch?v=J8tnD2BWY28)

### [Shadcn/ui](https://ui.shadcn.com/) library

> Disclaimer: - Don't overwrite any of the downloaded shadcn components, or else you will overwrite my changes.

- To see all my config related to shadcn take a look at `components.json`.
- I am using next-themes in combination with shadcn for theme mode as well as color themes both of which are stored in browser localstorage.
- Also I have a very interactive layout with multiple sidebars stored with related data stored in 2 different cookies. Furthermore I created a context holding the layout size data (see `use-layout.tsx`) for easy access from anywhere, including client components.

## File structure

I have 3 main layouts in my app directory, organized in [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups):

1. (main): Adds the navigation sidebar component to all pages. The only pages without this sidebar are going to be the auth related ones & admin dashboard pages. Inside (main) you can add any normal routes and if your page requires another sidebar just create a new layout in the your page's route directory.
2. (auth): Any authentication related pages will have a completely separate layout, without side- or nav-bars.
3. (admin-dashboard): The admin-dashboard will also have unique layout, as I want it to feel more separated & special from the app.

### lib

Inside the lib folder will be backend stuff. I will have server actions, as well as data-fetching files. These files follow the following folder structure:

```lib folder
lib/
  page1/
    data.ts
    actions.ts
  page2/
    data.ts
    actions.ts
  shared/
    actions/
      userActions.ts
      productActions.ts
    data/
      api.ts
      db.ts
```

I want to use the same structure for my components.

## TODO

1. \*\* ** Do a test deployment ** \*\*
2. Figure out invalid NextConfig and make sure the translation works properly. Default

- Ability to cancel scheduled SMSs
- Color setting for user's profile background as well as display name
- Update chart colors to look nice

## Final touches
- Translate the entire app
- Use global colors (not hardcoded colors) everywhere so that the all different theme settings look nice
- Revalidate `/` and recipients when adding a new contact on the new-message page
- Automatic drafting using `use-debounce` with a 2s cooldown on change of any fields with a saved or not state

## If there is extra time (after deployment in school)
- Save user preferences in DB and retrieve that to set the browser storage every once in a while.
- Admin Dashboard with statistics

## Database
Deleting all tables

#### Deleting all tables
```sql
DROP TABLE IF EXISTS recipient, contact, message, public.user;
```

#### Seed files
On UNIX Operating system
```psql
\i ~/dev/etpzp-sms/lib/db/migrations/seed.sql
```
On Windows psql shell
```psql
\i /Users/Utilizador/dev/etpzp-sms/lib/db/migrations/seed.sql
```
