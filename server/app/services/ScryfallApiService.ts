import { injectable } from "inversify";
import * as https from 'https';
import { Card } from "../../interfaces/Card";

@injectable()
export class ScryfallApiService {

    constructor() {
    }

    getCard(name: string): void {
        let buffer: Buffer[] = [];
        const req = https.request(this.getOptions(name), (res) => {
            res.on('data', (data) => {
                buffer.push(data);
            });
            res.on('end', () => {
                const card: Card = JSON.parse(buffer.join(''));
                console.log(card);
            });
        });

        req.on('error', error => {
            console.error(error)
        });

        req.end();
    }

    getCollection(names: string[]): void {
        if (names.length <= 50) {
            const data = JSON.stringify({
                identifiers: names.map((name) => {
                    return { "name": name }
                })
            });
            let buffer: Buffer[] = [];
            const req = https.request(this.postOptions(data), (res) => {
                res.on('data', (data) => {
                    buffer.push(data);
                });
                res.on('end', () => {
                    const card: Card[] = JSON.parse(buffer.join(''));
                    console.log(card);
                });
            });

            req.on('error', (error) => {
                console.error(error);
            });
            req.write(data);
            req.end();

        } else {
            console.log('Collection was too big keep it at 50 or less')
        }
    }

    private getOptions = (name: string) => {
        return {
            hostname: 'api.scryfall.com',
            path: `/cards/named?exact=${name.replace(' ', '+')}`,
            method: 'GET',
        }
    };

    private postOptions = (data: string) => {
        return {
            hostname: 'api.scryfall.com',
            path: '/cards/collection',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
    };

}