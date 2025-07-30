import { z } from "zod";
import { passwordRules } from "./passwordRules";

export const schema = z
  .object({
    studentId: z.string().min(1, "Student ID is required"),
    firstName: z.string().min(1, "Full name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .refine((val) => passwordRules.every((rule) => rule.test(val)), {
        message: "Password does not meet all requirements",
      })
      .superRefine((val, ctx) => {
        for (const rule of passwordRules) {
          const result = rule.zod(val);
          if (result !== true) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: result,
            });
          }
        }
      }),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    nda: z.literal(true, {
      errorMap: () => ({
        message: "You must agree to the Non-Disclosure Agreement",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormData = z.infer<typeof schema>;

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;
