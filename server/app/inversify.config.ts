import { Container } from "inversify";
import Types from './types';
import { Application } from "./app";
import { Server } from "./server";
import { RoomHandler } from "./RoomHandler";
import { GameHandler } from "./src/GameHandler";
import { SocketIo } from "./SocketIo";

export const container: Container = new Container();

container.bind(Types.Server).to(Server).inSingletonScope();
container.bind(Types.Application).to(Application).inSingletonScope();
container.bind(Types.SocketIo).to(SocketIo).inSingletonScope();
container.bind(Types.RoomHandler).to(RoomHandler).inSingletonScope();
container.bind(Types.GameHandler).to(GameHandler).inSingletonScope();
