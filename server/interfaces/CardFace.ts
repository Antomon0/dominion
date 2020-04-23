import { Images } from "./Images";

export interface CardFace {
    "colors": string | null;
    "flavor_text": string | null;
    "image_uris": Images | null;
    "loyalty": string | null;
    "mana_cost": string;
    "name": string;
    "object": string;
    "oracle_text": string | null;
    "power": string | null;
    "toughness": string | null;
    "type_line": string;
}