const net = require('net');
//array to contain the clients!
let clients = [];
let id = 1;

function soInit(socket){
    const conn = {
        socket:socket,
        reader:null,
        ended:false,
        err:null
    };
    socket.on('data',(data)=>{
        console.assert(conn.reader);
        conn.socket.pause();
        conn.reader.resolve(data);
        conn.reader=null;
    })
    socket.on('end',(data)=>{
        console.assert(conn.reader);
        conn.reader = null;
        conn.ended=true;
    })
    socket.on('error', (err) => {
        conn.err = err;
        if (conn.reader) {
            conn.reader.reject(err);
            conn.reader = null;
        }
    });
    return conn;
}


function soRead(conn){
    console.assert(!conn.reader,"Continous Read calls are not allowed");
    return new Promise((resolve,reject)=>{
        if (conn.ended) return resolve(Buffer.from(''));
        if (conn.err) return reject(conn.err);

        conn.reader = { resolve, reject };
        conn.socket.resume();
    })
}
function soWrite(conn,data){
    return new Promise((resolve,reject)=>{
        conn.socket.write(data,(err)=>{
            if(err)reject(err);
            else{
                resolve(conn.reader);
            }
        });
    })
}
async function handleMessage(conn,message){
    if(message == 'hello'){
        await soWrite(conn,"Hello User!");
    }
    if(message == 'q'){
        conn.socket.end();
    }
    if(message == "list"){
        let result = "";
        clients.forEach((client)=>{
            result+= client.id;
        });
        await soWrite(conn,result)
    }

}

async function newConn(socket){
    const conn = soInit(socket);
    const client = {
        id: id++,
        socket: socket,
        port: socket.remeotePort,
        Address: socket.remoteAddress,
        connectedAt: Date.now()
    };
    clients.push(client);

    console.log(`Client ${client.id} connected to Echo Server` );
    try{
        while(true){
            const data = await soRead(conn);
            if(data.length===0)break;
            let message = data.toString().trim();
            await handleMessage(conn,message);
        }
    }
    catch(err){
        console.log(`Client : ${client.id} : `,err);
    }

    finally{
        clients.forEach(()=>{
            clients = clients.filter(c=>c.socket!==socket);
        })
    }

}
let server = net.createServer();
server.on('connection',newConn);

server.listen({host:'127.0.0.1',port:1234});