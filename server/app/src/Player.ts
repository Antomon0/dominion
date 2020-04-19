import { Card } from "./Card";


export class Player {

    private life: number;
    private hand: Card[]

    constructor() {
        this.life = 40;
        this.hand = [];
        for (let i = 0; i < 7; i++) {
            this.hand.push(new Card());
        }
    }

    getLife(): number {
        return this.life;
    }
}