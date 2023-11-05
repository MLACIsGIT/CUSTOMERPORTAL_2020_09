import InputFieldSet from "../InputFieldSet/InputFieldSet";
import { useState, useRef, useEffect } from "react";
import * as Gl from "../../common/Gl";
import useSettings from "../../common/SettingsContext";

export default function LanguageSelector({ languages }) {
  const refLangSelector = useRef();
  const { lang, setLang } = useSettings();

  const [fieldValues, setFieldValues] = useState({
    LanguageSelector: lang,
  });

  function setNewLanguage(newLanguage) {
    if (fieldValues.LanguageSelector !== newLanguage) {
      setFieldValues({
        LanguageSelector: newLanguage,
      });
      Gl.COOKIES_SET("lang", newLanguage);
      setLang(newLanguage);
    }
  }

  function handleLanguageChanged(e) {
    setNewLanguage(e.target.value);
  }

  useEffect(() => {
    let cookies = Gl.COOKIES_GET();
    if (cookies.lang !== undefined) {
      setNewLanguage(cookies.lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <InputFieldSet
        reference={refLangSelector}
        name="LanguageSelector"
        type="select"
        fieldValues={fieldValues}
        optionList={languages}
        handleInputBlur={handleLanguageChanged}
        handleInputChange={handleLanguageChanged}
        required={true}
      />
    </div>
  );
}
