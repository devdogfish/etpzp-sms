"use client";

import MessagePieChart from "@/components/admin-dashboard/message-pie-chart";
import MessageAreaChart from "@/components/admin-dashboard/message-area-chart";
import UserRankingTable from "@/components/admin-dashboard/user-table";
import { PageHeader } from "@/components/headers";
import Account from "@/components/shared/account";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/contexts/use-settings";
import { cn, extractFirstWord, getPercentageChange } from "@/lib/utils";
import { DBUser } from "@/types/user";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CountryStat } from "../../app/[locale]/dashboard/page";
import { LightDBMessage } from "@/types/dashboard";
import { ScrollArea } from "../ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";

export type TimeRange = {
  from: Date;
  to: Date;
};

export default function AdminDashboard({
  messages,
  users,
  countryStats,
}: {
  messages: LightDBMessage[];
  users: DBUser[];
  countryStats: CountryStat[] | undefined;
}) {
  const { t } = useTranslation(["dashboard-page", "errors", "common"]);
  const messageCounts = countMessages(messages);
  const { settings } = useSettings();
  const onMobile = useIsMobile();
  const onBigScreen = false;

  return (
    <div className="flex flex-col">
      <PageHeader
        title={
          onBigScreen
            ? t("header_long", {
                first_name: settings.displayName
                  ? extractFirstWord(settings.displayName)
                  : "user",
              })
            : t("header")
        }
        marginRight={onMobile}
      >
        {!onMobile && (
          <>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "link" }), "mx-2")}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back_to_app")}
            </Link>

            <Account className="ml-auto" profilePicPosition="RIGHT" />
          </>
        )}
      </PageHeader>

      <ScrollArea
        /** We always want simple header height here due to only having 1 simple nav-panel, regardless of any layout*/
        className="h-[calc(100vh-var(--simple-header-height))]"
      >
        <div className="p-4" /* Inside looks better with rimless bottom */>
          <div className="flex flex-col md:grid grid-cols-3 gap-4">
            <TextCard
              label={t("text_card_1-title")}
              value={messageCounts.today}
              caption={
                getPercentageChange(
                  messageCounts.today,
                  messageCounts.todayBefore
                ) < 0
                  ? // Negative change (lower than before)
                    t("text_card_1-caption_lower", {
                      percentage: `${
                        getPercentageChange(
                          messageCounts.today,
                          messageCounts.todayBefore
                        ) * -1
                      }%`,
                    })
                  : // Positive change (higher than before)
                    t("text_card_1-caption_higher", {
                      percentage: `${getPercentageChange(
                        messageCounts.today,
                        messageCounts.todayBefore
                      )}%`,
                    })
              }
            />
            <TextCard
              label={t("text_card_2-title")}
              value={messageCounts.last7Days}
              caption={
                getPercentageChange(
                  messageCounts.last7Days,
                  messageCounts.last7DaysBefore
                ) < 0
                  ? // Negative change (lower than before)
                    t("text_card_2-caption_lower", {
                      percentage: `${
                        getPercentageChange(
                          messageCounts.last7Days,
                          messageCounts.last7DaysBefore
                        ) * -1
                      }%`,
                    })
                  : // Positive change (higher than before)
                    t("text_card_2-caption_higher", {
                      percentage: `${getPercentageChange(
                        messageCounts.last7Days,
                        messageCounts.last7DaysBefore
                      )}%`,
                    })
              }
            />
            <TextCard
              label={t("text_card_3-title")}
              value={messageCounts.lastMonth}
              caption={
                getPercentageChange(
                  messageCounts.lastMonth,
                  messageCounts.lastMonthBefore
                ) < 0
                  ? // Negative change (lower than before)
                    t("text_card_3-caption_lower", {
                      percentage: `${
                        getPercentageChange(
                          messageCounts.lastMonth,
                          messageCounts.lastMonthBefore
                        ) * -1
                      }%`,
                    })
                  : // Positive change (higher than before)
                    t("text_card_3-caption_higher", {
                      percentage: `${getPercentageChange(
                        messageCounts.lastMonth,
                        messageCounts.lastMonthBefore
                      )}%`,
                    })
              }
            />
            {/* <Card>
            <CardHeader>
              <CardTitle>Sent This week</CardTitle>
            </CardHeader>
            <CardContent>{messageCounts.last7Days}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sent This Month</CardTitle>
            </CardHeader>
            <CardContent>{messageCounts.last3Months}</CardContent>
          </Card> */}
            <div className="col-span-3">
              <div className="h-min">
                <MessageAreaChart messages={messages || []} />
              </div>
            </div>
            <div className={cn("col-span-2", onMobile && "order-6")}>
              <UserRankingTable users={users || []} messages={messages || []} />
            </div>
            <MessagePieChart data={countryStats} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function TextCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string | number;
  caption: string;
}) {
  return (
    <Card className="min-h-min">
      <CardContent className="p-6 flex flex-col gap">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <h1 className="leading-tight">{value}</h1>
        <p className="text-sm text-muted-foreground">{caption}</p>
      </CardContent>
    </Card>
  );
}

function countMessages(messages: LightDBMessage[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);
  const yesterdayEnd = new Date(todayStart);
  yesterdayEnd.setDate(todayStart.getDate() - 1);
  yesterdayEnd.setHours(23, 59, 59, 999); // End of yesterday

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const weekBeforeStart = new Date(sevenDaysAgo);
  weekBeforeStart.setDate(sevenDaysAgo.getDate() - 7); // Start of the week before last 7 days

  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);
  const oneMonthBeforeStart = new Date(oneMonthAgo);
  oneMonthBeforeStart.setMonth(oneMonthAgo.getMonth() - 1); // Start of the 3 months before last 3 months

  const counts = {
    today: 0,
    todayBefore: 0,
    last7Days: 0,
    last7DaysBefore: 0, // New property for the week before last 7 days
    lastMonth: 0,
    lastMonthBefore: 0, // New property for the 3 months before last 3 months
  };

  messages.forEach((message) => {
    const sentAt = new Date(message.send_time);

    // Count messages sent today
    if (sentAt >= todayStart) {
      counts.today++;
    }
    // Count messages sent yesterday
    if (sentAt >= yesterdayStart && sentAt <= yesterdayEnd) {
      counts.todayBefore++;
    }

    // Count messages sent in the last 7 days
    if (sentAt >= sevenDaysAgo) {
      counts.last7Days++;
    }
    // Count messages sent in the week before the last 7 days
    if (sentAt >= weekBeforeStart && sentAt < sevenDaysAgo) {
      counts.last7DaysBefore++;
    }

    // Count messages sent in the last 3 months
    if (sentAt >= oneMonthAgo) {
      counts.lastMonth++;
    }
    // Count messages sent in the 3 months before the last 3 months
    if (sentAt >= oneMonthBeforeStart && sentAt < oneMonthAgo) {
      counts.lastMonthBefore++;
    }
  });

  return counts;
}
