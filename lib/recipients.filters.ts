import {
  DBContactRecipient,
  ProcessedDBContactRecipient,
} from "@/types/recipient";

export function processRecipients(
  data: (DBContactRecipient & { last_used: Date })[]
): ProcessedDBContactRecipient[] {
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

  return Object.values(processedData);
}

export function calcTopRecipients(
  recipients: ProcessedDBContactRecipient[],
  limit = 5
): ProcessedDBContactRecipient[] {
  return recipients
    .sort((a, b) => {
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
    })
    .slice(0, limit);
}

// OLD ALGORITHM
// // Simple algorithm for recommending the top most used recipients based on quality (if has contact) and quantity (how often sent to)
// export function recommendRecipients(
//   recipients: SuggestedRecipient[],
//   limit = 5
// ): SuggestedRecipient[] {
//   // Calculate the maximum usage count for normalization
//   const maxUsage = Math.max(...recipients.map((r) => r.usageCount));

//   // Score each recipient
//   const scoredRecipients = recipients.map((recipient) => {
//     // Normalize usage count (0-1 range)
//     const quantityScore = recipient.usageCount / maxUsage;

//     // Quality score: 1 if contact name exists, 0 otherwise
//     const qualityScore = recipient.contact_name ? 1 : 0;

//     // Combined score (equal weight to quantity and quality)
//     const score = (quantityScore + qualityScore) / 2;

//     return { ...recipient, score };
//   });

//   // Sort by score (descending) and take the top 'limit' results
//   return scoredRecipients.sort((a, b) => b.score - a.score).slice(0, limit);
// }
