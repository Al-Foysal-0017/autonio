import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Squash as Hamburger } from "hamburger-react";
import styles from "./SidebarMobile.module.css";
import { navRoutes } from "./SidebarMobileRoute";
import Logo from "../../assets/img/LogoMobile.svg";
import { GiSplitCross } from "react-icons/gi";
import LogoIcon from "../../assets/img/icons/logo.svg";
import profileImg from "../../assets/img/profileImg.svg";

const MobileNav = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <header className="navbarAndSidebar" style={{ marginBottom: "25px" }}>
      {/* NAVBAR PART */}
      <nav className="navbarContainer">
        <div className="navbarContainerWrapper">
          {/* LEFT NAVBAR */}
          <div className="navbarContainerLeft">
            <div className="navbarContainerHamburger">
              <Hamburger
                toggle={setOpenSidebar}
                toggled={openSidebar}
                color="#fff"
              />
            </div>
            <div className="navbarContainerLogo">
              <span className="">
                <Logo />
              </span>
            </div>
          </div>
          {/* RIGHT NAVBAR */}
          <div className="navbarContainerRightItems">
            <div className="profileInfo">
              <profileImg />
              <span>0xc813...ea5e</span>
              {/* <span>icon</span> */}
            </div>
          </div>
        </div>
      </nav>
      {/* SIDEBAR PART */}
      <div
        className={`
                ${
                  openSidebar ? "translateForSidebar" : "translateForSidebarNeg"
                }
                setSidebarForToggle transform transition-all duration-300`}
      >
        <div className="">
          <div className="mobileSidebarTop">
            <div style={{ fontSize: "22px", fontWeight: "bold" }}>Menu</div>
            <button
              className="SidebarToggleBtn"
              onClick={() => setOpenSidebar(false)}
            >
              <GiSplitCross className="crossLogo" />
            </button>
          </div>
          <div className="SidebarItems">
            {navRoutes.map((item) => (
              <div key={item.name} className="SidebarItem">
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className="mobileSidebarBottom">
          <div className="mobileSidebarBottomItem">English</div>
          <div className="mobileSidebarBottomItem">Dark Mode</div>
          <div className="mobileSidebarBottomItem">Documentation</div>
          <div className="mobileSidebarBottomLogout">Log out</div>
          <div className="mobileSidebarBottomLogo">
            <LogoIcon />
          </div>
          <div className="mobileSidebarBottomVersion">version 2.0</div>
        </div>
      </div>
    </header>
  );
};

export default MobileNav;
