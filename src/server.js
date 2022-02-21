"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express_1 = __importDefault(require("express"));
require("express-async-errors");
var cors_1 = __importDefault(require("cors"));
var routes_1 = require("./routes");
require("./database");
var app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(routes_1.router);
/** Rotas de testes */
app.get("/test", function (req, res) {
    return res.send("Olá NLW, método GET.");
});
app.post("/test-post", function (req, res) {
    return res.send("Olá NLW, método POST");
});
/** FIM - Rotas de testes */
app.use(function (err, request, response, next) {
    if (err instanceof Error) {
        return response.status(400).json({
            error: err.message,
        });
    }
    return response.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
});
app.listen(3000, function () { return console.log("Server is running!"); });
