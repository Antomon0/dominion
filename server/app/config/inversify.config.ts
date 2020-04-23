import {
    Container,
    interfaces
} from "inversify";
import types from './types';
import { Application } from "../app";
import { Server } from "../server";
import { RoomHandler } from "../services/RoomHandler";
import { GameHandler } from "../services/GameHandler";
import { SocketIo } from "../SocketIo";
import { ScryfallApiService } from "../services/ScryfallApiService";
import { Game } from "../src/Game";
import { Deck } from "../src/Deck";
import { Player } from "../src/Player";

export const container: Container = new Container();

container.bind(types.Server).to(Server).inSingletonScope();
container.bind(types.Application).to(Application).inSingletonScope();
container.bind(types.SocketIo).to(SocketIo).inSingletonScope();
container.bind(types.RoomHandler).to(RoomHandler).inSingletonScope();
container.bind(types.GameHandler).to(GameHandler).inSingletonScope();
container.bind(types.Scryfall).to(ScryfallApiService).inSingletonScope();
container.bind(types.Game).to(Game);
container.bind(types.Deck).to(Deck);

container.bind<Player>(types.Player).toDynamicValue((context: interfaces.Context) => {
    return new Player(context.container.get<Deck>(types.Deck));
});
