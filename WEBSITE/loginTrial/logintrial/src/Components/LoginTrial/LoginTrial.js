import { useRef, useState, useEffect } from 'react';
import InputFieldSet from '../../_SelComponents/_SelWebComponents/InputFieldSet/InputFieldSet';
import Db from "../../_SelComponents/_SelWebComponents/js/Db"

export default function LoginTrial(props) {
    const [formWasValidated, setFormWasValidated] = useState(false);

    const [errors, setErrors] = useState({
        login: '',
        pass: ''
    });

    const [loginData, setLoginData] = useState({
        salt: "",
        passwordAndSaltHashed: ""
    })

    function showMessageShortly(codeOfMessage, typeOfAlert) {
        setFormAlertText(codeOfMessage);
        setFormAlertType(typeOfAlert);
        setTimeout(() => {
            setFormAlertText('');
            setFormAlertType('');
        }, 5000);
    }

    function clearAllErrors() {
        setErrors({
            login: '',
            pass: ''
        })
    }

    const [fieldValues, setFieldValues] = useState({
        login: '',
        pass: ''
    });

    const references = {
        login: useRef(),
        pass: useRef()
    };

    const [formAlertText, setFormAlertText] = useState('');
    const [formAlertType, setFormAlertType] = useState('');

    const validators = {
        login: {
            required: isNotEmpty
        },
        pass: {
            required: isNotEmpty
        }
    }

    const errorTypes = {
        required: "validation-required"
    };

    function isNotEmpty(value) {
        return value !== '';
    }

    useEffect(() => {
        clearAllErrors();
    }, [props.lang])

    async function handleSubmit(e) {
        e.preventDefault();

        if (isFormValid()) {
            let db = new Db();
            debugger
            let salt = db.getSalt();
            let passwordAndSaltHashed = db.getPasswordHash(fieldValues.pass, salt);

            setLoginData({
                salt: salt,
                passwordAndSaltHashed: passwordAndSaltHashed
            })
        }
    }

    function isFormValid() {
        let isFormValid = true;
        for (const fieldName of Object.keys(fieldValues)) {
            const isFieldValid = validateField(fieldName);
            if (!isFieldValid) {
                isFormValid = false;
            }
        }
        return isFormValid;
    }

    function handleInputBlur(e) {
        const fieldName = e.target.name;
        setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: ''
        }));

        validateField(fieldName);
    }

    function handleInputChange(e) {
        const value = e.target.value;
        const fieldName = e.target.name;
        setFieldValues({
            ...fieldValues,
            [fieldName]: value
        });
        setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: ''
        }));
    }

    function validateField(fieldName) {
        const value = fieldValues[fieldName];
        let isValid = true;
        setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: ''
        }));
        references[fieldName].current.setCustomValidity('');

        if (validators[fieldName] !== undefined) {
            for (const [validationType, validatorFn] of Object.entries(validators[fieldName])) {
                if (isValid) {
                    isValid = validatorFn(value);
                    if (!isValid) {
                        const errorText = errorTypes[validationType];
                        setErrors((previousErrors) => {
                            return ({
                                ...previousErrors,
                                [fieldName]: errorText
                            })
                        });
                        references[fieldName].current.setCustomValidity(errorText);
                    }
                }
            }
        }
        return isValid;
    }

    return (
        <div className="sel-login">
            <h1>loginTrial form</h1>
            {formAlertText &&
                <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
                    {formAlertText}
                </div>
            }
            <form onSubmit={handleSubmit} noValidate={true}
                className={`needs-validation ${formWasValidated ? 'was-validated' : ''}`}>
                <InputFieldSet
                    reference={references['login']}
                    name="login"
                    labelText={"Login:"}
                    type="text"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <InputFieldSet
                    reference={references['pass']}
                    name="pass"
                    labelText={"Password:"}
                    type="text"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <button type="submit" className="btn btn-success">{"get login data"}</button>
            </form>
            <br />

            <h2><u>Internal login params</u></h2>
            <br />
            <h5><u>Salt:</u><br /><span>{loginData.salt}</span></h5>
            <br />
            <h5><u>Password + Salt hashed:</u><br /><span>{loginData.passwordAndSaltHashed}</span></h5>
        </div>
    );
}
