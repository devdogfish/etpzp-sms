import { z } from "zod";

// Our one source of truth is the form schema. When you create a new field, add it here.
export const newMessageFormSchema = z.object({
  from: z.string(),
  to: z.string().email(),
  subject: z.string(),
  message: z.string(),
});

export const authFormSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string(),
});

/*
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <FormInput
      type="text"
      name="username"
      label="Username"
      placeholder="Enter your username"
      className=""
      control={form.control}
    />
    <FormInput
      type="password"
      name="password"
      label="Password"
      placeholder="Enter your password"
      className=""
      control={form.control}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form> 
*/
