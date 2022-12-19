import * as Drash from "drash/mod.ts";
import {
    crypto
} from "$std/crypto/mod.ts";
import { deta } from "@lib/deta.ts";
import { IEvent, EventSchema } from "@lib/events/IEvent.ts";
import { ILogEvent } from "@lib/events/ILog.ts";
import { IMetric } from "@lib/events/IMetric.ts";
import { ParsedBody } from "drash/src/http/request.ts";
import { IError, IResponse } from "@lib/IResponse.ts";

const db = deta.Base("events");

export class IngestResource extends Drash.Resource {
    public paths = [
        "/api/ingest/:ingestType",
        "/ingest/:ingestType"
    ];

    public async POST(
        request: Drash.Request,
		response: Drash.Response,
	): Promise<void> {
        const ingestType = request.pathParam("ingestType");
        
        if (ingestType !== "event" && ingestType !== "log" && ingestType !== "metric") {
            return response.json({ ok: false, error: "Invalid ingest endpoint!" } as IError, 404);
        }

        const apiKey = request.headers.get("X-Api-Key");
        if (!apiKey) {
            return response.json({ ok: false, error: "Missing X-Api-Key header!" } as IError, 401);
        }

        let bodyParams: IEvent | ILogEvent | ParsedBody;
        
        switch (ingestType) {
            case "event":
                bodyParams = request.bodyAll<IEvent>();
                break;
            case "log":
                bodyParams = request.bodyAll<ILogEvent>();
                break;
            case "metric":
                bodyParams = request.bodyAll<IMetric>();
                break;
        }

        if (ingestType === "event") {
            try {
                const event = EventSchema
                    .omit({ id: true })
                    .parse(bodyParams) as IEvent;
                
                event.id = crypto.randomUUID(); // TODO(@maxi): Switch to UUIDv7
                try {
                    // @ts-ignore -> Deta SDK shitting itself but we good :)
                    await db.put(event, event.id);
                }
                catch (err) {
                    if (request.accepts("application/json"))
                        return response.json({ ok: false, error: err } as IError, 500);
                    else
                        return response.text(`Oops, something went wrong :/ ${err}`, 500);
                }
            }
            catch (err) {
                return response.json({ ok: false, error: err } as IError, 400);
            }
        }
        

        // "Calculate" sender IP hash
        /*const origin = request.headers.has("x-forwarded-for") ? request.headers.get("x-forwarded-for") : request.headers.get("origin");        
        const sender = toHashString(await crypto.subtle.digest(
            "SHA-384",
            new TextEncoder().encode(origin || "null")
        ));

        // -> We don't know what the user will send
        // deno-lint-ignore no-explicit-any 
        const bodyParams = request.bodyAll<any>();
        // -> We don't know what the user will send
        // deno-lint-ignore no-explicit-any 
        const collectedFieldNames = Object.keys(request.bodyAll<any>()).filter(e => e.startsWith("collect_"));
        const collectedFields = new Map<string, unknown>();
        collectedFieldNames.forEach(name => {
            collectedFields.set(name.slice(collectPrefix.length), bodyParams[name]);
        })

        // TODO(@max): Add typing dev transform for now
        const fields: { [key: string]: IField } = {};
        collectedFields.forEach((value, key) => { fields[key] = { type: "text", value } });

        // Create & insert new submission
        const submission: ISubmission = {
            id: crypto.randomUUID(),
            createdAt: Date.now(),

            sender,
            formId,
            read: false,
            closed: false,

            fields: fields,
        }
        
        try {
            // @ts-ignore -> Deta SDK shitting itself but we good :)
            await db.put(submission, submission.id);
        }
        catch (err) {
            if (request.accepts("application/json"))
                return response.json({ ok: false, error: err } as IError, 500);
            else
                return response.text(`Oops, something went wrong :/ ${err}`, 500);
        }
*/
        return response.json({ ok: true } as IResponse);        
    }

}