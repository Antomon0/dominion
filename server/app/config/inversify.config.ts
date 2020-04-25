import {
    Container,
    interfaces
} from "inversify";
import types from './types';
import * as socketio from 'socket.io';
import { Application } from "../app";
import { Server } from "../server";
import { RoomHandler } from "../services/RoomHandler";
import { SocketIo } from "../SocketIo";
import { ScryfallApiService } from "../services/ScryfallApiService";
import { Game } from "../src/Game";
import { Deck } from "../src/Deck";
import { Player } from "../src/Player";
import { PlayerHandler } from "../services/PlayerHandler";

export const container: Container = new Container();

container.bind(types.Server).to(Server).inSingletonScope();
container.bind(types.Application).to(Application).inSingletonScope();
container.bind(types.SocketIo).to(SocketIo).inSingletonScope();
container.bind(types.RoomHandler).to(RoomHandler).inSingletonScope();
container.bind(types.PlayerHandler).to(PlayerHandler).inSingletonScope();
container.bind(types.Scryfall).to(ScryfallApiService).inSingletonScope();
container.bind(types.Deck).to(Deck);

container.bind<interfaces.Factory<Player>>(types.PlayerFactory).toFactory<Player>((context: interfaces.Context) => {
    return (sid: string, socket: socketio.Socket) => {
        return new Player(context.container.get<Deck>(types.Deck), sid, socket);
    }
});

container.bind<interfaces.Factory<Game>>(types.GameFactory).toFactory<Game>((context: interfaces.Context) => {
    return (io: socketio.Server) => {
        return new Game(io);
    }
});
