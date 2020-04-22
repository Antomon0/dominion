import { injectable } from "inversify";
import * as fs from 'fs';
import { Cards } from "../../interfaces/cards";
import { Card } from "../src/Card";

@injectable()
export class CacheService {

    cachedCards: Map<string, Object>;

    constructor() {
        this.cachedCards = new Map<string, Card>();
    }

    getCard(name: string): Object | undefined {
        let card = this.cachedCards.get(name);
        if (!card) {
            const data = fs.readFileSync('../json/cards.json', 'utf8');
            let cards: Cards = JSON.parse(data);
            card = cards[name]
        }
        return card;
    }
}