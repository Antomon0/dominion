import { injectable, inject } from "inversify";
import { Card } from "../../interfaces/Card";
import { Deck } from "./Deck";
import types from "../config/types";
import * as socketio from 'socket.io';
import { DeckInfo } from "../../../common/DeckInfo";

@injectable()
export class Player {

    private life: number;
    private hand: Card[]
    private isReady: boolean;

    sid: string;
    io: socketio.Socket

    constructor(
        @inject(types.Deck) public deck: Deck,
        sid: string,
        socket: socketio.Socket,
    ) {
        this.sid = sid;
        this.io = socket;
        this.isReady = false;
        this.hand = [];
        this.life = 40;

        this.deck.finishedAssemblingDeck.subscribe((completedDeckInfo: DeckInfo) => {
            this.io.emit('finishedDeck', completedDeckInfo);
            this.isReady = true;
        })

        this.io.on('deck', (deck: string[]) => {
            this.isReady = false;
            this.deck.resetDeck();
            this.deck.assembleDeck(deck);
        });
    }

    getLife(): number {
        return this.life;
    }

    getHand(): Card[] {
        return this.hand;
    }

    ready(): boolean {
        return this.isReady;
    }
}