import * as io from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';
import { NotificationService } from './notification-service.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SocketService {

    private url = 'http://localhost:3000';
    private socket: SocketIOClient.Socket;

    constructor(
        private notification: NotificationService,
    ) {
        this.socket = io(this.url);
        this.socket.on('connect_error', () => {
            this.notification.notify('Couldn\'t connect to the server.');
        });
        this.socket.on('failedJoin', () => {
            this.notification.notify('Failed joining room, it might be full.');
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
        const cards = deck.split('\n');
        if (this.validCommanderDeck(cards)) {
            this.socket.emit('deck', cards);
        } else {
            window.alert('Invalid deck format...');
        }
    }


    /*******************************************/
    /*               Receptions                */
    /*******************************************/

    joinSuccess(): Observable<string> {
        return new Observable((subscriber) => {
            this.socket.on('successfullJoin', (joinMsg: string) => {
                subscriber.next(joinMsg);
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

    deckInfo(): Observable<string[]> {
        return new Observable((subscriber) => {
            this.socket.on('finishedDeck', (uris: string[]) => {
                subscriber.next(uris);
            });
        });
    }

    private validCommanderDeck(cards: string[]): boolean {
        let nbCards = 0;
        let nbCommanders = 0;
        cards.forEach((card) => {
            if (card.search(new RegExp('^[0-9]{1,2}x .+$')) !== -1) {
                const qtNameSplit = card.split('x ');
                nbCards += Number(qtNameSplit[0]);
                if (qtNameSplit[1].includes('*CMDR*')) {
                    nbCommanders++;
                }
            }
        });
        return nbCards === 100 && nbCommanders > 0 && nbCommanders <= 2;
    }
}
