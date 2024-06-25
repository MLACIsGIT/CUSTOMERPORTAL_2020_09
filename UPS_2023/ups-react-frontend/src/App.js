import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.scss";
import { MsalProvider } from "@azure/msal-react";
import MainPage from "./pages/MainPage";
import Header from "./components/Header/Header";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
]);

function App({ msalInstance }) {
  return (
    <MsalProvider instance={msalInstance}>
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <main>
          <RouterProvider router={router} />
        </main>
      </div>
    </MsalProvider>
  );
}

export default App;

/*
To get interactive access token from Microsoft Entra:
 - set redirect to localhost (REACT_APP_MSAL_REDIRECT_URI in .env)
 - run app (port 3200)
 - uncomment console.log in useFetchWithMsal
 - log in through the interactive screen, check console (F12) to retrieve token
*/
