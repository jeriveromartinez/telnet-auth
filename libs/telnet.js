const { EventEmitter } = require('events');
const UtilTelnet = require('./util-telnet');
const extend = require('util')._extend;

class Telnet extends EventEmitter {
    constructor () {
        super();
        this.config = null;
        this.telnet = new UtilTelnet();
        this.connectState = false;
        this.connecting = false;
        this.authenticated = false;
        this.cmd = '';

        this.loadEvents();
    }

    cloneobj(obj) {
        return extend({}, obj);
    }

    loadEvents() {
        const _self = this;

        this.telnet.on('authenticated', () => {
            _self.authenticated = true;
            _self.connectState = true;
            _self.emit('authenticated');
        });

        this.telnet.on('connect', () => _self.connecting = true);
        this.telnet.on('error', error => _self.emit('error', error));
        this.telnet.on('timeout', () => _self.emit('timeout'));
        this.telnet.on('close', had_error => _self.emit('close', had_error));
        this.telnet.on('end', () => _self.emit('end'));
        this.telnet.on('data', data => _self.emit('data', data));
        this.telnet.on('response', data => {
            const resolv = data.trim().split(_self.cmd)[ 1 ].toString('utf8').trim().split('\r\n')[ 0 ];
            if (resolv.trim() !== "") _self.emit('response', resolv)
        });
    }

    connect(config = { host, port: 23, username, password, needCredentials: true }) {
        if (this.authenticated) throw new Error('alreay connected.');
        else if (this.connecting) throw new Error('alreay connecting.')
        else {
            this.config = this.cloneobj(config);
            this.telnet.connect(this.config);
        }
    }

    destroy() {
        this.authenticated = false;
        this.connecting = false;
        this.connectState = false
        this.telnet.destroy();
    }

    write(data) {
        this.cmd = data;
        if (!this.connectState) return new Error('not connected to server');
        this.telnet.write(`${data}\r\n`);
    }
}

module.exports = exports = Telnet;
