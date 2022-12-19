/**
 *  TODO: Add description
 */
export interface IAPIKey {
    keyType: "all" | "browser" | "query";
    name: string;
    apiKey: string;
    notes: string;
}