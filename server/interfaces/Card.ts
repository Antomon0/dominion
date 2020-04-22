// This is derived from the card json format https://api.scryfall.com/cards/
// returns, striped down to necessary things for this

import { CardFace } from "./cardface";

export interface Card {
    "object": string;
    "id": string;
    "name": string;
    "layout": string;
    "oracle_id": string;
    "card_faces": CardFace[] | null;
    "color_identity": string[];
    "legalities": Object;
    "loyalty": string | null;
    "mana_cost": string | null;
    "oracle_text": string | null;
    "power": string | null;
    "toughness": string | null;
    "type_line": string;
    "flavor_text": string | null;
    "image_uris": Object | null;
}