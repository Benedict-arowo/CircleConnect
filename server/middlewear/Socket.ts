// socketMiddleware.ts
import { Request, RequestHandler } from "express";
import { Server } from "socket.io";
import { ParamsDictionary } from "express-serve-static-core";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface Req extends Request {
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}

const socketMiddleware: (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => RequestHandler<ParamsDictionary, any, Record<string, any>> =
	(io) => (req, res, next) => {
		(req as Req).io = io;
		next();
	};

export default socketMiddleware;
