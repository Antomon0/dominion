import types from "../config/types";
import { ScryfallApiService } from "../services/ScryfallApiService";
import { CardCollection } from "../../interfaces/CardCollection";
import { Observable, Subject } from 'rxjs';
import { injectable, inject } from "inversify";
import { Card } from "../../interfaces/Card";

@injectable()
export class Deck {
    private deck: Card[];

    private commanderNames: string[];

    private commanders: Card[];

    private finishedAssembling: Subject<any>;
    finishedAssemblingDeck: Observable<any>;


    constructor(
        @inject(types.Scryfall) private api: ScryfallApiService,
    ) {
        this.commanderNames = [];
        this.commanders = [];
        this.deck = [];
        this.finishedAssembling = new Subject();
        this.finishedAssemblingDeck = this.finishedAssembling.asObservable();
    }

    getDeck(): Card[] {
        return this.deck;
    }

    getCommanders(): Card[] {
        return this.commanders;
    }

    resetDeck(): void {
        this.commanderNames = [];
        this.commanders = [];
        this.deck = [];
    }

    // TODO add some cache thing or the cards to not spam scryfall.
    assembleDeck(deck: string[]): void {
        const infoMap: Map<string, number> = this.convertDeckToMap(deck);
        const names = Array.from(infoMap.keys());
        this.api.getCollection(names.slice(0, 50))
            .then((cards) => {
                this.addCardsToDeck(cards, infoMap);
            })
            .catch((error) => {
                console.log('There was an error while getting cards :', error);
            });
        this.api.getCollection(names.slice(50, names.length))
            .then((cards) => {
                this.addCardsToDeck(cards, infoMap);
            })
            .catch((error) => {
                console.log('There was an error while getting cards :', error);
            });
    }

    sortDeckByType(): void {
        this.deck.sort((card1, card2) => {
            if (card1.type_line > card2.type_line) {
                return 1;
            } else if (card1.type_line < card2.type_line) {
                return -1;
            }
            return 0;
        });
    }

    private convertDeckToMap(deck: string[]): Map<string, number> {
        const map = new Map<string, number>();
        deck.forEach((info: string) => {
            if (info.search(new RegExp('^[0-9]{1,2} .+$')) !== -1) {
                const split = info.split(' ');
                const quantity = Number(split[0]);
                let name = split.slice(1, split.length).join(' ');
                if (name.includes('*CMDR*')) {
                    name = name.substring(0, name.indexOf('*CMDR*') - 1);
                    this.commanderNames.push(name);
                }
                map.set(name, quantity);
            }
        });
        return map;
    }

    private addCardsToDeck(cards: CardCollection, infoMap: Map<string, number>): void {
        cards.data.forEach((card) => {
            const quantity = infoMap.get(card.name)
            if (this.commanderNames.includes(card.name)) {
                this.commanders.push(card);
            } else if (quantity) {
                for (let i = 0; i < quantity; i++) {
                    this.deck.push(card);
                }
            } else {
                this.deck.push(card);
            }
        });
        this.checkIfDeckIsComplete();
    }
    private checkIfDeckIsComplete(): void {
        if (this.commanders.length > 0 && this.deck.length === 100 - this.commanders.length) {
            this.sortDeckByType();
            const uris: string[] = [];
            this.commanders.forEach((commander) => {
                this.getCardUri(commander, uris);
            })
            this.deck.forEach((card) => {
                this.getCardUri(card, uris);
            });
            this.finishedAssembling.next(uris);
        }
    }

    private getCardUri(card: Card, uris: string[]): void {
        if (card.image_uris) {
            uris.push((card.image_uris.normal) ? card.image_uris.normal : '');
        } else if (card.card_faces) {
            card.card_faces.forEach((face) => {
                if (face.image_uris) {
                    uris.push((face.image_uris.normal) ? face.image_uris.normal : '');
                }
            });
        }
    }

}
