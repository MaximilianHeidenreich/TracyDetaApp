import { z } from "zod";

/**
 * An event is the smalles, most basic unit of data in the system.
 * It is immutable and the basis for all other data.
 * 
 * @property id - UUID of the event
 * @property timestamp - Unix epoch milliseconds
 * @property entityId - ID of the entity the event belongs to
 * @property eventType - String identifying the type of event (Only alphanumerical, :, ., _)
 * @property attributes - Custom attributes
 */
export interface IEvent {
    id: string;
    timestamp: number;
    entityId: string;

    eventType: string;
    attributes?: Record<string, unknown>;
}

export const EventSchema = z.object({
    id: z.string().uuid(),
    timestamp: z.number().int(),

    eventType: z.string()
                .max(255)
                .refine((val) => /^[a-zA-Z0-9:._]+$/.test(val),{
                    /*code: z.ZodIssueCode.custom,
                    maximum: 255,
                    type: "string",
                    inclusive: true,*/
                    message: "eventType cannot be longer than 255 characters!",  
                }),
    attributes: z.record(z.unknown()).optional(),
}).strict();
