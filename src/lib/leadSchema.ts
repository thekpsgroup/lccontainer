import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  phone: z.string().min(7).max(30),
  interest: z.enum([
    "Buy - 20'", "Buy - 40'", "Buy - 40' High Cube",
    "Lease", "Custom Build", "Not sure"
  ]),
  zip: z.string().regex(/^\d{5}$/,"ZIP must be 5 digits"),
  notes: z.string().max(2000).optional(),
  // anti-bot
  website: z.string().max(0).optional(),   // honeypot must be empty
  startedAt: z.string().optional()         // timestamp to enforce min fill time
});
export type LeadPayload = z.infer<typeof leadSchema>;
