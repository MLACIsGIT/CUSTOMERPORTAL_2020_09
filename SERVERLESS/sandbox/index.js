const token = require('./token');
const user = require('./user');
const sms = require('./sms');

Result_ERR = (errcode, err) => {
    return {
        status: errcode,
        body: {
            "header": {
                "version": version,
                "request_id": request_id,
                "result": errcode
            },
            'body': {
                "err": JSON.stringify(err)
            }
        }
    }
}

Result_OK = (result) => {
    return {
        status: 200,
        body: {
            "header": {
                "version": version,
                "request_id": request_id,
                "result": "OK"
            },
            'body': result
        }
    }
}

module.exports = async function (context, req) {
    try {
        if (req.method != 'POST') {
            context.res = {
                status: 405,
                body: `Request Method is not valid`
            };
            return;
        }
        
        let msgHeader = req.body.header;
        var taskType = msgHeader.taskType;
        if (taskType === undefined) {
            context.res = {
                status: 400,
                body: `Task Type not found`
            };
            return;
        }
        var headerInterface = msgHeader.interface;
        if (headerInterface === undefined) {
            context.res = {
                status: 400,
                body: `Interface not found`
            };
            return;
        }
        var sender = msgHeader.interface;
        if (sender === undefined) {
            context.res = {
                status: 400,
                body: `Sender not found`
            };
            return;
        }
        var recipient = msgHeader.interface;
        if (recipient === undefined) {
            context.res = {
                status: 400,
                body: `Recipient not found`
            };
            return;
        }
        
        tokenizer = new token.Token(req);
        await tokenizer.validateToken();

        if (taskType === 'TKN') {
            context.res = {
                status: 200,
                body: tokenizer.mToken,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            return;
        }

        if (taskType === 'RGS') {
            newUser = new user.User(req)
            let response = await newUser.registration()
            if (response.result !== 'OK') {
                context.res = {
                    status: 400,
                    body: 'Registration unsuccessful',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                return;

            }

            let smsResult = await sms.SMS.sendSMS(req.body.body.userName, response.registrationKey);

            let a = 'a'
        }

        if (taskType === 'RGSE') {
            newUser = new user.User(req)
            let response = await newUser.registrationEnd()
            let a = 'a'
        }

    } catch (error) {
        return Result_ERR(400, {});
    }
};