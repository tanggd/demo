"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apache_dubbo_js_1 = require("apache-dubbo-js");
const service_1 = __importDefault(require("./service"));
const server = new apache_dubbo_js_1.DubboServer({
    port: 20880,
    // default zookeeper
    registry: 'localhost:2181',
    services: service_1.default,
});
server.start();
//# sourceMappingURL=dubbo.js.map