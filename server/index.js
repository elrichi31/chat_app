import express from "express";
import {Server as SocketServer} from "socket.io"
import http from "http"
import {resolve} from "path"
import {PORT} from "./config.js"
import morgan from "morgan";

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server)

app.use(morgan("dev"))
app.use(express.static(resolve(__dirname, "../frontend/dist")))

io.on("connection", socket => {
    console.log("Client:", socket.id, "connected")
    socket.on("message", (body) => {
        console.log(body)   
        socket.broadcast.emit("message", {
            body,
            from: socket.id.slice(8)
        })
    })
})

server.listen(PORT)
console.log("Server on port ", PORT)
