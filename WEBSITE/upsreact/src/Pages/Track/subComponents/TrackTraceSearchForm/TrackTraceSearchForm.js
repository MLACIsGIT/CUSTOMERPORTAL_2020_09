import { useRef, useState, useEffect } from 'react';
import InputFieldSet from '../../../../_SelComponents/_SelWebComponents/InputFieldSet/InputFieldSet';
import * as Gl from "../../../../_SelComponents/_SelWebComponents/js/Gl"
import langJSON from "./TrackTraceSearchForm-lang"

export default function TrackTraceSearchForm(props) {
    const LangElements = langJSON();
    const lang = props.lang;

    const [formWasValidated, setFormWasValidated] = useState(false);

    const [propsOfSelChangePassword, setPropsOfSelChangePassword] = useState();

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    const [errors, setErrors] = useState({
        searchedNo: '',
        typeOfSearch: ''
    });

    function showMessageShortly(codeOfMessage, typeOfAlert) {
        setFormAlertText(lng(codeOfMessage));
        setFormAlertType(typeOfAlert);
        setTimeout(() => {
            setFormAlertText('');
            setFormAlertType('');
        }, 5000);
    }

    function clearAllErrors() {
        setErrors({
            searchedNo: '',
            typeOfSearch: ''
        })
    }

    const [fieldValues, setFieldValues] = useState({
        searchedNo: '',
        typeOfSearch: ''
    });

    const references = {
        searchedNo: useRef(),
        typeOfSearch: useRef()
    };

    const [formAlertText, setFormAlertText] = useState('');
    const [formAlertType, setFormAlertType] = useState('');

    const validators = {
        searchedNo: {
            required: isNotEmpty
        },
        typeOfSearch: {
        }
    }

    const errorTypes = {
        required: lng(`validation-required`)
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
            let searchResult = "notFound"; //await props.db.login(fieldValues.login, fieldValues.pass)

            switch (searchResult?.result) {
                case "ok":
                    alert("search...")
                    break;

                case "notFound":
                    showMessageShortly("search-notFound", "danger");
                    break;

                default:
                    showMessageShortly("no-response", "danger");
                    break;
            }
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

    function onPasswordChanged(answer) {
        setPropsOfSelChangePassword({
            show: false
        })

        if (answer === 'ok') {
            setFieldValues(
                {
                    searchedNo: '',
                    typeOfSearch: ''
                }
            )
        }
    }

    return (
        <div className="track-trace-search-form">
            {formAlertText &&
                <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
                    {formAlertText}
                </div>
            }
            <form onSubmit={handleSubmit} noValidate={true}
                className={`needs-validation ${formWasValidated ? 'was-validated' : ''}`}>
                <InputFieldSet
                    reference={references['searchNo']}
                    name="searchNo"
                    labelText={lng(`field-searchNo`)}
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
                    labelText={lng(`field-pass`)}
                    type="password"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <button type="submit" className="btn btn-success">{lng(`btn-login`)}</button>
            </form>
        </div>
    );
}
