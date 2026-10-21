// import "../App.css";
// import "./public/css/style.css";

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./style.css";

function App() {
  return (
    <>
      <Navbar></Navbar>

      <main>
        <Outlet></Outlet>
      </main>

      <Footer></Footer>
    </>
  );
}

export default App;
