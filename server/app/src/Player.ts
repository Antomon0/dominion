import { injectable, inject } from "inversify";
import { Card } from "../../interfaces/Card";
import { Deck } from "./Deck";
import types from "../config/types";


@injectable()
export class Player {

    private life: number;
    private hand: Card[]


    constructor(
        @inject(types.Deck) public deck: Deck,
    ) {
        this.life = 40;
        this.hand = [];
    }

    getLife(): number {
        return this.life;
    }

    getHand(): Card[] {
        return this.hand;
    }
}