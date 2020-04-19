import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import types from './types';
import { GameHandler } from './src/GameHandler';
import socketio from 'socket.io';

@injectable()
export class RoomHandler {

    readonly defaultNamespace: string = '/'
    readonly defaultRoom: string = 'room1'
    readonly maxPerRoom: number = 2;

    io: socketio.Server;

    constructor(
        @inject(types.GameHandler) private game: GameHandler,
    ) { }

    joinRoom(socket: SocketIO.Socket, roomName: string, username: string): void {
        if (roomName === this.defaultRoom && this.nbConnectedToRoom(roomName) < this.maxPerRoom) {
            socket.join(this.defaultRoom);
            this.io.in(this.defaultRoom).emit('successfullJoin', `${username} joined ${roomName}`);
            this.startGameIfRoomFull(roomName);
        } else {
            socket.emit('failedJoin');
        }
    }

    private startGameIfRoomFull(roomName: string) {
        const connectedClients = this.getConnectedClients(roomName);
        if (connectedClients && connectedClients.length == this.maxPerRoom) {
            this.game.startGame(roomName, connectedClients);
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