const WebSocket = require('ws');


const wss = new WebSocket.Server({ port: 8080 });

function socketServer () {
  wss.on('connection', ws => {
    ws.on('message', data => {
      console.log('recieved from client: ', data.toString());
      let opened = 0;
      let closed = 0;
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          opened++;
          //console.log('sent ' + data + ' from broadcast loop');
          client.send('Here is your message back ', data);
          client.close();
          if(client.readyState === WebSocket.CLOSING) {
            closed++;
          }
        }
      });
      console.log('opened ', opened);
      console.log('closed ', closed);
    });
  });
}

module.exports = socketServer;