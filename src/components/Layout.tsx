import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => (
  <>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-foreground-alt focus:shadow-lg"
    >
      Skip to main content
    </a>
    <Navbar />
    <div id="main-content">
      <Outlet />
    </div>
    <Footer />
  </>
);

export default Layout;
