"use client";

import { cn, getNameInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Account({
  size,
  name,
  colorId,
  loading,
}: {
  size: number;
  colorId: number | undefined;
  name: string | undefined;
  loading?: boolean;
}) {
  const router = useRouter();

  if (loading) return <h2 className="text-sm">Loading...</h2>;
  return (
    <div
      className={`w-${size} h-${size} rounded-full content-center bg-chart-${colorId}`}
    >
      <p className="text-sm">{getNameInitials(name)}</p>
    </div>
  );
}
