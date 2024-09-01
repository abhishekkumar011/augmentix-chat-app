import { Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <div>
        <main>
          <Outlet />
          <Toaster />
        </main>
      </div>
    </>
  );
}

export default App;
