import { inject, injectable } from "inversify";
import types from "../config/types";
import { ScryfallApiService } from "../services/ScryfallApiService";
import { Card } from "../../interfaces/Card";
import { CardCollection } from "../../interfaces/CardCollection";
import { Observable, Subject } from 'rxjs';


@injectable()
export class Player {

    private life: number;
    // private hand: Card[]
    private deck: Card[];
    private commander: Card;

    private finishedAssembling: Subject<any>;
    finishedAssemblingDeck: Observable<any>;

    constructor(
        @inject(types.Scryfall) private api: ScryfallApiService,
    ) {
        this.life = 40;
        this.deck = [];
        this.finishedAssembling = new Subject();
        this.finishedAssemblingDeck = this.finishedAssembling.asObservable();
        // this.hand = [];
    }

    getLife(): number {
        return this.life;
    }

    getDeck(): Card[] {
        return this.deck;
    }

    getCommander(): Card {
        return this.commander;
    }

    assembleDeck(deck: string[]): void {

        const infoMap: Map<string, number> = new Map<string, number>();
        let commanderName: string = '';

        deck.forEach((info: string) => {
            if (info.search(new RegExp('^[0-9]{1,2}x .+$')) !== -1) {
                const split = info.split('x ');
                const quantity = Number(split[0]);
                let name = split[1];
                if (name.includes('*CMDR*')) {
                    name = name.substring(0, name.indexOf('*CMDR*') - 1);
                    commanderName = name;
                }
                infoMap.set(name, quantity);
            }
        });

        const addCardsToDeck = (cards: CardCollection) => {
            cards.data.forEach((card) => {
                const quantity = infoMap.get(card.name)
                if (card.name == commanderName) {
                    this.commander = card;
                } else if (quantity) {
                    for (let i = 0; i < quantity; i++) {
                        this.deck.push(card);
                    }
                } else {
                    this.deck.push(card);
                }
            });
            if (this.commander && this.deck.length === 99) {
                this.deck.sort((card1, card2) => {
                    if (card1.type_line > card2.type_line) {
                        return 1;
                    } else if (card1.type_line < card2.type_line) {
                        return -1;
                    }
                    return 0;
                });
                const uri = this.commander.image_uris.normal;
                const uris = [];
                uris.push((uri) ? uri : '');
                uris.concat(this.deck.map((card) => {
                    const uri = card.image_uris.normal;
                    if (uri) {
                        return uri;
                    } else {
                        return '';
                    }
                }));
                this.finishedAssembling.next(uris);
            }
        }

        const names = Array.from(infoMap.keys());
        this.api.getCollection(names.slice(0, 50))
            .then((cards) => {
                addCardsToDeck(cards);
            })
            .catch((error) => {
                console.log('There was an error while getting cards :', error);
            });
        this.api.getCollection(names.slice(50, names.length))
            .then((cards) => {
                addCardsToDeck(cards);
            })
            .catch((error) => {
                console.log('There was an error while getting cards :', error);
            });
    }
}