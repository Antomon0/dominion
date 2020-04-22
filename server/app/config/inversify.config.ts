import { Container } from "inversify";
import Types from './types';
import { Application } from "../app";
import { Server } from "../server";
import { RoomHandler } from "../services/RoomHandler";
import { GameHandler } from "../services/GameHandler";
import { SocketIo } from "../SocketIo";
import { ScryfallApiService } from "../services/ScryfallApiService";

export const container: Container = new Container();

container.bind(Types.Server).to(Server).inSingletonScope();
container.bind(Types.Application).to(Application).inSingletonScope();
container.bind(Types.SocketIo).to(SocketIo).inSingletonScope();
container.bind(Types.RoomHandler).to(RoomHandler).inSingletonScope();
container.bind(Types.GameHandler).to(GameHandler).inSingletonScope();
container.bind(Types.Scryfall).to(ScryfallApiService).inSingletonScope();