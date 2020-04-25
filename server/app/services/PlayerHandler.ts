import { Player } from "../src/Player";
import types from "../config/types";
import { inject, injectable } from "inversify";
import * as socketio from 'socket.io';

@injectable()
export class PlayerHandler {

    private players: Player[];

    constructor(
        @inject(types.PlayerFactory) private factory: (sid: string, socket: socketio.Socket) => Player,
    ) {
        this.players = [];
    }

    addPlayer(sid: string, socket: socketio.Socket) {
        const player = this.factory(sid, socket);
        this.players.push(player);
    }

    removePlayer(sid: string) {
        const index = this.players.findIndex((player) => player.sid === sid);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
    }

    getPlayer(sid: string): Player | undefined {
        return this.players.find((player) => player.sid === sid);
    }
}