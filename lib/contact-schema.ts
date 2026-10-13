import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (2+ characters).")
    .max(80, "Name is too long."),
  email: z.email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "A little more detail, please (20+ characters).")
    .max(2000, "Please keep it under 2000 characters."),
});

export type ContactFields = z.infer<typeof contactSchema>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof ContactFields, string>>;
      values?: Partial<ContactFields>;
    };
