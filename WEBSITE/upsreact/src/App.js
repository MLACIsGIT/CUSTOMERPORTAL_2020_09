import './App.scss';
import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory, Redirect } from "react-router-dom"
import Settings from './Settings.js';
import Db from './_SelComponents/_SelWebComponents/js/Db'
import PageHome from './Pages/Home/PageHome'
import PageLogin from './Pages/Login/PageLogin'
import Header from './Components/Header/Header'

function App() {
  //const navigationHistory = useHistory();
  const settings = Settings();
  const db = new Db(settings);

  const [lang, setLang] = useState("en");
  const [loginData, setLoginData] = useState({
    userId: null,
    token: null,
    tokenValid: null
  });
  const [selectedPage, setSelectedPage] = useState({
    currentPage: "login"
  });

  function onLanguageChanged(lang) {
    setLang(lang);
  }

  return (
    <Router>
      <Header
        lang={lang}
        onLanguageChanged={lang => onLanguageChanged(lang)}
        selectedPage={selectedPage}
      />

      <Switch>
        <Route exact path="/">
          <PageLogin
            lang={lang}
            db={db}
          />
        </Route>

        <Route exact path="/home">
          <PageHome
            lang={lang}
            loginData={loginData}
            db={db}
          />
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
