import Types from './config/types';
import { Server } from "./server";
import { container } from './config/inversify.config';

const server: Server = container.get<Server>(Types.Server);

server.init();
