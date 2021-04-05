import './App.scss';
import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory, Redirect } from "react-router-dom"
import PageHome from './Pages/Home/PageHome'
import PageLogin from './Pages/Login/PageLogin'

function App() {
  //const navigationHistory = useHistory();
  const [loginData, setLoginData] = useState({
    userId: null,
    token: null,
    tokenValid: null
  })

//navigationHistory.push("/login")

  return (
    <Router>
      <Link to={"/login"} className="btn btn-info">Login</Link>
      <Switch>
        <Route exact path="/">
          <PageLogin />
        </Route>

        <Route exact path="/home">
          <PageHome />
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
