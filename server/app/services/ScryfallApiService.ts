import { injectable } from "inversify";
import * as https from 'https';
import { Card } from "../../interfaces/Card";

@injectable()
export class ScryfallApiService {

    constructor() {
    }

    private get = (name: string) => {
        return {
            hostname: 'api.scryfall.com',
            path: `/cards/named?exact=${name.replace(' ', '+')}`,
            method: 'GET',
        }
    };

    getCard(name: string): void {
        let buffer: Buffer[] = [];
        const req = https.request(this.get(name), (res) => {
            res.on('data', (data) => {
                buffer.push(data);
            })
            res.on('end', () => {
                const card: Card = JSON.parse(buffer.join(''));
                console.log(card);
            })
        });

        req.on('error', error => {
            console.error(error)
        });

        req.end();

    }

}