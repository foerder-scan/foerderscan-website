import { z } from "zod";

export const registerSchema = z.object({
  name:     z.string().min(2, "Name muss mindestens 2 Zeichen haben").max(100),
  email:    z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen haben").max(128),
  company:  z.string().max(200).optional(),
  role:     z.enum(["BERATER_FREE", "ENDKUNDE"]).optional(),
});

export const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  company: z.string().max(200).optional(),
  message: z.string().min(10, "Nachricht zu kurz").max(2000),
  type:    z.enum(["demo", "info", "feedback", "enterprise"]).default("info"),
});

export const projektSchema = z.object({
  titel:       z.string().min(2, "Titel zu kurz").max(200),
  kundeName:   z.string().min(2).max(200),
  kundeEmail:  z.string().email().optional().or(z.literal("")),
  strasse:     z.string().max(200).optional(),
  plz:         z.string().regex(/^\d{5}$/, "Ungültige PLZ").optional().or(z.literal("")),
  ort:         z.string().max(100).optional(),
  gebaeudetyp: z.enum(["EFH", "ZFH", "MFH", "NWG"]),
  baujahr:     z.number().int().min(1800).max(2030).nullable().optional(),
  notizen:     z.string().max(2000).optional(),
  status:      z.enum(["RECHERCHE", "ANTRAG_GESTELLT", "ZUGESAGT", "ABGERECHNET", "ABGEBROCHEN"]).optional(),
});

export const foerderungSchema = z.object({
  projektId:         z.string().cuid(),
  programmId:        z.string().cuid(),
  beantragterBetrag: z.number().positive().nullable().optional(),
  aktiveBonus:       z.array(z.string()).optional(),
  notizen:           z.string().max(1000).optional(),
});

export type RegisterInput  = z.infer<typeof registerSchema>;
export type ContactInput   = z.infer<typeof contactSchema>;
export type ProjektInput   = z.infer<typeof projektSchema>;
export type FoerderungInput = z.infer<typeof foerderungSchema>;
