module.exports = async function (context, req) {
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = 'UPS Healthcare Local. Under construction.';

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}
