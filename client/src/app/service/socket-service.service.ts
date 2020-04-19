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

    joinRoom(roomName: string, username: string) {
        this.socket.emit('join', roomName, username);
    }

    joinSuccess(): Observable<string> {
        return new Observable((subscriber) => {
            this.socket.on('successfullJoin', (joinMsg: string) => {
                subscriber.next(joinMsg);
            });
        });
    }

    startGame(): Observable<number> {
        return new Observable((subscriber) => {
            this.socket.on('startGame', (life: number) => {
                subscriber.next(life);
            });
        });
    }
}
