## ACKNOWLEDGMENTS
## TABLE OF CONTENTS
#### [[#ACKNOWLEDGMENTS]]
#### [[#TABLE OF CONTENTS]]
#### [[#INTRODUCTION]]
#### [[#TOOLS USED]]
- [[#Applications & external services]]
- [[#Dependencies]]
- [[#Typescript]]
#### [[#FILE STRUCTURE]]
- [[#Next.js file based routing]]
- [[#`/app` directory]]
- [[#`/lib` directory]]
- [[#`/components` directory]]
- [[#`/` directory (config files)]]
#### [[#FRONT-END]]
- [[#Styling]]
- [[#ShadCN with dynamic themes]]
- [[#React resizable panels]]
#### [[#PAGES]]
- [[#Login (`/login`)]]
- [[#New message (`/new-message`)]]
- [[#Settings (`/settings`)]]
- [[#Admin dashboard (`/dashboard`)]]
- [[#Other pages]]
#### [[#RULES FOR CONSISTENCY]]
- [[#Use of server actions]]
- [[#Form setup]]
- [[#Conservative data fetching]]
#### [[#DATABASE]]
- [[#Connecting to the database]]
- [[#Database schema]]
#### [[#AUTHENTICATION & AUTHORIZATION]]
- [[#Active Directory]]
- [[#Active Directory implementation]]
- [[#Session management]]
- [[#Session management implementation]]
- [[#Authentication flow]]
#### [[#INTERNATIONALIZATION (i18n)]]
- [[#Implementation]]
- [[#i18nexus]]
- [[#i18nexus integration]]
#### [[#SELF-HOSTING & DEPLOYMENT]]
- [[#Docker]]
- [[#`Dockerfile` explained]]
- [[#`docker-compose.yaml` explained]]
- [[#No-IP & port forwarding]]
- [[#Nginx]]
#### [[#CONCLUSION]]
- [[#Regrets]]
- [[#Omitted features]]
#### [[#ATTACHMENT I - USER MANUAL]]
- [[#Getting started]]
- [[#Github]]
- [[#Working in a development environment]]
- [[#Working in a production environment (deployment)]]
- [[#Debugging Docker]]
- [[#Working with i18nexus]]
#### [[#ATTACHMENT II - LOGIN CREDENTIALS]]
#### [[#ATTACHMENT III - CODE FILES]]
## INTRODUCTION
This application was created to replace the high cost of text messages for the school, providing a quick, easy, and low-cost communication solution via SMS. Being on the web made it accessible to everyone, regardless of their operating system.

The app allowed users to send messages to multiple recipients, schedule sends for future delivery, cancel scheduled messages, and manage sent messages through a user-friendly interface inspired by email clients. Authentication was done locally using the school's local Active Directory (AD) server.

It was built with Next.js (with the app router), utilizing a Postgres database, ShadCN components, and other packages. SMS sending was made possible through gatewayApi's REST API. During deployment, the app was run on a school computer in a Docker container, with the router forwarding traffic to its exposed port.

>**Tip**: Use the **Find feature** for easier navigation in this PDF. You can access it by pressing `Ctrl + F` (on Windows) or `Command + F` (on macOS), or by using the `/` shortcut in most applications.
## TOOLS USED
#### Applications & external services
- [**Visual Studio Code (VSCode)**](https://code.visualstudio.com/): Integrated Development Environment (IDE) used for writing all the code of project. On top of it, the following plugins were used:
	- **JavaScript EJS Support**: Provides support for EJS (Embedded JavaScript) templates in Visual Studio Code.
	- **Prettier - Code formatter**: An opinionated code formatter that supports many languages and integrates with VSCode.
	- **ESLint**: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, helping to maintain code quality.
	- **ES7 React/Redux/React-Native snippets**: Provides JavaScript and React snippets for faster development.
	- **Auto Import**: Automatically finds and imports React components, functions, and other modules in your code.
	- **Multi Cursor Case Preserve**: Preserves the case of text when using multi-cursor editing in VSCode.
	- **Pretty TypeScript Errors**: Enhances TypeScript error messages to be more readable and informative.
	- **VSCode Icons**: Adds icons to files and folders in the VSCode explorer for better visual organization.
	- **Docker**: Provides support for developing and managing Docker containers directly within VSCode.
	- **Code Spell Checker**: A basic spell checker that works well with code and comments, helping to catch typos.
	- **Tailwind CSS IntelliSense**: Provides intelligent suggestions and autocompletion for Tailwind CSS classes in your code.
- [**Gateway API's REST API**](https://gatewayapi.com/docs/apis/rest/): Used for sending, scheduling, and canceling scheduled SMS messages and getting statistics on sent SMSs.
- **PostgreSQL**: Relational database management system used for storing and managing application data.
	- On macOS, [Postgres.app](https://postgresapp.com/) was used
	- On Windows, [PostgreSQL](https://www.postgresql.org/download/) was downloaded from the official website
- [**Figma**](https://www.figma.com/downloads/): Design program used for creating app design prototypes, wireframes, and brainstorming user interfaces.
- [**Obsidian**](https://obsidian.md/download): Markdown-based note-taking application used for writing the reports as well as taking notes throughout the project.
- [**Microsoft Word**](https://www.microsoft.com/en-us/microsoft-365/download-office#download): Word processing software used for formatting and finalizing the reports.
- [**Git**](https://git-scm.com/downloads): Version control system used tracking code changes over time. If you are on a UNIX based operating system, this is already pre-installed. On Windows however, it needs to be installed separately
- [**GitHub**](https://github.com/): Web-based platform for hosting and collaborating on Git repositories, used to synchronize code between different devices.
- [**Bun**](https://bun.sh/): Package manager used for installing project dependencies and ShadCN components
- [**Docker**](https://www.docker.com/get-started/): Containerization platform used for creating, deploying, and managing applications in isolated environments.
- [**Nginx**](https://nginx.org/en/download.html): High-performance web server and reverse proxy server used for serving web applications and handling load balancing.
- [**dbdiagram.io**](https://dbdiagram.io/home): Web-based database diagrams generator used for visualizing database schemas.
- [**ChatGPT**](https://duck.ai): AI language model used on a web-based interface to help find and fix code errors.
- [**DeepL**](https://www.deepl.com/pt-PT/translator): AI-powered translation tool used on web-based interface for translating reports to Portuguese.
On macOS, the applications were installed using [homebrew](https://brew.sh/) if the respective cask was available.
#### Dependencies
**Dependencies**
- `@hookform/resolvers`: Resolver integration for react-hook-form.
- `@radix-ui/react-*@^1`: Accessible, customizable, and unstyled UI components.
- `@svgr/webpack`: Transform SVGs into React components.
- `activedirectory2`: Active Directory client library.
- `class-variance-authority`: Utility for managing CSS class names.
- `clsx@^2`: Utility for conditionally applying CSS class names.
- `cmdk`: Accessible command menu component.
- `date-fns@^4`: Comprehensive date utility library.
- `i18next@^24`: Internationalization framework for browser and Node.js.
- `i18next-resources-to-backend`: Backend adapter for i18next.
- `iron-session@^8`: Secure session management for Next.js applications.
- `libphonenumber-js`: JavaScript library for parsing, formatting, and validating phone numbers.
- `lucide-react`: React icons library.
- `next-i18n-router`: Internationalized routing for Next.js.
- `next-themes`: Theming support for Next.js.
- `next@15`: React framework for building server-rendered applications.
- `node`: JavaScript runtime.
- `pg`: PostgreSQL client for Node.js.
- `react-day-picker`: Accessible date picker component.
- `react-hook-form@^7`: Performant and extensible forms with easy validation.
- `react-i18next`: Internationalization for React.
- `react-loading-skeleton`: Skeleton loaders for React.
- `react-resizable-panels`: Resizable panel layout for React.
- `react@19`: JavaScript library for building user interfaces.
- `recharts@^2`: Composable charting library built on React components.
- `sonner`: Notification system for React.
- `tailwind-merge`: Utility for merging Tailwind CSS classes.
- `tailwindcss-animate`: Utility for adding animations to Tailwind CSS classes.
- `zod@^3`: Typescript-first schema validation with static type inference.

**Dev dependencies**
- `typescript@^5`: Superset of JavaScript that adds optional static typing.
- `tailwindcss@^3`: Utility-first CSS framework for rapidly building custom designs.
- `eslint@^8`: Pluggable JavaScript linter.
- `postcss@^8`: Tool for transforming CSS with JavaScript.
- `@types/react@19`: TypeScript definitions for React.
- `@types/node@^20`: TypeScript definitions for Node.js.
- `eslint-config-next@15`: ESLint configuration for Next.js projects.
- `@types/react-dom@19`: TypeScript definitions for React DOM.
- `@types/validator@^13`: TypeScript definitions for the validator.js library.
- `i18nexus-cli@^3`: CLI tool for managing i18n resources.

A list of all the dependencies their exact versions is in the `package.json` file located in `/`.
#### Typescript
TypeScript is a superset of JavaScript that adds [static typing](https://www.scaler.com/topics/typescript/static-typing-vs-dynamic-typing/), helping developers catch errors early and improve code quality. It enhances the development experience with features like autocompletion and type inference, making it ideal for this project.

Typescript was barely altered, but a couple of rules were modified. The settings could be viewed and modified in the `tsconfig.json` located in `/`.

During build time, the following command was useful. It utilized the typescript compiler to scan the entire project for type errors, which needed to be fixed to run a build.
```bash
tsc --noEmit
```
For more information on TypeScript, the official [docs](https://www.typescriptlang.org/docs/) were referenced. For its use in the context of Next.js, [these docs](https://nextjs.org/docs/pages/api-reference/config/typescript) were referenced.
## FILE STRUCTURE
A lot of the existing file structure was chosen because it was either mandatory in Next.js or a common convention. As a disclaimer, many people put `/lib`, `/components`, `/contexts`, and `/hooks` inside the `/app` directory. However, to keep the app directory as clean as possible, these directories were to placed outside.

Here is an overview of the project file structure:
- `/app/` held all the pages and styles of the app, as well as fonts and an internationalization function for loading translations server-side.
- `/components/` held all the React components.
- `/contexts/` held all the React contexts.
- `/hooks/` held all the custom React hooks.
- `/lib/` held all utility functions, `zod` schemas, and most of the server-side code.
- `/locales/` held all the i18next translations.
- `/node_modules/` held all the node modules (this folder is intended to remain unchanged).
- `/public/` was a Next.js file convention that held all the static assets like images and icons.
- `/types/` held all the TypeScript types.
- `/` held all the configuration files.
- `/.next` was a hidden folder that got generated by Next.js whenever a build or dev server was spun up.
- `/.vscode`: is specific to Visual Studio Code, the IDE used for the project and it contained some workspace settings for a spellchecker plugin.`
#### Next.js file based routing
In the following sub-chapter on the app directory, there will be mentioned numerous Next.js file conventions with links to the Next.js documentation. However, the basics and the reasons for the chosen file structure will be explained here.
- Next.js folder conventions:
    - Directories wrapped in **square brackets** like `/app/[locale]` represented dynamic route segments that allowed the pages and components inside to retrieve their values. All pages were located within `/app/[locale]`, as the entire app required access to the current language for internationalization to function.
    - Directories wrapped in **round brackets** like `/app/(root)` served as route groups that were invisible to the end user. They functioned like normal directories to group different pages together. In this project, they were utilized to group pages with the same layout, ensuring that the `layout.tsx` in that directory applied to all other pages **without creating an actual route segment** like `etpzp-sms.com/(root)`.
    - Directories with **standard names** containing a `page.tsx` represented the names of the route segments. For example, `/app/contacts/page.tsx` was accessible at `etpzp-sms.com/contacts`.
    - Directories starting with an **underscore** indicated disabled routes (not accessible to the end user). They functioned like code comments. In this project, `/_seed/page.tsx` was used solely during development.
- Next.js file conventions:
    - `page.tsx` files represented pages accessible by the name of the directory above.
    - `layout.tsx` files served as layouts applied to all pages in the same directory and nested directories.
    - `loading.tsx` utilized React Suspense behind the scenes to display a fallback UI while the page was loading.
    - `error.tsx` files implemented error boundaries that caught unexpected errors in the same directory, handling unexpected errors by providing a fallback UI.
    - `not-found.tsx` was displayed whenever a 404 error occurred.
A couple of these features weren't necessary but significantly improved user experience, which was why they were chosen.
#### `/app` directory
![[Screenshot 2025-04-16 at 21.24.32.png]]
- `/app/favicon.ico` ([Next.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png)): Image file to set the app icon in the browser tab
- `/app/globals.css`: CSS file for globally used css variables
- `/app/i18n.js` (i18next file convention): i18next config file for loading translations server-side. Holds the code from this [tutorial](https://i18nexus.com/tutorials/nextjs/react-i18next)
- `/app/layout.tsx` ([Next.js file convention](https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-layout)): Root layout of the app
- `/app/not-found.tsx` ([Next.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)): Global 404 not found page
- `/app/scattered-profiles.module.css`: CSS modules used in `message-display.tsx` component
- `/app/[locale]` ([Next.js file convention](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)): Dynamic route segment for the current language
	- `/app/[locale]/(root)` ([Next.js file convention](https://nextjs.org/docs/app/building-your-application/routing/route-groups)): Route group for pages that use the resizable nav-panel (see `/app/[locale]/(root)/layout.tsx`).
		- `/app/[locale]/(root)/(message-layout)` ([Next.js file convention](https://nextjs.org/docs/app/building-your-application/routing/route-groups)): Route group for similar pages that used the same translations and needed access to the contacts (see `/app/[locale]/(root)/(message-layout)/layout.tsx`), sharing the same error page. As of now, all these pages used the **three-column-layout** of resizable panels.
		- `/app/[locale]/(root)/(other)` ([Next.js file convention](https://nextjs.org/docs/app/building-your-application/routing/route-groups)): Route group for special pages that **didn't** share the same characteristics. Since this directory didn't have a layout, the files adhered to the layout above (see `/app/[locale]/(root)/layout.tsx`).
- `/app/fonts`: Directory for local fonts, imported in the root layout (`/app/layout.tsx`). For information on local fonts, the Next.js [docs](https://nextjs.org/docs/app/getting-started/images-and-fonts#local-fonts) were referenced.
All of the normal directories not mentioned here are pages, which will be explained in the next chapter.
#### `/lib` directory
![[file_structure-lib.png]]
The `lib` folder stored reusable utility functions, and most server-side code. This includes the database seed file and fetching functions, authentication configuration, auth server actions, and server actions for mutating data and making API calls, shared across different components and pages. Although the authentication code contained server actions, it was placed in its own directory (`/lib/auth`) to separate the topic and keep the actions directory (`/lib/actions`) less cluttered.
- `/lib/`:
	- `form.schemas` for `zod` schemas
	- `theme.colors` for Tailwind and Next.js theme configuration
	- `utils.ts` for utility functions usable anywhere
- `/lib/actions` contained server actions and a testing directory for development testing purposes to simulate API calls.
- `/lib/auth` contained authentication code and a directory called `activedirectory`, which included functions wrapping around the `activedirectory2` package.
- `/lib/db` contained a file to seed the database (`/lib/db/seed.sql`) with the initial database schema, database fetching functions, and a Dockerfile for seeding the Postgres database run inside the Docker container during production.
#### `/components` directory
This directory held all the React components organized into subdirectories and the ShadCN components.
- `/components/admin-dashboard`: Held components used on the admin dashboard and were put into a separate directory to separate the topic
- `/components/modals`: Held the modal/popup components and were put into a separate directory to separate the topic
- `/components/shared`: Held shared components that were very commonly used
- `/components/ui`: Held ShadCN components: The files inside remained mostly unchanged, except for small color adjustments, which involved substituting hardcoded colors with CSS variables.
#### `/` directory (config files)
- [`components.json`](https://ui.ShadCN.com/docs/components-json) was used for ShadCN configuration to add components in the same style whenever a new one was added from the CLI.
- `tsconfig.json` was the TypeScript configuration file.
- `tailwind.config.ts` was for Tailwind CSS.
- `.dockerignore` was utilized to specify files to ignore during Docker deployments.
- `.env` was the environment variable file.
- `.env.docker` was the Docker-specific environment variable file.
- `.env.example` served as an example of environment variables.
- `eslintrc.json` was the ESLint configuration file.
- `.gitignore` was used to specify files to ignore in Git.
- `.prettierignore` was utilized to specify files to ignore in Prettier.
- `.bun.lock` was the lock file for the Bun package manager.
- `docker-compose.yaml` was used for Docker Compose configuration.
- `Dockerfile` was the file for building Docker images.
- `eslint.config.mjs` was the configuration file for ESLint in module format.
- `global.config.ts` was used for global configuration settings; it was added for JavaScript constants used in multiple components.
- `118n.config.ts` was the configuration file for internationalization.
- `middleware.ts` was used for middleware functions.
- `next.config.ts` was the configuration file for Next.js with three modifications:
    - `output: standalone` was used to optimize the size of the build, filtering out unnecessary files.
    - `compress: false` was set for compression settings.
    - A `webpack` configuration was added to load local SVGs for dynamic styling.
- `nginx.conf` was the configuration file for Nginx.
- `package.json` was the file for managing project dependencies.
- `README.md` was the documentation file.
- `postcss.config.mjs` was included for PostCSS configuration and was not modified.
- `next-env.d.ts` was the TypeScript definition file for Next.js and was not modified.
## FRONT-END
#### Styling
In addition to the pre-styled ShadCN components, Tailwind CSS—a utility-first CSS framework that allowed for rapid UI development—was utilized alongside standard CSS. Inline styles were also used in some cases, particularly because dynamically generated Tailwind classes, such as `bg-${chosenColor}`, would not work due to Tailwind purging unused classes in production and not recognizing dynamically created class names.
- **Standard CSS**
    - `globals.css` contained globally used CSS classes and CSS variables.
    - `scattered-profiles.module.css` were CSS modules used on the message display panel on the message visualization pages. More information was provided in the "PAGES" chapter.
- **TailwindCSS** was used throughout the project. It served as the primary source of truth, and it was recommended to use Tailwind whenever possible.
- **Inline-CSS** was used minimally in cases where no other choice existed, or where the styling was very specific and would be overridden if done using standard CSS.
#### ShadCN with dynamic themes
ShadCN is a UI component library designed for building modern web applications with customizable themes and a focus on user experience.
1. **Initialize Project**:
    - A new Next.js project with Shad CN UI was created.
2. **Install Dependencies**:
    - `next-themes` was installed for light/dark mode toggle.
    - `Lucide React` was installed for icons.
    - Tailwind and Prettier VSCode plugins were added for formatting.
3. **Setup Global CSS** (`/app/globals.css`):
    - CSS variables from Shad CN UI's themes page were copied into the Global CSS file.
4. **Define Theme Colors** (`theme.colors.ts`):
    - An interface for theme colors was created, and available colors were set up based on Shad CN UI's themes.
5. **Convert CSS Variables** (`/lib/theme.colors.ts`):
    - Shad CN UI's theme color CSS variables were converted into a JavaScript object.
6. **Create Theme Function** (`/lib/theme.colors.ts`):
    - A function was developed to override global CSS variables for real-time theme color changes.
7. **Theme Data Context and Provider** (`theme-data-provider.tsx`):
    - A state was implemented to prevent flickering between default and saved colors on initial load.
    - A helper function was exported to access theme context throughout the component tree.
    - A Theme Data Provider component was created to manage theme state and local storage.
8. **Wrap with Next Theme Provider** (`theme-data-provider.tsx`):
    - The Theme Data Provider was encapsulated inside a Next Theme Provider in the top-level layout.

With the basic configuration in place, a button was created to toggle between light and dark modes, linking it to the `setTheme` function. A dropdown menu for selecting theme colors was developed, using the defined colors from the themes.

More info on these front-end-setting changers could be found on the settings page in the "PAGES" chapter.
#### React resizable panels
This library was for React components for resizable panel groups/layouts. It was used to achieve a layout with 2 or 3 horizontal panels, and it was chosen for its ease of use and nice integration with ShadCN.

Calculations for persisting the sizes of different columns were difficult but necessary. It was done by storing the percentage contribution of each column as an array in the cookies and retrieving it in the root layout to pass it to the components. The most-left panel of the 3 was the hardest to configure as it also had the functionality to collapse when a certain width was reached.

Relevant custom components included:
- `resizable-panel-wrapper`, which wrapped all the `ResizablePanel` ShadCN components, was only used once in the `app-layout.tsx` component.
- `children-panel` handled its sizing logic itself and was used in almost all pages that utilized the multiple panel-based layout.

There was also the option to do a 2-column layout without resizable panels, but it wanted to take on the challenge of this unique layout, which was rarely seen on the web.
## PAGES
Here are all the pages explained in detail.
#### Login (`/login`)
The login page was easy and fast to implement. It was placed outside the main layout groups but inside the `/app/[locale]/`, which was necessary for it to have the current locale.

The page contained a simple form handled mainly by one component (`/components/login-form.tsx`). It used the ShadCN card component and included 2 fields: one for the email and the other for the password. The password input contained a button to toggle its type between "text" and "password," providing the classic behavior of show password buttons in web forms.

**Form submission on client**  
Since redirecting on success from the server side caused issues, it was decided to use client-side router redirection, leading to the implementation of "Scenario 2" found in the "Form setup" section of the "RULES FOR CONSISTENCY" chapter. It first displayed errors through toasts. Then, if the server response was successful, it synchronized the local storage with the user's database settings and redirected programmatically to `/`. It also maintained a pending state to disable elements during submission.

**Form submission on server**  
The form called the `login` server action (`/lib/auth/index.ts`), the logic of which was explained in the "Authentication flow" section of the "AUTHENTICATION & AUTHORIZATION" chapter.
#### New message (`/new-message`)
The new message page was by far the most complicated page to build. It could be navigated to by clicking on the big primary colored button in the left sidebar. The form itself on the page was handled in `/components/new-message-form.tsx` and `/components/recipients-input.tsx`. However, the main logic and states were stored in a dedicated context in `/contexts/use-new-message.tsx` for separations. 

The new-message-form consisted of four main visible fields:
- Sender field: Static disabled field which was hardcoded to be "ETPZP".
- Recipients field: complex custom input component.
- Subject field: this field also changed the title when it changed.
- Message field: Text area used to hold the content of the message.
The page also contained some other buttons:
- **Save draft** button was used for displaying the current state of the draft (saved or not with related errors in the tooltip) and it also allowed the user to save the draft manually.
- **Fullscreen** available on desktop allowed the user to hide other elements around the page.
- **Close** was a link to `/sent`.
- **Discard** (at the bottom left) was a link to `/sent` which also deleted the draft when clicked.
- **Send** (at the bottom right) displayed if the message was scheduled or to be sent now and submitted the form. It also had a little menu on the side that allowed the user to schedule the send of the message.

**Form submission on client**
It adhered to "Scenario 2" found in the "Form setup" section in the "RULES FOR CONSISTENCY" chapter. The entire client-side validation and the error displaying from the server were handled in the `handleSubmit` function with toasts for error messages. The server returned various flags, translation strings, and data that decided on how the errors were displayed and translated on the front-end. In the case of `zod` errors, the errors were looped over and displayed as separate toast messages. Each input also had certain animations like red blinking or just a red underline or red placeholder built into them to show users what caused the error. It also keeps a pending state to disable elements during form submission.

**Form submission on server**
There existed one server action for sending messages called `sendMessage` located in `lib/actions/message.create.ts`. The function first did a couple of security checks which exited the function early when they failed:

- User authentication was checked (line 22 - 30)
- Field validation was handled using `zod` (line 32 - 48)
- More in-depth custom validation was done for recipients (line 50 - 60 & line 259 - 276)
- Moving on, the data was prepared for the API call, and the API was called using fetch (line 62 - 100).
- After that, the database logic began.
    - One main check was done to see if the message had already been saved to the database as a draft, in which case the draft was updated (line 103 - 157). On the contrary, a new message was inserted (158 - 200). As much information about the message was saved, including API errors if they existed.
    - After inserting the message, the recipients were handled separately (202 - 225). Any old existing recipients were first deleted, and then new ones were inserted.
- Responses were sent back to the client with case-specific translation strings, which were translated on the client-side (line 228 - 257).

**Custom recipients input** 
The component in `/components/recipients-input.tsx` was more than just an input, it was a custom component. As a first functionality, it allowed the user to type in any string and press enter or tab to add it as a new recipient. The system then early on did some client-side validation to detect what could be wrong with the number.

As a second big feature, a window appeared when the user started typing, showing recipients that they could insert. This absolutely positioned custom element behaved the following way:
- It was not even displayed if there were no existing recipients or contacts.
- If the input was empty but focused, the window contained "recommended recipients" which were calculated based on usage in the last week, as well as if they were saved as contacts or not. If there were not enough recipients that were used in messages, the rest was filled with unused contacts if they existed.
- If the input was not empty and focused, the window contained the "search results" which were the filtered out recipients and contacts based that contained the value the user put in the input.
- The user could add these shown recipients/contacts by from their keyboard by navigating with up and down arrows and insert them using enter or tab. Or they could just click on the recipient of their choice.
- Upon adding one, it was removed from the concurrent search results or recommendations, as the user shouldn't be able to add the same recipient 2 times. However, if they tried to type a phone number that already existed in the recipients, this case was also handled and an error message was shown as a toast.

**Automatic drafting system**
It was chosen that after a cooldown, the draft was automatically saved assuming at least one field held a value. If the fields were all empty, the existing draft was deleted from the database again.
Draft saving logic was handled in the `handleSaveDraft` function in `/components/new-message-form.tsx`: ![[Screenshot 2025-04-22 at 10.29.38.png]]
- If the component was mounted, it was called from a `useEffect` which got triggered by a constant which received changes after the debounce of no changes triggering the useEffect only after that useDebounce. A custom hook was created for this behaviour in `/hooks/use-debounce.tsx` (line 252 - 255).
- The function then checked if the message was empty and called the correct function accordingly (line 245 - 250).
- The `save` function checked if the current draft had changed compared to the previous draft, saved it if it had, updated the draft's ID and status based on the save result, and modified the URL to reflect the new draft ID while revalidating the server (208 - 231).
- The `discard` function deleted the current draft from the database if it had an ID and updated the URL to remove the draft ID, which revalidated the server and re-rendered the component (234 - 243).

**Modals**
This pages uses the following modals:
- `schedule-modals.tsx` contains one modal for selecting a schedule date, and another for warning the user that that date is invalid.
- `recipient-info.tsx` gets shown when a user clicks a recipient chip and the modal shows additional information about the selected recipient (or contact).

**Challenges**
First, there was an issue with the draft saving. Whenever the URL got updated (even just with URL search params), it caused all the components of that page to re-render since the top-level server component retrieved the `message_id` parameter from the URL to fetch the draft data. This re-rendering led to all the fields losing their values, including previously open popups or popover menus which would also get hidden. To fix this, a context was created which persisted all the values during the re-renders.
  
Additionally, building the suggested recipients window with all its functionalities and ensuring it was bug-free took a significant amount of time. It was difficult to find a setup that would always have the most up-to-date values, and as the new-message-context grew larger, it became increasingly challenging to work with.
#### Settings (`/settings`)
Determining the code architecture for the settings was challenging due to a lack of clear guidance. Preferring automatic updates whenever a setting was modified, save button were avoided. The settings page featured a custom setup where some settings were managed by libraries and others with a custom implementation.

While most settings were saved in local storage, theme data and the current language were stored in cookies due to how the libraries handled them. However, directly updating local storage did not refresh the React components. To resolve this, a settings context was created (`/contexts/use-settings.tsx`), which managed the settings state and included various helper functions.

A server action called `updateSetting` that updated individual settings one at a time was manufactured (`/lib/actions/user.actions.ts`), leading to the creation of multiple forms. This approach, while resulting in more forms, allowed for easier management through centralized logic (`/components/settings-item.tsx`).

**Re-usable components**
Due to the repetitive nature of settings, reusable components were developed: a `SectionHeader` for setting categories and `SettingsItem` for individual settings.

The `SectionHeader` component (`/components/headers.tsx`) was simpler as it required passing in the title and caption to display, along with the anchor-tag name.

The `SettingsItem` component (`/components/settings-item.tsx`) was more complex as it contained all the error handling and pending logic. It was made customizable by adding a `renderInput` prop, which allowed passing of completely custom HTML for input while still providing access to the database submit handlers and other important data. Each of these forms adhered to "Scenario 2" found in the "Form setup" section of the "RULES FOR CONSISTENCY" chapter.

It was worth mentioning that the language changer used the `updateLanguageCookie` function, which could not be implemented without using the Next.js router for replacing and refreshing internally. Due to this internal refresh, it caused a reset, necessitating its own component due to the increased complexity of changing the language.

**Considerations**
Initially, using a single form for all settings was considered but was rejected due to performance and readability concerns. A single form would complicate handling, requiring the entire settings set to be sent to the server for each modification, which would hinder validation and error handling.
#### Admin dashboard (`/dashboard`)
The admin dashboard was built last and included statistical information. It was placed outside the main layout groups but inside the `/app/[locale]/`, which was necessary for it to have the current locale.

The page was only accessible to admins, as explained in the "Authentication flow" section of the "AUTHENTICATION & AUTHORIZATION" chapter. The ReCharts library was used for the responsive area and pie charts. For coloring the area chart, it retrieved the primary theme color and the profile color. For coloring the pie chart, it used the primary color of each theme. The order was randomized, and the colors were saved to a state so that they would change during component re-renders caused by users modifying the date.

The page included:
- 3 cards at the top displaying the amount of messages sent compared to the past.
- An area chart showing the messages and cost since a specified time.
- A toggle that changed the start date for the other charts.
- A users table ranking the signed-up users based on sent messages since the selected start date. The `end_date` search parameter could also be injected into the URL, and the application would apply the filter for an end date.
- A pie chart displaying information about the countries of the recipient phone numbers, retrieved from the [label statistics API](https://gatewayapi.com/docs/apis/statistics/).
![[Screenshot 2025-04-23 at 12.16.33.png]]

**Date filtering**
The start date toggle, found in `/components/admin-dashboard/message-area-chart.tsx`, was a Select dropdown that replaced the current URL with a new URL containing updated search parameters whenever its value changed.
![[Screenshot 2025-04-23 at 11.49.43.png]]

**Data fetching**
Since larger datasets were expected after some time of app deployment, "Scenario 2" of the "Conservative data fetching" section in "RULES FOR CONSISTENCY" was utilized. This meant that the data was fetched in the top-level server component, where the URL parameter was retrieved and passed to the backend fetching functions. Whenever the URL parameters changed, it re-rendered, causing the data to be updated.  
![[Screenshot 2025-04-23 at 11.58.40.png]]

The data from the top-level server component was then passed to the `AdminDashboard` client component, where additional data formatting and calculations were performed.  
![[Screenshot 2025-04-23 at 11.56.02.png]]

**Challenges**
One challenge was getting the pie chart to work. Sometimes it just wouldn't display. This was later found to be due to a height that was too small, so a fixed height was added to its parent container.

Additionally, a custom tooltip for the pie chart had to be implemented, which was inspired by the tooltip in the area chart to maintain design consistency.
#### Other pages
These pages were very similar:
- `/sent` for sent messages
- `/scheduled` for scheduled messages with a send time in the future. Once the scheduled time was reached, it showed up in `/sent`
- `/failed` for failed messages where an error occurred on the API's side or got canceled by the user
- `/drafts` for drafted messages that had been saved but not sent, allowing users to edit or finalize them before sending
- `/trash` for trashed messages, where one could recover them or delete them permanently
- `/contacts` for contacts - contacts held additional information like the phone number, name and a description. This page was slightly different from the others, but it was similar enough to be put in the same layout.

**Shared layout**
The pages from this chapter lived in the same route group due to their similarity (`/app/[locale]/(root)/(message-layout)/`) which shared the same layout and error handling files. The layout wrapped the children pages with a provider for the translation context while loading in the necessary namespaces. Since the pages needed access to the contacts, the children pages were wrapped with a provider for the contacts context, passing in some initial contacts (line 34-36).
![[(message-layout)-layout.png]]

**Page architecture**
- `messages-page.tsx` as the wrapper for the other components
- `messages-list.tsx` which showed the contact search results (middle column)
- `message-display.tsx` which displayed the message itself and was also wrapped in the children panel component. More details about this were provided in the "React resizable panels" section of the "FRONT-END" chapter.

**Search/filtering**
The `search.tsx` component was the search bar UI used for searching through messages and contacts. It called the passed-in function (`onSearch`) upon input changes and persisted the user's query in the URL for bookmarkability and accidental refreshing. This URL update did not refresh the server components, as Next.js hooks were not used.  
![[Screenshot 2025-04-23 at 16.19.34.png]]  
The `searchMessages` and `searchContacts` functions filtered their respective arrays based on a user-provided search term, enabling client-side searching. Both functions converted the search term to lowercase for case-insensitive comparison. `searchMessages` checked for matches in the message's subject, body, or status, while `searchContacts` looked for the term in the contact's name or phone number. If no search term was provided in `searchContacts`, it returned the original list of contacts.
![[Screenshot 2025-04-23 at 16.09.19.png]]

**Message display**  
This pages from this chapter except contacts had these buttons on their message display:  
- The **Resend** button was for taking all the fields of a message and inserting them into the new-message form again. It worked by first creating a new draft in the database and then passing the ID to the message_id parameter on the `/new-message` page.  
- The **Move to trash** button was for moving messages to trash. On the trash page itself, the message was deleted from the database.  
- The **Close** button was for deselecting the currently selected item shown in the column on the far right. Page-specific buttons:  
  - The **scheduled page** also had a **cancel scheduled** message button, which canceled the SMS and obtained a refund via the API, moving the message to failed. This was useful for testing the app without costs.  
  - The **trash page** also had a **recover message** button, which moved the message back to its original location, recovering it from the trash.  
It was decided that each message displayed its recipients in chips format, which, upon clicking, brought up the `recipient-info.tsx` modal to show more information about the recipient (or contact). By default, the recipients were collapsed, and they could be expanded by clicking the little arrow on the right.  
It was worth mentioning the effort to display the contact profiles nicely. The first five recipients/contacts were shown in a little overview element containing their profile circles. Their styling was handled in the `scattered-profiles.module.css` file using CSS modules. The sizes and positions were hardcoded, but the colors were randomized by storing a shuffled array in a state, and each time a new message was selected, the procedure was repeated.

**Contacts page**  
While also being very similar, it had its own components because the data was completely different and the code needed to be kept clean:
- `contacts-page.tsx` instead of `messages-page.tsx`.  
- `contacts-list.tsx` instead of `messages-list.tsx`.  
- `contact-display.tsx` instead of `message-display.tsx`. 
It was decided to have this page include one button each for creating, editing, and deleting contacts in the database.

**Modals** 
It was decided that all of the mentioned pages wrap their display component in a modals-provider, a provider of a context for managing which modals are currently open. 
The contact pages uses these modals:
- `edit-contact.tsx` contained a form for editing a contact with a `useActionState` setup
- `create-contact.tsx` contained a form for creating a contact with a `useActionState` setup 
The other pages use this modal:
- `recipient-info.tsx` displayed more information about a recipient (or contact)
## RULES FOR CONSISTENCY
#### Use of server actions
As of Next.js 15 with the app router, it was recommended to use [server actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) for data fetching or making API requests on the backend. Server actions simplified development by allowing developers to define server-side functions invoked directly from client components, automatically making POST requests on the backend when the action gets called.

Previously, developers had to create separate API routes for data fetching, which was cumbersome and time-consuming. In most cases, it's better to use server actions over API routes. The following guide was consulted whenever there was uncertainty about which one to use.
![[Screenshot 2025-04-17 at 12.32.33.png]]
Since Next.js recommended treating server actions like public API routes, it was highly recommended to **verify user authentication in every server action** for security purposes.
#### Form setup
There were 2 different scenarios for forms. Based on complexity, it was necessary to choose one of the following options to maintain a consistent codebase:
- **Scenario 1**: In simple situations, it was recommended to let the form submit directly to the server without altering the submit process.
    - **Implementation**: This setup involved using the `useActionState` React hook, with the action passed to the `action` prop of the form tag.
    - **Server response**: If the action response was needed, it was necessary to create a `useEffect` with the server state in the dependencies array.
    - **Example**: An example of this scenario could be found in `/components/modals/create-contact.tsx`.
- **Scenario 2**: If code needed to run upon form submission, interrupting the natural submit behavior, this scenario would have to be used.
    - **Implementation**: First, it was necessary to create a function (commonly named `handleSubmit`) to pass to the `onSubmit` prop of the form tag. In the `handleSubmit` function, special logic could be written, and the server action could be called.
    - **Server response**: If the HTML required the action response, it was necessary to create a `useState` that would be set in the `handleSubmit` function.
    - **Example**: An example of this scenario could be found in `/components/login-form.tsx`.
These scenarios were developed through extensive experimenting, research, and testing, and they proved to be the most readable, effective, and efficient.
#### Conservative data fetching
There were many possible ways of fetching data in Next.js. After extensive research and testing, 2 methods came into consideration:
- **Method 1**: This method involved fetching data from the server component once and then using client-side JavaScript to perform filtering. It minimized server load by executing the database query only during the initial page load, resulting in nearly instant filtering results.
    - **Advantage**: It decreased server load due to a singular data fetch on page load and provided very fast filtering for medium-sized datasets or smaller.
    - **Disadvantage**: It could become laggy if the dataset was too large or the filtering was too complex for the client-side JavaScript, especially if the user had an old computer.
- **Method 2**: This method involved passing updated search parameters from the client component into the dynamic database queries. When the search parameters changed, the server component automatically re-rendered and re-fetched the database.
    - **Advantage**: It did not rely on the user's computer as the filtering was done on the server in the SQL query.
    - **Disadvantage**: It increased server load due to frequent data re-fetches (every time a filter was updated) as well as database query delay.

Due to the medium-sized dataset (less than 1000 messages per user), it was concluded that **Method 1 was the most suitable approach** for most use cases.
#### Pages wrapper files
Each page that was created had to contain at least a `loading.tsx` and an `error.tsx` and optionally a layout. 
- `error.tsx` is a file in Next.js that serves as a catchall for unexpected errors. Behind the hood it creates a react error boundary which prevents the app from crashing when unexpected exceptions happen.
- `loading.tsx` is a file that is shown while the page is loading, and it contained all the skeleton UI for that page.
- `layout.tsx` is a layout around the page. To keep the `page.tsx` cleaner, it is good to keep everything that you don't need in the page, in the `layout.tsx`. This would be the translations provider and other providers if possible.
- `page.tsx` is the page itself which should be held as clean as you can and if you can a server component for fetching data later on if needed.

At first I had everything setup with a `React.Suspense` suspense boundary which I used for loading. This is good if you want to implement partial pre-rendering where some parts of the page load faster than others and they have a separate loading indicator. However I quickly discovered that if you only use one you might as well use the Next.js file convention which keeps your files more organized.
#### Metadata
Metadata was generated server-side using the `generateMetadata` function from the Next.js API. This was necessary for metadata translation.
![[Screenshot 2025-04-23 at 19.44.07.png]]
The app logo was shown by naming it `favicon.ico` and placing it in `/app`, which Next.js automatically recognized and used for metadata. 

It was also possible to statically export the metadata, but in that case, it be impossible to translate into different languages.
## DATABASE
PostgreSQL was chosen for its reliability and feature-rich capabilities. As an open-source relational database, it offered robust data integrity and strong security features. Connection was established using `pg`, with the production environment running in a Docker container on port 5432. More information can be found in the "DEPLOYMENT" chapter.

At first, **Prisma**, a database toolkit and object-relational mapping (ORM) layer, was considered to be used along with the PostgreSQL database. It streamlined database access by providing a **type-safe API**. However, it was rejected to keep the project lightweight and minimize dependencies.
#### Connecting to the database
The `node-postgres` library was used, due to its an efficient way of executing SQL queries and retrieving results.

When connecting to PostgreSQL using `pg`, there were 2 options: **pool** or **client**. A **pool** was a group of reusable connections ideal for concurrent queries, which was utilized due to multiple queries at once. A **client**, on the other hand, represented a single connection per interaction.

To simplify querying, a helper function was created (`/lib/db/index.ts`) that took in the SQL query and values to insert. It started by creating a new pool, connecting to that pool to create a new client, and then querying it while catching unexpected errors, and lastly releasing the client back into the pool.
![[Screenshot 2025-04-12 at 09.07.34.png]]
Now it was just as easy as importing the db helper function and passing in the SQL query and values. For information on `pg`, the [docs](https://node-postgres.com/) were referenced.
#### Database schema
![[Screenshot 2025-04-17 at 17.09.42.png]]
The database schema, defined in the seed file (`/lib/db/seed.sql`), created four tables:
- `user` held all the users' data, including account data and settings.
- `contact` held all the contacts, including their important data like name, phone number, description, creation date, and last updated date.
- `message` held all the messages, with each message referencing `user` table's primary key. Furthermore, each message contained important data such as the sender, subject, body (content of the SMS), sent date, status (sent, scheduled, failed, or drafted), and other data returned by the API when the message was sent.
- `recipient` held all the message recipients, with each recipient referencing `message` table primary key. Additionally, each recipient consisted of a unique phone number, and an index used to display the recipient in the same user-defined order on the new-message page during component re-renders.
Moreover, all of the mentioned tables used a serial primary key field called `id` utilized to distinguish the different items.

**Considerations**  
One consideration at the beginning of the project was to have separate tables for message types (drafts, trash, etc.), but it was realized to be unnecessarily complex. Ultimately, all messages were stored in the same table, with each message having fields like `status` and `in_trash`, which determined in which category it would be shown on the front-end.

For a long time during the app's development, contacts were linked to recipients using the primary key. However, three-quarters into the project, a migration was necessary due to querying and insert problems, as well as overall flaws in the architecture. The new solution involved checking for contacts on the front-end, looping over recipients to verify if their phone numbers matched a contact's.

Even though it worked this way, another consideration for improvement was to handle scheduled messages differently. As of that point, scheduled messages remained with the status "SCHEDULED" even when their delivery date was reached, which was not logically accurate. To resolve this logic issue, it could be suggested to rename the field to something else or update the status to "SENT" when the delivery date was reached.
## AUTHENTICATION & AUTHORIZATION
The application utilized a combination of Active Directory (AD) and Iron Session for authentication and authorization purposes.
#### Active Directory
Since the school already used an AD server for managing students' computer accounts, it was integrated with the application. This combination made managing user access much easier later on, as the user accounts were all managed in one place.

AD worked similarly to a database, storing information about all users and their data. In this case, the application had 2 specific groups set up in AD: "Utilizadores-SMS" and "Administradores-SMS." These groups were used to determine the permissions each user had within the application.

If a user was part of the "Utilizadores-SMS" group, it granted them basic access to the application, allowing them to send SMS messages and manage their own messages. Conversely, if a user belonged to the "Administradores-SMS" group, it provided all the same permissions as the first group, along with access to an admin dashboard that offered detailed statistics on all users and sent messages.
#### Active Directory implementation
To connect to the AD server from inside the application, 2 different packages came into consideration: `activedirectory` and `activedirectory2`. The `activedirectory2` package was ultimately chosen because it was the most up to date, and the other one did not work.

This package used [Lightweight Directory Access Protocol (LDAP)](https://www.okta.com/identity-101/what-is-ldap/) queries and provided a JavaScript (JS) wrapper where it allowed the passing of the email and password of a valid, already registered AD account along with some other arguments. An AD instance object was first created as shown below:  
![[Screenshot 2025-04-11 at 21.45.22.png]]  
After that, methods of this instance could be used as shown below:
![[Screenshot 2025-04-11 at 21.49.49.png]]  
The utilized functions can be found in `/lib/auth/activedirectory`. For information on `activedirectory2`, the [docs](https://www.npmjs.com/package/activedirectory2) were referenced.
#### Session management
Session management was the process of handling user sessions in web applications, where session data was typically stored as a cookie. A session management library provided tools to create, maintain, and terminate user sessions (auth cookies), simplifying authentication and state management.

Since the AD setup already handled most of the authentication, a full-blown authentication library was not necessary. In fact, a lightweight session management library did the job. The `iron-session` package was chosen due to its session-based nature, and its lightweight, secure, and easy-to-implement features.

Another session management library called `jose` was also considered. However, it was quickly rejected, as token-based authentication was not necessary for the project. Additionally, `iron-session` was more lightweight and easier to use. More information about authentication types could be found in the "Session-based vs. Token-based authentication" section.

Also, different browser storage options for persisting user authentication data were explored. Initially, session storage was mistakenly considered because its name suggested suitability; however, using this storage option for user authentication data was inappropriate since session storage expired when the tab was closed, unlike cookies, which were commonly used to persist session data.
#### Session management implementation
When a user got authenticated successfully, his information was stored in the database, and subsequently in an encrypted session id cookie generated by `iron-session`. 

**Configuration**
`iron-session` sessions were customized by modifying a configuration object:
- Name and password could be anything, but for extra security the password was generated using openssl
- The session expired after 24 hours instead of the default 14 days.
![[Screenshot 2025-04-18 at 07.28.16.png]]
*Authentication config file located in `/lib/auth/config.ts`*

**Helper functions**
A simple helper function called `getSession` was created to wrap the Iron Session api, which on the server-side retrieved the active session from the cookie or created a new one if none existed. The previously customized `sessionOptions` config object was utilized to as one of the arguments passed to the `getIronSession` function.
![[Screenshot 2025-04-11 at 21.31.05.png]] _getSession helper function located in `/lib/auth/sessions.ts`_

Another helper function was manufactured with the purpose of creating a new session. This one used the `getSession` function to first retrieve the current session, and subsequently it attached useful information about the user and if he was authenticated or not and an admin or not to the session. Lastly the modifications to the session were applied (line 29).
![[Screenshot 2025-04-11 at 21.34.19.png]]
*createSession helper function located in `/lib/auth/sessions.ts`*

For information on the `iron-session` package, the [docs](https://www.npmjs.com/package/iron-session) were referenced.
#### Authentication flow
With the initial Active Directory and iron-session setup out of the way, the final implementation could be written.

In summary, the authentication flow involved the following steps:
1. **User Login**: Users entered their credentials (username and password) into the on the client and submitted the form to the server.
2. **AD Authentication**: The application checked these credentials with the Active Directory server.
3. **Iron Session Creation**: If successful, Iron Session created a new session cookie and user information was saved to the PostgreSQL database.
4. **Session Retrieval**: On subsequent requests, the application checked if the user's session was still valid by decrypting the cookie on the server and checking if the `isAuthenticated` property was set to `true`.

The broad logic was handled in the **login function** where it first retrieved the submitted values, validated it using `zod` (line 18, 19), called the **authenticate function**, and lastly returned the appropriate response to the client while creating a new session if the user got authenticated successfully.
![[Screenshot 2025-04-11 at 22.00.47.png]]
*Login function located in `/lib/auth/index.ts`*

The **authenticate function** contained the important logic for authenticating the user with the AD server and saving the result to the database. First, the account's existence on the AD server was verified, and if negative, the according response was returned early. If it did exist, accounts privileges were inspected, and lastly the results of these queries were saved to the database and returned back to the login function.
![[Screenshot 2025-04-11 at 22.13.17.png]]
*Authenticate function located in `/lib/auth/activedirectory/authenticate.ts`*

For checking if the user existed (line 20), the `ad.authenticate()` method was used and for checking the account existed in the specific AD group (line 30 and 34), the `ad.isUserMemberOf()` method. The detailed code for this is located in the files in `lib/auth/activedirectory/`.

**Subsequent requests**
On every request, Next.js automatically recognized the `/middleware.ts` file and executed the default export of that file before any pages were served. This made it the perfect place to verify user authentication. The code included redirecting authenticated users on `/login` to `/`, while unauthenticated users were being redirected to `/login` if they were not there already.
![[Screenshot 2025-04-18 at 09.41.46.png]]
Since Next.js recommended to treat server actions like public API routes, user authentication was also **verified in every server action**.

Additionally, checks for admin permissions were distributed across the app to display certain things for them that normal users shouldn't see, with the most critical point being a programmatic redirection in the admin-dashboard layout.
![[Screenshot 2025-04-18 at 09.52.12.png]]
*Dashboard layout located in `/app/[locale]/dashboard/layout.tsx`*
#### Session-based vs. Token-based authentication
Two methods for securely persisting user sessions were examined:
1. **Session-based authentication**: A unique session ID was generated upon login, stored on the server. The session ID was sent to the client **as a cookie** to verify the user's identity in subsequent requests, with mechanisms for expiration and invalidation.
![[Screenshot 2025-04-18 at 08.54.22.png]]
2. **Token-based authentication**: A JSON Web Token (JWT) was generated after login, containing user information and an expiration timestamp. The client stored the token and sent it in the **Authorization header** with each request. This method allowed for **stateless authentication**, as the server did not maintain session state, and supported cross-domain authentication and mobile app integration.
![[Screenshot 2025-04-18 at 08.54.08.png]]
Given the limited scope of the application and hosting on a singular server, session-based authentication was deemed appropriate.

**Sources:**
- https://dev.to/fidalmathew/session-based-vs-token-based-authentication-which-is-better-227o
- https://www.geeksforgeeks.org/session-vs-token-based-authentication/
## INTERNATIONALIZATION (i18n)
Internationalization (i18n) was the process of designing and developing software that could be easily adapted to different languages, cultural contexts, and regions without major changes to the core codebase. It included translating the user interface, handling Unicode, and separating content from code, ensuring the application was accessible and usable by a global audience.

I18next was chosen as the base library for i18n, along with additional packages. An external service called i18nexus was included, providing a Graphical User Interface (GUI) for managing translations and the ability to automatically translate strings from the base language into other languages.

Some terms that it included in this chapter were:
- **namespace**: A way to organize translation keys into separate groups, allowing for better management and structure of translations within i18next.
- **translation-string**: A key-value pair where the key is a unique identifier for a specific text string, and the value is the actual translated text in the target language.
- **interpolator**: A feature in i18next that allows for dynamic insertion of variables into translation strings, enabling the creation of more flexible and context-aware translations.
#### Implementation
At first, **React-Intl** was considered as an i18n library. However, **i18next** was determined to be the superior choice for internationalization in React applications due to its comprehensive feature set, easier integration, more intuitive API, larger and more active community, and better performance, making it the preferable solution for the project.

In addition to **i18next**, other packages were used:
- **i18next** was the core internationalization library that provided the foundational functionality for managing translations and localization.
- **react-i18next** was the package that integrated i18next with React, providing hooks and components that made it easier to work with translations in React components.
- **i18next-resources-to-backend** was the plugin that enabled the loading of translation resources from a backend server. It was particularly useful for server-side rendering (SSR), allowing the application to fetch translations dynamically based on the user's locale.
- **next-i18n-router** was specifically designed for Next.js app router projects. It implemented internationalized routing and locale detection, allowing developers to easily manage routes based on the selected language without having to build the routing logic from scratch.

**Setup**
1. The packages were installed.
2. A config file was created (`/i18n.config.ts`): ![[Screenshot 2025-04-18 at 10.11.42.png]]
    - It specified a `locales` property, which was an array of languages the app would support.
    - The `defaultLocale` property was the language that visitors would fall back to if the app did not support their language.
3. A dynamic segment was created inside the `/app` directory to contain all pages and layouts, named `[locale]`.
4. The middleware was updated (`/middleware.ts`): ![[Screenshot 2025-04-18 at 10.20.28.png]]
    - The next-18n-router package made it easy, as it returned the value of the **i18nRouter function**, handling all the locale routing logic.
5. The initTranslations function was created (`/app/i18n.js`), which used **i18next-resources-to-backend** to load translations server-side, with code copied from the tutorial.
6. The TranslationsProvider was added (`/contexts/translations-provider.jsx`), which wrapped the components where the `t` function from react-i18next was used, with code copied from the tutorial.
7. The generateStaticParams function from the Next.js API was added to the root layout to [**statically generate**](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default) routes at build time instead of on-demand at request time.
8. The app was connected to the i18nexus platform, with more details available in the "i18nexus integration" section.

For the setup, tutorials by **i18nexus** were referenced:
- [Written tutorial](https://i18nexus.com/tutorials/nextjs/react-i18next)
- [Video tutorial (30 min)](https://www.youtube.com/watch?v=J8tnD2BWY28)

**Usage**
**In a client component**, the translations function (called `t`) was obtained by de-structuring it from the useTranslation hook from **react-i18next**.
![[Screenshot 2025-04-18 at 11.46.09.png]]

**In a server component**, the translations function (called `t`) was obtained by de-structuring it from the initTranslations function created in the setup, passing in the current locale and an array of namespaces.
![[Screenshot 2025-04-18 at 11.44.41.png]]

After that, the `t` function could be used anywhere in the component by passing in the translation string and, if applicable, the interpolator.
![[Screenshot 2025-04-18 at 11.52.14.png]]

**i18next** included a variety of other features, but these were the only ones used in this project.
#### i18nexus
i18nexus was a platform that simplified internationalization (i18n) and localization (l10n) for software applications. The old-fashioned method involved manually creating multiple JSON files for each namespace and language. However, translations were written and managed in the Graphical User Interface (GUI) provided by i18nexus. Translations were first written in a base language (English) and then automatically translated into other languages.

One notable aspect was that the application did not depend on an external service. It was possible to pull all translation JSON files into the project using a terminal command.

Initially, only the free plan was used, but later the basic plan was purchased due to running out of translation strings. After finishing the app, this plan was canceled, and the application continued to function.

One problem that was noticed was that the platform used the Google Translate API on the free and basic plans, which only supported Brazilian Portuguese. After contacting support, it was able to quickly implement a fix where the platform used the DeepL translator for European Portuguese, even on the lower tiers.

When using the App Router with i18next, a good practice was to "namespace" strings per page. This approach allowed it to avoid loading all strings for the entire app when viewing one page, enabling it to load only the strings for that specific page at a time.
#### i18nexus integration
To connect the app to i18nexus, these steps were followed:
1. **i18nexus-cli** was installed globally (`bun i i18nexus-cli -g`) and as a dev dependency (`bun i i18nexus-cli --save-dev`), which was the command line interface used to pull translation files into the project.
2. The project API key was added to the `.env` file with the variable named `I18NEXUS_API_KEY`.
3. The command `i18nexus pull` was executed from the terminal in the root directory of the project to pull or update the locales.
4. For convenience, this command was also added to the `package.json` scripts, so that the most up-to-date translations were automatically pulled whenever a server was spun up.
![[Screenshot 2025-04-18 at 12.44.18.png]]
## SELF-HOSTING & DEPLOYMENT
The app was deployed on a school computer in a Docker container. To simplify access, a free domain name was obtained from No-IP, a DDNS provider.
Here's how the traffic flows:
1. A client requests `etpzp-sms.ddns.net`.
2. The router receives the request and forwards it to Nginx.
3. Nginx redirects to HTTPS if necessary and forwards the request to the Docker container.
4. The Node.js server in the container processes the request.
This setup allows easy access to the app through a simple domain name while ensuring proper routing and security.
#### Docker
Docker was chosen as an open-source platform that allowed developers to package applications and their dependencies into lightweight, portable containers, simplifying deployment and enhancing portability across different environments.

During production, there were 2 separate Docker containers: one for the web application with the Node.js server itself, and another one for the PostgreSQL database. Either of them ran the Alpine Linux, which is a very lightweight Linux operating system.

Other files related to Docker that were not explained included `.env.docker` and `.dockerignore`, which were used to manage environment variables and specify files and directories that should be excluded from the Docker build context, respectively.
#### `Dockerfile` explained
A Dockerfile was a text file that contained a series of instructions for building a Docker image, specifying the application environment, dependencies, and configuration needed to run the application. It had 2 Dockerfiles in the application.

**Node.js Dockerfile**
This was the most important Dockerfile located in `/Dockerfile`:
![[Screenshot 2025-04-18 at 15.18.04.png]]
1. **Base Image**: A base image was defined using a lightweight Alpine Linux environment with Bun (line 1).
2. **Install Node.js and i18nexus**: Node.js and npm was installed, along with the i18nexus CLI for translations (lines 4-5).
3. **Dependencies Stage**: A new stage named `deps` was created to install application dependencies. It set the working directory, copied necessary files, and ran the installation command (lines 8-12).
4. **Build Stage**: The `builder` stage was initiated, where it set the working directory, copied installed dependencies from the previous stage, and built the application (lines 15-19).
5. **Production Server Stage**: The final stage, `runner`, set the working directory and defined the environment variable for production. Built application files from the previous stage were copied (lines 22-28).
6. **Copying Additional Files**: The code also copied the `package.json` and `node_modules` from the previous stage to ensure all necessary files were available (lines 33-34).
7. **Expose Port**: The `Dockerfile` exposed port 3000, allowing external access to the application (line 36).
8. **Start Command**: Finally, a command was specified to start the application (line 37).

**Database Dockerfile**
This was the simplest configuration located in `/lib/db/Dockerfile` for setting up and seeding the database:
1. **Base image**: The base image was defined using a specific version of PostgreSQL, which was based on a lightweight Alpine Linux variant (line 1).
2. **Copy seed script**: A SQL file named `seed.sql` was copied into a designated directory within the PostgreSQL container used for seeding the database when the container started (line 2).
#### `docker-compose.yaml` explained
A `docker-compose.yaml` file was a text file that defined a multi-container Docker application. It specified the services (containers) that made up the application, their configurations, and how they interacted with each other. This file allowed for the definition and management of the entire application stack, including networking, volumes, and environment variables, in a single file.

It would have been possible to achieve the same results without Docker Compose by creating and managing the individual Docker containers, networks, volumes, and other resources required for the application. However, this would have been more complex and time-consuming.

The Docker Compose file, located in `/docker-compose.yaml`, defined 2 services: `web` and `database`.
![[Screenshot 2025-04-18 at 15.50.56.png]]
- The `web` service:
	- It built the Docker image using the Dockerfile in the current directory.
	- It loaded environment variables from the `.env.docker` file.
	- It exposed port `3000` on the host and mapped it to port `3000` in the container.
	- It depended on the `database` service and waited for it to be healthy before starting.
- The `database` service:
	- It built the Docker image using the Dockerfile in the `./lib/db` directory.
	- It set the container name to `postgres`.
	- It loaded environment variables from the `.env.docker` file.
	- It exposed the `POSTGRES_PORT` environment variable on the host and mapped it to the same port in the container.
	- It mounted a volume named `database-v` to the `/var/lib/postgresql/data` directory in the container.
	- It defined a healthcheck that checked if PostgreSQL was ready to accept connections every 5 seconds, with a timeout of 5 seconds and a maximum of 5 retries.
- The `database-v` volume was defined to persist the PostgreSQL data.
#### No-IP & port forwarding
To simplify user access, a free domain name was obtained from No-IP, a dynamic Domain Name Service (DNS) provider. This allowed users to connect to the application using a memorable domain name instead of the router's IP address, which may have changed frequently.

No-IP automatically updated the domain name to reflect the current IP address of the router, ensuring consistent access. This feature was particularly useful in environments where dynamic IP addressing was common. In other words, it basically made the dynamic IP behave like a static one.

To set up No-IP, [this guide](https://www.noip.com/support/knowledgebase/free-dynamic-dns-getting-started-guide-ip-version) was referenced. Here is a short summary of what was done to set up No-IP:
1. **Create an account:** A new account was created on No-IP's website and the required information was filled in.
2. **Confirm the account:** The email was checked for a confirmation link and clicked it.
3. **Log in:** It accessed the account using the email and password.
4. **Adding a hostname:** A hostname for the server was created
5. **(Optional) Creating a dynamic DNS key:** A dynamic DNS key was created for added security and compatibility.
6. **Making the host dynamic:** No-IP’s Dynamic Update Client (DUC) was installed and configured the device for updates.
7. **Configuring the router:** Port forwarding was set up for necessary services (e.g., web, FTP).
8. **Running the services:** The setup was verified with a port check tool and started using the services.

Port forwarding was configured on the router to direct incoming traffic to the specific port of the Docker container running the application. This setup enabled users to reach the application easily and from networks beyond just the school's network. For the configuration, [this guide](https://www.noip.com/support/knowledgebase/general-port-forwarding-guide) was referenced.
#### Nginx
Along with many other features, Nginx was used for 2 main purposes: as a web server and as a reverse proxy to redirect traffic to other servers. It was used to set up SSL certificates and to redirect traffic to the application running inside Docker. For learning the basics of Nginx, [this tutorial](https://www.youtube.com/watch?v=q8OleYuqntY) was referenced.

Nginx was fairly easy to set up:
1. Nginx was installed.
2. It was started using the `nginx` command.
3. It was first tried with a self-signed certificate, which worked.
4. Then, a command from `certbot` was used to generate one for the domain name.
5. The rest of the work consisted of editing the `nginx.conf` file, where all Nginx's behavior was defined. More information about the configuration was available in the "Configuration Files" section.

**`nginx.conf`**
Even though the Nginx configuration (`/nginx.conf`) file was committed to the repository, it was not read from this file. It existed to ensure availability when needed. The actual config file's location could be checked by running `nginx -V`, allowing the path containing the config file `nginx.conf` to be copied. Here was the basic configuration:

![[Screenshot 2025-04-21 at 22.35.25.png]]
- It set up Nginx with 1 worker process and 1024 connections.
- It redirected all HTTP traffic (port 80) to HTTPS (port 443).
- It used self-signed SSL certificates for HTTPS.
- It proxied requests to a backend service running on port 3000.
- It passed client information through headers to the backend.

**Useful commands**
- `nginx -s reload`: Reloads the configuration without dropping connections.
- `nginx -s stop`: Gracefully stops the server.
- `nginx -s quit`: Stops the server immediately after closing current connections.
- `nginx -s reopen`: Reopens log files for log rotation.
For more information, reference the [nginx documentation](https://nginx.org/en/docs/).

**SSL certificates**
Getting a **self-signed** SSL certificate was easily done using the following command. It generated a self-signed key, which it placed in `~/nginx-certs/` and then referenced from the Nginx config file using the absolute path. It changed into that newly created directory:
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx-selfsigned.key -out nginx-selfsigned.crt
```
Getting an **authority-signed** SSL certificate was done using Certbot by completing a "challenge." It required the domain name for this, [[Why need a domain name for SSL certificates|read more here]]:
```bash
sudo certbot --nginx -d <your_domain_name>.com
```
After that, it still had to do more tasks, such as generating a symlink. It followed [this tutorial](https://youtu.be/BeafoOFxIcI?si=TqB9XVm-e6TdVPJE&t=301) for all of the steps.
## CONCLUSION
In conclusion, it was determined that this application successfully addressed the high costs of text messaging for the school by providing an efficient and affordable SMS communication solution accessible to all users. The project was completely responsive and usable on mobile devices. All planned features were implemented, and in fact, additional features were included. With capabilities such as multi-recipient messaging, scheduled sends, and a user-friendly interface, it streamlined communication while integrating seamlessly with the school's Active Directory for authentication.

The project was noted for being lightning fast in production, thanks to the use of the best and most robust technologies on the market and a consistent focus on performance. This emphasis on performance resulted in a snappy interface with minimal latency, which enhanced the user experience and made it feel more like an application than a website.

Built with top-tier technologies like Next.js and PostgreSQL, it demonstrated the potential of leveraging REST APIs for SMS functionality. Its deployment in a Docker container on a school computer showcased the practical application of these technologies in a real-world setting.

Although the project presented challenges, particularly towards the end, it ultimately served as a significant learning experience. With the knowledge gained, it was anticipated that future iterations similar apps could be developed more efficiently and effectively.
#### Regrets
- Not using all the features provided by i18next, and i18nexus with plural and translation branching
- Repeating the scroll area calculation so often
- Complex front-end settings setup
- Slow realization of the sheet component not being compatible with ScrollArea
- Using `.safeParse` instead of `.parse` with `zod` causing error handling code to live in the try block which doesn't adhere to separation of concerns
- No uniform way to name functions or rules for type names
- No snippets for repetitive code
- No really uniform way to handle errors in server actions
- Not having clear/consistent naming conventions for schemas, and especially types
#### Omitted features
The most important feature not implemented was **polling the API for SMS delivery status**. It was crucial because, while immediate errors were managed on both the user's side and the gateway API's side, messages could fail to reach the end recipient due to issues such as an invalid phone number or problems with the recipient's phone. This status was to be displayed in the app. For information on how to poll the API, it was recommended to reference the [gatewayApi docs](https://gatewayapi.com/docs/apis/rest/#get-sms-and-sms-status).

Although the API recommended [using webhooks](https://gatewayapi.com/docs/apis/rest/#webhooks) rather than polling for efficiency, it required message polling due to its self-hosting setup. This approach allowed it to manage situations where the server might be turned off during holidays, ensuring that it could still retrieve SMS delivery status when the server was back online.

Here are some notes and possible suggestions to get started implementing this feature:
- The database field `status` should always be true.
- It should implement message polling to update it conditionally.
    - It should poll right after sending the message; for scheduled messages, it should set a timeout to fetch the status post-sending.
- On user login, it should check all messages for the `confirmed_delivery` flag.
- It should add delivery errors for individual recipients.
- It should consider adding a field like `was_scheduled` or `scheduled_send` to indicate how the message was sent.
- It should implement a 5-minute refresh timer for polling scheduled message delivery statuses in the root layout to update amount indicators.
- It should add error handling in toasts for API-interacting buttons, such as canceling scheduled messages.

**Small Features**
- Include links to the modified/created item in success toast messages for easy access to details.
- Add shades of blue between columns to indicate hierarchy.
- Include links to GatewayApi sign-in on the top cards of the admin dashboard.
- Consider adding contact information to each message item in the list.
- Enable the possibility to attach images to messages.
- Ensure `undefined` values are converted to `null` before database insertion.
- Evaluate whether to keep the option to change the sender. If difficult, maintain ETPZP for all users; if easy, allow the admin to specify select options for all users.
- Add auth cookie max-age setting for admins.
- Provide an option to back up and restore the database from the admin dashboard.
## ATTACHMENT I - USER MANUAL
This chapter offers clear, step-by-step explanations of common procedures and non-intuitive processes. The goal is to help new users navigate this project effectively and access the tools needed to expand the project. Users should check this chapter first if they are unsure how to do something. Tips or small guides on how to do certain things are also distributed throughout the project, explaining the respective topics being discussed.
#### Getting started
This is a [Next.js 15](https://nextjs.org/) app router project
1. Install the Bun package manager by following the instructions on their [website](https://bun.sh/).
2. Set the required environment variables you can find in the `ATTACHED` section. These include `.env` and `.env.docker` which both go into the root directory of the project.
3. `cd` into the correct directory from a terminal application of your choice.
4. Install the packages by executing the `bun install` terminal command.
5. Start the development server by executing the `bun dev` terminal command. If it gives you an error this alternative: `bun next dev`.

> Note: You can use any package manager you want, but the developer recommends using Bun as it is the fastest and most efficient package manager, and it also provides a nearly identical API to `npm`.
#### Github
**Getting Started**: Create a GitHub account and set up Git on your local machine. Configure your username and email with `git config --global user.name "Your Name"` and `git config --global user.email "your.email@example.com"`.

**Cloning the Repo**: Use the command `git clone <repository-url>` to copy a remote repository to your local machine, allowing you to work on the project locally.

**Adding a New Branch and Setting Upstream**: Create a new branch with `git checkout -b <branch-name>`, then push it to the remote repository for the first time using `git push -u origin <branch-name>`. The `-u` flag sets the upstream tracking reference, linking your local branch to the remote branch. In addition to that branches should only be created for a new feature and when that feature is completed and tested and working, it can be merged into the main branch.

**Pushing to the Repo**: After making changes, stage them with `git add .`, commit with `git commit -m "Your message"`, and push to the remote repository using `git push origin <branch-name>`.
#### Working in a development environment
This can be a bit tricky from platform to platform, but I will explain the setup and some hacks for developing this project.

**Node.js web server**
First of all, you can start a dev server like so:
```bash
bun dev
```
or if you have no internet connection or some other error, use this command:
```bash
bun next dev
```

**Debugging PostgreSQL database**
**On macOS**, make sure Postgres.app is running at least in the background for it to work. For querying the database directly, execute the `psql`  command in a terminal to get into the `psql` shell where you can run all your queries.

**On Windows**, it should always be running. For querying the database directly, the `psql` app was opened which is an application containing the `psql` shell where you can run all your queries.

>Note: If you are having connection issues, it is likely due to invalid credentials.

**PostgreSQL commands**
- Seed the database by running `\i your_project_file_path/lib/db/seed.sql` in the `psql` shell. This is the same on macOS and Windows. However if you are having issues on Windows, experiment using backslashes (`\`), instead of normal slashes (`/`).
- `sql` commands:
	- Deleting all tables: `DROP TABLE IF EXISTS recipient, contact, message, public.user;`
	- Checking how many messages got sent in the last 30 days: `SELECT COUNT(*) FROM message WHERE send_time >= CURRENT_DATE - INTERVAL '1 months' AND in_trash = false AND status NOT IN ('FAILED', 'DRAFTED');`
#### Working in a production environment (deployment)
1. Ensure the Docker engine is running by opening the Docker app.
2. Start the Docker containers:
```bash
docker-compose up --build
```
2. If nginx isn't running already run this command:
```bash
nginx
```
2. Restart the Nginx web server:
```bash
nginx -s reload
```


>**Note**: In the first command, the `--build` flag is optional; it forces a rebuild of images, while omitting it allows Docker Compose to use existing images, speeding up deployment if no changes were made. 
#### Debugging Docker
**Accessing a Docker container**: To access a running Docker container, use the following command:
```bash
docker exec -it <container_name_or_id> /bin/sh 
```
Replace `<container_name_or_id>` with the actual name or ID of the container. Since we are running Alpine, we access the `sh` shell instead of `bash`.

**Accessing a PostgreSQL database in a Docker container**: To access a PostgreSQL database via the `psql` shell running inside a Docker container, use:
```bash
docker exec -it <postgres_container_name_or_id> psql -U <username> -d <database_name>
```
Replace `<postgres_container_name_or_id>`, `<username>`, and `<database_name>` with the appropriate values.

**More commands**:
- **List Running Containers**: `docker ps`
- **Stop a Container**: `docker stop <container_name_or_id>`
- **Start a Container**: `docker start <container_name_or_id>`
- **Remove a Container**: `docker rm <container_name_or_id>`
- **View Container Logs**: `docker logs <container_name_or_id>`

**Danger zone**:
- **Remove stopped containers**: `docker container prune`
- **Remove unused images**: `docker image prune`
- **Remove unused volumes**: `docker volume prune`
- **Remove unused networks**: `docker network prune`
- **Remove all Docker resources**: `docker system prune -a --volumes`
#### Working with i18nexus
> **Disclaimer**: Choosing not to use i18nexus and editing JSON files manually will result in permanent loss of changes when running the pull command, as the `/locales` directory is not committed to git.

1. Sign in to the [i18nexus platform](https://app.i18nexus.com/sign-in) with the provided account.
2. Make changes on the platform. The free plan has a limit on translation strings, preventing the addition of new ones. An "archive (not used anywhere)" namespace is available for moving and editing unused translations.
3. Sync changes by running:
```bash
i18nexus pull
```
## ATTACHMENT II - LOGIN CREDENTIALS
## ATTACHMENT III - CODE FILES