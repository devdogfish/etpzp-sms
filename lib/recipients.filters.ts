import { DBContactRecipient } from "@/types/recipient";

export function getProcessedRecipients(
  data: (DBContactRecipient & { last_used: Date })[]
): Record<string, DBContactRecipient[]> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const processedData = data.reduce((acc, item) => {
    if (!acc[item.phone]) {
      acc[item.phone] = {
        id: item.id,
        phone: item.phone,
        contact_name: item.contact_name,
        contact_id: item.contact_id,
        contact_description: item.contact_description,
        usage_count: 0,
      };
    }

    if (new Date(item.last_used) >= oneWeekAgo) {
      acc[item.phone].usage_count++;
    }

    return acc;
  }, {} as Record<string, DBContactRecipient & { usage_count: number }>);

  return {
    alphabetical: Object.values(processedData),
    mostUsed: Object.values(processedData).sort((a, b) => {
      // Sort by usage count (descending)
      if (b.usage_count !== a.usage_count) {
        return b.usage_count - a.usage_count;
      }
      // Then by whether they have contact info
      if (!!b.contact_name !== !!a.contact_name) {
        return b.contact_name ? 1 : -1;
      }
      // Then alphabetically by contact name or phone
      return (a.contact_name || a.phone).localeCompare(
        b.contact_name || b.phone
      );
    }),
  };
}

