import * as net from 'net';
const server = net.createServer();
server.on('error',(err)=>{throw err;});
server.on('connection',onConnection);
server.listen({host: '127.0.0.1',port:1234})


function onConnection(socket){
    console.log("New Connection : ",socket.remoteAddress , socket.remotePort);

    socket.on('end',()=>{
        console.log("EOF (End of File");
    })

    socket.on('data',(data)=>{
        console.log("data : ",data);
        socket.write(data);

        if(data.includes('q')){
            console.log("Closing Echo Server")
            socket.end();
        }
    })

}