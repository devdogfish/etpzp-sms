import { Button, buttonVariants } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { i18nConfig } from "@/i18n.config";

export default async function NotFound() {
  // we have to get it directly from the cookie here, because we are not in the [locale] route segment
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get("NEXT_LOCALE");

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1">
        Current Locale {currentLocale?.value.toString()}
        <Frown className="text-muted-foreground h-10 w-10 stroke-[1.2px]" />
        <div className="flex flex-col items-center">
          <h2>404 Not Found!</h2>
          <p className="text-sm">Could not find the requested resource.</p>
        </div>
      </div>
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        Go Back
      </Link>
    </div>
  );
}
