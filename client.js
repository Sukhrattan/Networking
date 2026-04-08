const net = require('net');
const client = net.createConnection({port:1234,host:'127.0.0.1'});
process.stdin.on('data',(data)=>{
    client.write(data);
})
client.on('data',(data)=>{
    console.log(data.toString());
})
client.on('close',()=>{
    console.log("Client Closed");
    process.exit(0);
})