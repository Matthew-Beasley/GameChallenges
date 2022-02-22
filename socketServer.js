const WebSocket = require('ws');
const url = require('url');
const TextDecoder = require



const wss = new WebSocket.Server({ port: 8080 });
//wss.binaryType = 'blob';

function socketServer () {
  wss.on('connection',(ws, req) => {
    const parameters = url.parse(req.url, true);
    ws.room = parameters.query.room;
    ws.on('message', event => {
      let array = event;
      const message = array.toString();
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
          if(client.readyState === WebSocket.CLOSING) {
            //closed++;
          }
        }
      });
    }
    );
  });
}

module.exports = socketServer;
