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
#### i18Next for internationalization
To use it in client components:
```tsx
"use client";
import { useTranslation } from "react-i18next";
// ...
    const { t } = useTranslation();
    return <h1>t("sent_messages")</h1>;
}
```
To use it in server components:
```tsx
import initTranslations from "@/app/i18n";
// ...
    const i18nNamespaces = ["Home", "Common"];;
    const { t } = useTranslation(a, b);
    return <h1>t("sent_messages")</h1>;
}
```
>Take note that this changing the language also changes the url, so be aware of that.
Watch the [full tutorial](https://www.youtube.com/watch?v=J8tnD2BWY28)
#### [Shadcn/ui](https://ui.shadcn.com/) for theming