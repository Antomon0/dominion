import { injectable } from "inversify";
import * as https from 'https';
import { CardCollection } from "../../interfaces/CardCollection";

@injectable()
export class ScryfallApiService {

    constructor() {
    }

    getCollection(names: string[]): Promise<CardCollection> {
        if (names.length > 50) {
            throw new Error('Collection was too big, keep it at 50 or less');
        }

        return new Promise((resolve, reject) => {
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
                    const cards: CardCollection = JSON.parse(buffer.join(''));
                    if (!cards.not_found || cards.not_found.length === 0 && res.statusCode === 200) {
                        resolve(cards);
                    } else {
                        reject(cards);
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });
            req.write(data);
            req.end();
        })
    }

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