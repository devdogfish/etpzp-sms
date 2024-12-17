"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input as ShadcnInput } from "./ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";

// interface NewMessageFormInputProps {
//   name: FieldPath<z.infer<typeof NewMessageFormSchema>>;
//   control: Control<z.infer<typeof NewMessageFormSchema>>;
//   type: string;
//   label?: string;
//   placeholder?: string;
//   className?: string;
//   disabled?: boolean;
// }

// export function NewMessageInput({
//   type,
//   name,
//   label,
//   placeholder,
//   control,
//   className,
//   disabled,
// }: NewMessageFormInputProps) {
//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           {!!label && <FormLabel>{label}</FormLabel>}
//           <div className="flex w-full flex-col">
//             <FormControl>
//               <ShadcnInput
//                 placeholder={placeholder}
//                 type={type}
//                 className={className}
//                 disabled={disabled}
//                 {...field}
//               />
//             </FormControl>
//             <FormMessage />
//           </div>
//         </FormItem>
//       )}
//     />
//   );
// }

interface AuthInputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
}

export function AuthInput<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: AuthInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <ShadcnInput {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}