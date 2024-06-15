const { generateId } = require("./util/util");

module.exports = WebSocketEvents;

function WebSocketEvents(){
    this._sockets = {};
    this._events = {};
}

/**
 * Connect message?:
 * 
 * 
 * Subscribe:
 * 
 * 
 * Unsubscribe:
 * 
 * 
 * Event:
 * 
 */
WebSocketEvents.prototype.bindSocket = function(socket){
    const id = generateId({length: 256});
    socket.on('message', async data=>{

    });
    socket.on('error', e=>{

    });
    socket.on('close', (code, reason)=>{

    });
}

WebSocketEvents.prototype.sendEvent = function(key, payload, opt={}){

}
