import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { NotificationService } from './notification-service.service';
import { Injectable } from '@angular/core';
import { DeckInfo } from '../../../../common/DeckInfo';

@Injectable()
export class SocketService {

    private url = 'http://localhost:3000';
    private socket: SocketIOClient.Socket;

    constructor(
        private notification: NotificationService,
    ) {
        this.socket = io(this.url);
        this.socket.on('connect', () => {
            this.notification.notify('Successfully connected to server.');
        });
        this.socket.on('connect_error', () => {
            this.notification.error('Couldn\'t connect to the server.');
        });
        this.socket.on('failedJoin', () => {
            this.notification.error('Failed joining room, it might be full.');
        });
    }

    /*******************************************/
    /*               Emissions                 */
    /*******************************************/

    joinRoom(roomName: string, username: string): void {
        this.socket.emit('join', roomName, username);
    }

    leaveRoom(): void {
        this.socket.emit('leave');
    }

    sendDeck(deck: string): void {
        try {
            const cards = deck.split('\n');
            this.checkValidCommanderDeck(cards);
            this.socket.emit('deck', cards);
        } catch (err) {
            this.notification.error(err);
        }
    }


    /*******************************************/
    /*               Receptions                */
    /*******************************************/

    joinSuccess(): Observable<string> {
        return new Observable((subscriber) => {
            this.socket.on('successfullJoin', (room: string) => {
                subscriber.next(room);
                this.notification.notify(`Successfully joined : ${room}`);
            });
        });
    }

    startGame(): Observable<any> {
        return new Observable((subscriber) => {
            this.socket.on('startGame', () => {
                subscriber.next();
            });
        });
    }

    roomInfo(): Observable<[string, number][]> {
        return new Observable((subscriber) => {
            this.socket.on('roomInfo', (roomInfo: [string, number][]) => {
                subscriber.next(roomInfo);
            });
        });
    }

    deckInfo(): Observable<DeckInfo> {
        return new Observable((subscriber) => {
            this.socket.on('finishedDeck', (uris: DeckInfo) => {
                subscriber.next(uris);
            });
        });
    }

    /**
     * @throws {Error} If the commander deck is not valid
     */
    private checkValidCommanderDeck(cards: string[]): void {
        let nbCards = 0;
        let nbCommanders = 0;
        cards.forEach((card) => {
            if (card.search(new RegExp('^[0-9]{1,2} .+$')) !== -1) {
                const qtNameSplit = card.split(' ');
                nbCards += Number(qtNameSplit[0]);
                if (qtNameSplit.slice(1, qtNameSplit.length).join(' ').includes('*CMDR*')) {
                    nbCommanders++;
                }
            }
        });
        if (nbCards !== 100) {
            throw new Error(`Invalid number of cards. You had : ${nbCards} / 100`);
        }
        if (nbCommanders <= 0 || nbCommanders > 2) {
            if (nbCommanders === 0) {
                throw new Error('You might be missing a *CMDR* in your list.');
            } else {
                throw new Error(`Invalid number of Commanders. You had : ${nbCommanders}`
                    + 'there can only be one! Or two if you have partners.');
            }
        }
    }
}
