import * as io from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';

export class SocketService {

    private url = 'http://localhost:3000';
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io(this.url);
        this.socket.on('failedJoin', () => {
            window.alert('Failed joining room, it might be full');
        });
    }

    /*******************************************/
    /*               Emissions                 */
    /*******************************************/

    joinRoom(roomName: string, username: string): void {
        this.socket.emit('join', roomName, username);
    }

    leaveRoom(roomName: string): void {
        this.socket.emit('leave', roomName);
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

    private validCommanderDeck(cards: string[]): boolean {
        let nbCards = 0;
        let nbCommanders = 0;
        cards.forEach((card) => {
            const qtNameSplit = card.split('x ');
            nbCards += Number(qtNameSplit[0]);
            if (qtNameSplit[1].includes('*CMDR*')) {
                nbCommanders++;
            }
        });
        return nbCards === 100 && nbCommanders > 0 && nbCommanders <= 2;
    }
}
