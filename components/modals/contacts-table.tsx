"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Contact } from "@/types";

export default function ContactsTable({
  contacts,
  variant,
}: {
  contacts: Contact[];
  variant: "sm" | "lg";
}) {
  return (
    <Table>
      {/* <TableCaption>A list of your contacts.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Contact</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone Number</TableHead>
          {variant === "lg" && (
            <>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="">Last Updated</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map(
          ({ id, name, description, phone, created_at, updated_at }) => (
            <TableRow key={id}>
              <TableCell className="font-medium">{id}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{phone}</TableCell>
              {variant === "lg" && (
                <>
                  <TableCell>{description ? description : "-"}</TableCell>
                  <TableCell>{created_at && created_at.toString()}</TableCell>
                  <TableCell className="">
                    {updated_at && updated_at.toString()}
                  </TableCell>
                </>
              )}
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}
