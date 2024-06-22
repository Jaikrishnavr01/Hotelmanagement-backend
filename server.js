
import http from "node:http"
import dotenv from 'dotenv';

dotenv.config();


const server = http.createServer((req,res) => {
    res.writeHead(200,{"content-type": "text/plain"})
    res.end("Hello")
})

server.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})