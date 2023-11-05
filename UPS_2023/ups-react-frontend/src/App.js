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
