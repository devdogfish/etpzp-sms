"use client";

import { Input } from "@/components/shared/input";
import { Search as SearchIcon } from "lucide-react";

type SearchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onSearch: (term: string) => void;
};

export default function Search({ onSearch, ...props }: SearchProps) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const handleSearch = (term: string) => {
    // update data by calling parent function
    onSearch(term);

    // Use vanilla javascript to update the url.
    // According to the Next.js docs we should use useSearchParams, usePathname, and useRouter, but that causes the component to re-render and re-fetch data.
    // For optimization purposes, we just fetch once for each page, and then filter that data using client-side javascript.

    // Update the search parameter or delete it if search bar is empty
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    // Update the URL without reloading the page
    url.search = params.toString();
    window.history.pushState({}, "", url);
  };
  return (
    <div className="p-4">
      <div className="relative">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input /** this input is not part of a form, we are just using the input element as it has handy event listeners */
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={params.get("query")?.toString()}
          {...props}
        />
      </div>
    </div>
  );
}
