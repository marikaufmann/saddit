import { z } from 'zod'
export const SubsadditValidator = z.object({
	name: z.string().min(3).max(21)
})
export const SubsadditSubscriptionValidator = z.object({
	subsadditId: z.string()
})
export const DeleteSubsadditValidator = z.object({
	name: z.string()
})
export type CreateSubsadditPayload = z.infer<typeof SubsadditValidator>
export type SubscribeToSubsadditPayload = z.infer<
	typeof SubsadditSubscriptionValidator
>
export type DeleteSubsadditRequest = z.infer<typeof DeleteSubsadditValidator>