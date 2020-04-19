export class Card {
    name: string;
    cmc: string;
    type: string;
    subtype: string;

    constructor() {
        this.name = 'lightning bolt';
        this.cmc = 'r';
        this.type = 'instant';
        this.subtype = '';
    }
}