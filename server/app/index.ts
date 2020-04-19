import Types from './types';
import { Server } from "./server";
import { container } from './inversify.config';

const server: Server = container.get<Server>(Types.Server);

server.init();
