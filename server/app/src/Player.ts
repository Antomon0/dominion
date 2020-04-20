// import { Card } from "./Card";


export class Player {

    private life: number;
    // private hand: Card[]
    // private deck: Card[];


    constructor(

    ) {
        this.life = 40;
        // this.hand = [];
        // this.deck = [];
    }

    getLife(): number {
        return this.life;
    }

    assembleDeck(deck: string[]): void {
        console.log(deck);
    }

}