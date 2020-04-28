import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import socketio from 'socket.io';
import { Game } from '../src/Game';
import types from '../config/types';
import { PlayerHandler } from './PlayerHandler';

@injectable()
export class RoomHandler {

    private readonly NB_ROOMS = 4;
    private readonly maxPerRoom: number = 2;
    readonly defaultNamespace: string = '/'

    readonly roomInfo: [string, number][];
    readonly rooms: Map<string, Game>;

    io: socketio.Server;

    constructor(
        @inject(types.GameFactory) private factory: (io: socketio.Server) => Game,
        @inject(types.PlayerHandler) private players: PlayerHandler,
    ) {
        this.roomInfo = [];
        this.rooms = new Map<string, Game>();
        for (let i = 1; i <= this.NB_ROOMS; i++) {
            const roomName = `room${i}`;
            this.roomInfo.push([roomName, 0]);
            this.rooms.set(roomName, this.factory(this.io));
        }
        setInterval(() => this.sendRoomInfo(), 1000);
    }


    joinRoom(socket: SocketIO.Socket, roomName: string, username: string): void {
        const game = this.rooms.get(roomName);
        const player = this.players.getPlayer(socket.id);
        if (game && player && this.nbConnectedToRoom(roomName) < this.maxPerRoom && Object.keys(socket.rooms).length == 1) {
            socket.join(roomName);
            game.addPlayer(player);
            this.io.in(roomName).emit('successfullJoin', roomName);
        } else {
            socket.emit('failedJoin');
        }
    }

    leaveRoom(socket: SocketIO.Socket) {
        Object.keys(socket.rooms).forEach((room) => {
            if (room !== socket.id) {
                const game = this.rooms.get(room)
                const player = this.players.getPlayer(socket.id);
                socket.leave(room);
                if (game && player) {
                    game.removePlayer(player);
                }
            }
        })
    }

    private sendRoomInfo(): void {
        this.roomInfo.forEach((info) => {
            const nbConnected = this.nbConnectedToRoom(info[0]);
            if (info[1] !== nbConnected) {
                info[1] = nbConnected;
            }
        });
        this.io.emit('roomInfo', this.roomInfo);
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