const net = require('net');
let clients = [];
let id = 1;

function newConn(socket){
    const client = {
        id: id++,
        socket: socket,
        port: socket.remeotePort,
        Address: socket.remoteAddress,
        connectedAt: Date.now()
    };
    clients.push(client);
    console.log(`Client ${client.id} connected to Echo Server` );



    socket.on('end',()=>{
        console.log(`Client ${client.id} disconnected from Echo Server at ${Date.now()}` );
        clients = clients.filter(client => client.socket!==socket);
    })
    socket.on('data',(data)=>{
        let message = data.toString().trim();

        if(message == "hello"||message == "hi"|| message == "namaste"){
            socket.write("Hello! How can I help you?");
        }
        if(message == "time"){
            const now = new Date();

            const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;


            socket.write(time);

        }
        if(message.startsWith("say ")||message.startsWith("broadcast ")){
            clients.forEach(client=>{
                if(client.socket!==socket){
                    client.socket.write(message);
                }
            })
        }
        if(data.toString().includes('q')){
            console.log('Ending Connection!');
            socket.end();
        }
    })

}
let server = net.createServer();
server.on('connection',newConn);

server.listen({host:'127.0.0.1',port:1234});