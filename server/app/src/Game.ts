import socketio from 'socket.io';
import { Player } from './Player';

export class Game {

    private io: socketio.Server;

    roomName: string;

    private players: Map<string, Player>;

    constructor(io: socketio.Server, room: string, sids: string[]) {
        this.io = io;
        this.roomName = room;
        this.players = new Map<string, Player>();
        sids.forEach((sid) => {
            this.players.set(sid, new Player());
            this.io.to(sid).emit('startGame', this.players.get(sid)?.getLife());
        });
    }



}