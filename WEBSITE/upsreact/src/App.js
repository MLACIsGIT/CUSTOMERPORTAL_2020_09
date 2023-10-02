import './App.scss';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Db from './_SelComponents/_SelWebComponents/js/Db'
import PageHome from './Pages/Home/PageHome'
import PageLogin from './Pages/Login/PageLogin'
import PageTrack from './Pages/Track/PageTrack'
import PageContact from './Pages/Contact/PageContact'
import Header from './Components/Header/Header'

function App() {
  const db = new Db();

  const [lang, setLang] = useState("en");
  const [loginData, setLoginData] = useState({
    user: null,
    token: null
  });

  function onLanguageChanged(lang) {
    setLang(lang);
  }

  function onLogout() {
    setLoginData({
      user: null,
      token: null
    })
  }

  function onExtendToken(newToken) {
    if (newToken === null) {
      onLogout();
    } else {
      setLoginData({ ...loginData, token: newToken })
    }
  }

  function onLogin(newLoginData) {
    setLoginData(newLoginData);
  }

  return (
    <Router>
      <Header
        lang={lang}
        db={db}
        onLanguageChanged={lang => onLanguageChanged(lang)}
        loginData={loginData}
        onExtendToken={newToken => onExtendToken(newToken)}
        onLogout={onLogout}
      />

      <Switch>
        <Route exact path="/">
          <PageLogin
            lang={lang}
            db={db}
            loginData={loginData}
            onLogin={newLoginData => onLogin(newLoginData)}
            onLogout={onLogout}
          />
        </Route>

        <Route exact path="/news">
          <PageHome
            lang={lang}
            loginData={loginData}
            db={db}
            onLogout={onLogout}
          />
        </Route>

        <Route exact path="/home">
          <PageTrack
            lang={lang}
            loginData={loginData}
            db={db}
            onLogout={onLogout}
          />
        </Route>

        <Route exact path="/contact">
          <PageContact
            lang={lang}
            loginData={loginData}
            db={db}
            onLogout={onLogout}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
