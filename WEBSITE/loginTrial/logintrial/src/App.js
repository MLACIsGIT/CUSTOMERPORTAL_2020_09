import './App.scss';
import { BrowserRouter as Router } from "react-router-dom"
import LoginTrial from "./Components/LoginTrial/LoginTrial"

function App() {
  return (
    <Router>
      <div>
        <LoginTrial />
      </div>
    </Router>
  );
}

export default App;
