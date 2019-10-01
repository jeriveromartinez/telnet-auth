# install
npm install telnet-auth

# usage
```
var TelnetClient = require('telnet-auth');
var telnetcli = new TelnetClient();

const connconf = {
    host: '127.0.0.1',
    port: 23,
    needCredentials: true,
    username: "user",
    password: "pass",
    log: true
};

const telnet = new TelnetClient()
    telnet.connect(connconf);
    telnet.on('authenticated', function () {
        telnet.on('response', function (response) {
            console.log(response);
        })
        telnet.write('echo "Test"');

        setTimeout(function () {
            telnet.destroy()
        }, 1000);
    })

```