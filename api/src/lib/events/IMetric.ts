import { number, z } from "zod";
import { IEvent, EventSchema } from "./IEvent.ts";

// https://docs.newrelic.com/docs/data-apis/understand-data/metric-data/metric-data-type/

export interface IMetric extends IEvent {
    eventType: "_metric";
    name: string;
    "interval.ms": number;
    metricType: "count" | "gauge";
}