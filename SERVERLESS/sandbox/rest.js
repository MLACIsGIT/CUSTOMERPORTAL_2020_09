const errorMsg = require('./errorMsg');

function validateParameter(obj, fieldNamePath, dataType, required = true, acceptedValues = '') {
    const path = fieldNamePath.split('/');
    var data = JSON.parse(obj.toString());

    var BreakException = {};

    try{
        path.forEach(item => {            
            if (data[item] !== undefined) {
                if (required) {
                    console.log(data);
                    throw new errorMsg.ErrorMsg('Object not found', 400);
                }
                throw BreakException;
            }
            data = data[item];
        });
    } catch(e) {
      if (e !== BreakException) {
          throw e;
      }
    }

    return true;
}

module.exports.validateParameter = validateParameter;
