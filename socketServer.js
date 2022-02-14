const WebSocket = require('ws');
const url = require('url');


const wss = new WebSocket.Server({ port: 8080 });

function socketServer () {
  wss.on('connection',(ws, req) => {
  //console.log('wss clients ', req._events);
    const parameters = url.parse(req.url, true);
    ws.room = parameters.query.room;
    ws.on('message', data => {
      //console.log(ws)
      console.log('recieved from client: ', data.toString());
      let opened = 0;
      let closed = 0;
      wss.clients.forEach(client => {
        console.log(client.room);
        if (client.readyState === WebSocket.OPEN) {
          opened++;
          //console.log('sent ' + data + ' from broadcast loop');
          client.send('Here is your message back ', data);
          //client.close();
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
