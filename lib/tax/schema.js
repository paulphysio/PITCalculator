import { z } from "zod";

export const taxInputSchema = z.object({
  grossIncome: z.coerce.number().positive("Gross income must be greater than 0"),
  pensionContribution: z.coerce.number().min(0, "Cannot be negative").default(0),
  nhfContribution: z.coerce.number().min(0, "Cannot be negative").default(0),
  lifeAssurancePremium: z.coerce.number().min(0, "Cannot be negative").default(0),
}).refine(
  (data) =>
    data.pensionContribution + data.nhfContribution + data.lifeAssurancePremium <=
    data.grossIncome,
  { message: "Total deductions cannot exceed gross income" }
);

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
