import './App.scss';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Settings from './Settings.js';
import Db from './_SelComponents/_SelWebComponents/js/Db';
import PageLogin from './Pages/Login/PageLogin';
import PageInvoices from './Pages/Invoices/PageInvoices';
import PageStocks from './Pages/Stocks/PageStocks';
import PageTracking from './Pages/Tracking/PageTracking';
import PageSettings from './Pages/Settings/PageSettings';
import PageContact from './Pages/Contact/PageContact';
import PageHome from './Pages/Home/PageHome';
import Header from './Components/Header/Header';

function App() {
  const settings = Settings();
  const db = new Db(settings);

  const [lang, setLang] = useState("en");
  const [loginData, setLoginData] = useState({
    user: null,
    token: null
  });

  const [extendedToken, setExtendedToken] = useState(null)

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
    if (!newToken) {
      onLogout()
      return;
    }
    setExtendedToken(newToken);
  }

  useEffect(() => {
    if (extendedToken === null) {
      if (loginData.user !== null) {
        onLogout();
      }
    } else {
      setLoginData({ ...loginData, token: extendedToken })
    }
  }, [extendedToken])

  function onLogin(newLoginData) {
    setLoginData(newLoginData);
  }

  return (
    <div className="App">
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
              settings={settings}
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

          <Route exact path="/invoices">
            <PageInvoices
              lang={lang}
              loginData={loginData}
              db={db}
              onLogout={onLogout}
            />
          </Route>

          <Route exact path="/stocks">
            <PageStocks
              lang={lang}
              loginData={loginData}
              db={db}
              onLogout={onLogout}
            />
          </Route>

          <Route exact path="/tracking">
            <PageTracking
              lang={lang}
              loginData={loginData}
              db={db}
              onLogout={onLogout}
            />
          </Route>

          <Route exact path="/settings">
            <PageSettings
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
    </div>
  );
}

export default App;
