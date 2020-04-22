import { Card } from "./Card";

export interface CardCollection {
    "object": string;
    "not_found": string[];
    "data": Card[];
}