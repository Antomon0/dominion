import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import types from '../config/types';
import { GameHandler } from './GameHandler';
import socketio from 'socket.io';
import { ScryfallApiService } from './ScryfallApiService';

@injectable()
export class RoomHandler {

    readonly defaultNamespace: string = '/'
    readonly roomInfo: [string, number][];
    readonly rooms: string[] = [
        'room1',
        'room2',
        'room3',
        'room4'
    ]
    readonly maxPerRoom: number = 2;

    io: socketio.Server;

    constructor(
        @inject(types.GameHandler) private game: GameHandler,
        @inject(types.Scryfall) private api: ScryfallApiService,
    ) {
        this.roomInfo = [];
        this.rooms.forEach((room) => {
            this.roomInfo.push([room, 0]);
        });
        setInterval(() => this.sendRoomInfo(), 1000);

        setTimeout(() => this.api.getCard('Austere Command'), 0);
    }

    sendRoomInfo(): void {
        this.roomInfo.forEach((info) => {
            const nbConnected = this.nbConnectedToRoom(info[0]);
            if (info[1] !== nbConnected) {
                info[1] = nbConnected;
            }
        });
        this.io.emit('roomInfo', this.roomInfo);
    }

    joinRoom(socket: SocketIO.Socket, roomName: string, username: string): void {
        if (this.rooms.includes(roomName) && this.nbConnectedToRoom(roomName) < this.maxPerRoom) {
            socket.join(roomName);
            this.io.in(roomName).emit('successfullJoin', roomName);
            this.startGameIfRoomFull(roomName);
        } else {
            socket.emit('failedJoin');
        }
    }

    leaveRoom(socket: SocketIO.Socket) {
        Object.keys(socket.rooms).forEach((room) => {
            if (room !== socket.id) {
                socket.leave(room);
                this.cancelGameIfNotEnoughPlayers(room);
            }
        })
    }

    private startGameIfRoomFull(roomName: string) {
        const connectedClients = this.getConnectedClients(roomName);
        if (connectedClients && connectedClients.length === this.maxPerRoom) {
            this.game.startGame(roomName, connectedClients);
        }
    }

    private cancelGameIfNotEnoughPlayers(roomName: string) {
        const connectedClients = this.getConnectedClients(roomName);
        if (connectedClients && connectedClients.length !== this.maxPerRoom) {
            this.game.cancelGame(roomName, connectedClients);
        }
    }

    private nbConnectedToRoom(roomName: string): number {
        const connectedClients = this.getConnectedClients(roomName);
        if (connectedClients) {
            return connectedClients.length;
        } else {
            return 0;
        }
    }
    private getConnectedClients(roomName: string, namespace: string = this.defaultNamespace): socketio.Room | undefined {
        return this.io.nsps[namespace].adapter.rooms[roomName];
    }

}