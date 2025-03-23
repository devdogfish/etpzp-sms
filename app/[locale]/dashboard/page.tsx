import UnauthorizedPage from "@/components/403";
import CountryMessagesChart from "@/components/admin-dashboard/country-messages";
import MessageHistoryChart from "@/components/admin-dashboard/message-history";
import UserRanking from "@/components/admin-dashboard/user-ranking";
import { PageHeader } from "@/components/header";
import Account from "@/components/shared/account";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { getSession } from "@/lib/auth/sessions";
import { fetchMessages, fetchUsers } from "@/lib/db/dashboard";
import { fetchSentIn } from "@/lib/db/message";
import { cn } from "@/lib/utils";
import { DBMessage } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getSession();
  // Prevent non-admins from viewing the admin-dashboard and display an authorization message.
  if (!session?.isAdmin) return <UnauthorizedPage />;

  const messages = await fetchMessages();
  const users = await fetchUsers();
  const messageCounts = countMessages(messages || []);

  if (messages) {
    console.log("messages", messages);

    console.log("chart data:", transformMessagesToChartData(messages));
  }

  const res = await fetch(`${process.env.GATEWAYAPI_URL}/api/usage/labels`, {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.GATEWAYAPI_TOKEN}`,
      Accept: "application/json, text/javascript",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "2025-01-01",
      to: format(new Date(), "yyyy-MM-dd"),
    }),
  });
  const resJson = await res.json();
  console.log(res);
  console.log(resJson);

  return (
    <div className="flex flex-col">
      <PageHeader
        title={`Welcome to the Dashboard, ${session.user?.first_name}`}
        marginRight={false}
      >
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "ml-4 mr-auto")}
        >
          Back to Application
        </Link>
        <Account />
      </PageHeader>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Sent Today</CardTitle>
            </CardHeader>
            <CardContent>{messageCounts.today}</CardContent>
          </Card>
          <Card>
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
          </Card>
          <div className="col-span-3">
            <div className="h-min">
              <MessageHistoryChart
                data={transformMessagesToChartData(messages || [])}
              />
            </div>
          </div>
          <div className="col-span-2">
            <UserRanking users={users || []} messages={messages || []} />
          </div>
          <CountryMessagesChart
          // data={resJson
          //   .filter(
          //     (country: { label: string | null }) => country.label === null
          //   )
          //   .map(
          //     (item: {
          //       amount: number;
          //       cost: number;
          //       country: string;
          //       currency: string;
          //       label: null;
          //     }) => ({
          //       country: item.country,
          //       cost: item.cost,
          //       amount: item.amount,
          //     })
          //   )}
          // data={[
          //   {
          //     amount: 116,
          //     cost: 7.4472,
          //     country: "DE",
          //   },
          //   {
          //     amount: 7,
          //     cost: 0.147,
          //     country: "PT",
          //   },
          // ]}
          />
        </div>
      </div>
    </div>
  );
}

const transformMessagesToChartData = (
  messages: DBMessage[]
): { date: string; price: number; amount: number }[] => {
  const chartDataMap: {
    [key: string]: { totalCost: number; messageCount: number };
  } = {};

  messages.forEach((message) => {
    // Format the date to YYYY-MM-DD
    const date = message.send_time.toISOString().split("T")[0];

    // Initialize the entry for the date if it doesn't exist
    if (!chartDataMap[date]) {
      chartDataMap[date] = { totalCost: 0, messageCount: 0 };
    }

    // Increment the message count
    chartDataMap[date].messageCount += 1;

    // Add to the total cost if the cost is not null
    if (message.cost) {
      // Ensure cost is treated as a number
      const costValue =
        typeof message.cost === "string"
          ? parseFloat(message.cost)
          : message.cost;
      chartDataMap[date].totalCost += costValue;
    }
  });

  // Convert the map to an array
  return Object.entries(chartDataMap).map(([date, counts]) => ({
    date,
    price: counts.totalCost,
    amount: counts.messageCount,
  }));
};

function countMessages(messages: DBMessage[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  const counts = {
    today: 0,
    last7Days: 0,
    last3Months: 0,
  };

  messages.forEach((message) => {
    const sentAt = new Date(message.send_time);

    // Count messages sent today
    if (sentAt >= todayStart) {
      counts.today++;
    }

    // Count messages sent in the last 7 days
    if (sentAt >= sevenDaysAgo) {
      counts.last7Days++;
    }

    // Count messages sent in the last 3 months
    if (sentAt >= threeMonthsAgo) {
      counts.last3Months++;
    }
  });

  return counts;
}
