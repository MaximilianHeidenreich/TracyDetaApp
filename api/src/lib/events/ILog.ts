import { z } from "zod";
import { IEvent, EventSchema } from "./IEvent.ts";

export interface ILogEvent extends IEvent {
    eventType: "_log";
    logType?: string;
    message?: string;
}

export const LogEventSchema = z.intersection(EventSchema, z.object({
    eventType: z.literal("log"),
    logType: z.string().max(255),
    message: z.string().optional()
}));