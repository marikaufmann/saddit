import { z } from "zod";
export const SubthreaditValidator = z.object({
  name: z.string().min(3).max(21),
});
export const SubthreaditSubscriptionValidator = z.object({
  subthreaditId: z.string(),
});
export const DeleteSubthreaditValidator = z.object({
  name: z.string(),
});
export type CreateSubthreaditPayload = z.infer<typeof SubthreaditValidator>;
export type SubscribeToSubthreaditPayload = z.infer<
  typeof SubthreaditSubscriptionValidator
>;
export type DeleteSubthreaditRequest = z.infer<
  typeof DeleteSubthreaditValidator
>;
