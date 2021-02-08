const http = require('http');
const rest = require('./rest');
const errorMsg = require('./errorMsg');

const server = http.createServer(
    (req, res) => {
        if (req.method != 'POST') {
            new errorMsg.ErrorMsg('Error: request type has to be POST', res);
        } else if (req.headers['content-type'] !== 'application/json; charset=utf-8' && req.headers['content-type'] !== 'application/json') {
            new errorMsg.ErrorMsg('Error: Request content type is not valid', res);
        }

        if (req.url === '/getToken.html') {
            req.on('data', chunk => {
                try {
                rest.validateParameter(chunk, 'header/taskType', 0);
                } catch (e) {
                    res.statusCode = e.statusCode;
                    res.statusMessage = e.statusMessage;
                    console.log(res);
                    res.end();
                }
            });
        }
    }
);

server.listen(3000);
