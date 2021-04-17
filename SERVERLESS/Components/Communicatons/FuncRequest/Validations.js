const Joi = require('joi');

class Validations {
    constructor() {
        this.schemas = {
            funcRequest: Joi.object({
                funcCode: Joi.string()
                    .alphanum()
                    .required()
            }),

            login: Joi.object({
                portalOwnerId: Joi.number()
                    .integer()
                    .required(),

                email: Joi.string()
                    .min(6)
                    .max(128)
                    .required(),

                passwordHash: Joi.string()
                    .required(),

                salt: Joi.number()
                    .required()
            }),

            registerUser: Joi.object({
                userLevel: Joi.number()
                    .integer()
                    .required(),

                name: Joi.string()
                    .min(3)
                    .max(100)
                    .required(),

                email: Joi.string()
                    .email()
                    .required(),

                password: Joi.string()
                    .min(6)
                    .max(20)
                    .required()
            }),

            extendTokenValidity: Joi.object({
                portalOwnerId: Joi.number()
                    .integer()
                    .required()
            })
        }
    }

    validate(jsonObject, schema) {
        let outOk = {
            result: true,
            error: undefined
        };

        let schemaObj = this.schemas[schema];

        if (schemaObj === undefined) {
            return {
                result: false,
                error: `Unknown schema ${schema}`
            }
        }

        try {
            const { error, value } = schemaObj.validate(jsonObject);

            if (error === undefined) {
                return outOk;
            } else {
                let errorText = `Validations.validate: jsonObject does not meet the schema ${schema}.`
                console.error(errorText, jsonObject, error);

                return {
                    result: false,
                    error: errorText,
                    message: error.message
                }
            }
        } catch (error) {
            console.error(error);
            return {
                result: false,
                error: error
            }
        }
    }
}

module.exports.Validations = Validations;

