import jsonServer from "json-server";
import {join} from "path";

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, "../data/cities.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

export default server;
