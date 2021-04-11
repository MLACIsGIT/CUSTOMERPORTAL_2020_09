import './App.scss';
import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Settings from './Settings.js';
import Db from './_SelComponents/_SelWebComponents/js/Db'
import PageHome from './Pages/Home/PageHome'
import PageLogin from './Pages/Login/PageLogin'
import PageTrack from './Pages/Track/PageTrack'
import PageReports from './Pages/Reports/PageReports'
import PageContact from './Pages/Contact/PageContact'
import Header from './Components/Header/Header'

function App() {
  //const navigationHistory = useHistory();
  const settings = Settings();
  const db = new Db(settings);

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

  function onLogin(newLoginData) {
    setLoginData(newLoginData);
  }

  return (
    <Router>
      <Header
        lang={lang}
        onLanguageChanged={lang => onLanguageChanged(lang)}
        loginData={loginData}
        onLogout={onLogout}
      />

      <Switch>
        <Route exact path="/">
          <PageLogin
            lang={lang}
            db={db}
            loginData={loginData}
            onLogin={newLoginData => onLogin(newLoginData)}
          />
        </Route>

        <Route exact path="/home">
          <PageHome
            lang={lang}
            loginData={loginData}
            db={db}
            onLogout={onLogout}
          />
        </Route>

        <Route exact path="/track">
          <PageTrack
            lang={lang}
            loginData={loginData}
            db={db}
            onLogout={onLogout}
          />
        </Route>

        <Route exact path="/reports">
          <PageReports
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
