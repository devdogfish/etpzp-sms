"use client";

import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  Maximize2,
  Minimize2,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/headers";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLayout } from "@/contexts/use-layout";
import { useIsMobile } from "@/hooks/use-mobile";

import Skeleton from "react-loading-skeleton";
import { cn } from "@/lib/utils";

const PULSE_BODY_WIDTH = "70%";
const PULSE_SUBJECT_WIDTH = "25%";

export default function Loading() {
  const { t } = useTranslation(["new-message-page"]);
  const router = useRouter();
  const { isFullscreen, setIsFullscreen } = useLayout();

  const onMobile = useIsMobile();

  return (
    <div className="">
      <PageHeader title={t("header")} skeleton>
        <p>{t("common:loading")}</p>
        {!onMobile && (
          <Button variant="ghost" size="icon" disabled>
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}

        <Button
          variant="ghost"
          className={cn(buttonVariants({ variant: "ghost" }), "aspect-1 p-0")}
          disabled
        >
          <X className="h-4 w-4" />
        </Button>
      </PageHeader>
      <div className="h-screen flex flex-col">
        <div className="flex flex-col h-[calc(100vh-var(--header-height))]">
          <div className="flex flex-col px-4 mt-2">
            <div className={cn("border-b focus-within:border-black")}>
              <Select name="sender" defaultValue="ETPZP" disabled>
                {/** It defaults to the first SelectItem */}
                <SelectTrigger className="w-full rounded-none border-none shadow-none focus:ring-0 px-5 py-1 h-11">
                  <SelectValue placeholder="ETPZP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETPZP">ETPZP</SelectItem>
                  <SelectItem value="Test">Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <InputSkeleton title={t("common:to")} />
            <InputSkeleton />
          </div>
          <div className="px-4 flex-grow mt-[1.25rem] mb-2 w-full">
            <span className="mb-1 flex items-center text-sm text-muted-foreground flex-1 min-w-8">
              <Skeleton
                height={16}
                containerClassName={`min-w-[${PULSE_BODY_WIDTH}]`}
              />
            </span>
          </div>

          <Separator />
          <div className="flex px-4 py-2 justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              className="w-max"
              disabled
            >
              <Trash2 className="h-4 w-4" />
              {t("discard")}
            </Button>

            <div className="flex">
              <Button
                className="rounded-tr-none rounded-br-none border-primary-foreground border-r"
                disabled
              >
                <Send className="w-4 h-4" />
                {t("submit_btn-normal")}
              </Button>
              <div
                className={cn("flex gap-3 items-center justify-start w-full")}
              >
                <Button
                  className="px-[1px] rounded-tl-none rounded-bl-none shadow-none"
                  type="button"
                  disabled
                >
                  <ChevronDown className={cn("h-4 w-4 transition-transform")} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputSkeleton({ title }: { title?: string }) {
  return (
    <div className="flex-1 py-1 relative ">
      <div className="max-h-24 overflow-auto">
        <div className="w-full flex flex-wrap items-center gap-x-1 py-1 h-full border-b px-5 z-50 min-h-[45px]">
          {title ? (
            <span className="my-0.5 mr-0.5 px-0 flex items-center text-sm text-muted-foreground">
              {title}
            </span>
          ) : (
            <span className="mb-1 flex items-center text-sm text-muted-foreground flex-1 min-w-8">
              <Skeleton
                height={16}
                width=""
                containerClassName={`min-w-[${PULSE_SUBJECT_WIDTH}]`}
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
