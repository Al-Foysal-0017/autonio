import { useState } from "react";
// import { NavLink } from "react-router-dom";
import { Squash as Hamburger } from "hamburger-react";
import "./SidebarMobile.module.css";
import { navRoutes } from "./SidebarMobileRoute";
import Logo from "../../assets/img/LogoMobile.svg";
// import { GiSplitCross } from "react-icons/gi";
import { IoLanguage } from "react-icons/io5";
import { CgDarkMode } from "react-icons/cg";
import { FiFileText, FiLogOut } from "react-icons/fi";
import LogoIcon from "../../assets/img/icons/logo.svg";
// import profileImg from "../../assets/img/profileImg.svg";

const MobileNav = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <header className="navbarAndSidebar" style={{ marginBottom: "25px" }}>
      {/* NAVBAR PART */}
      <nav className="navbarContainer">
        <div className="navbarContainerWrapper">
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
          <div className="navbarContainerRightItems">
            <div className="profileInfo">
              <span>0xc813...ea5e</span>
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
            <Hamburger
              toggle={setOpenSidebar}
              toggled={openSidebar}
              color="#fff"
            />
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
          <div className="mobileSidebarBottomItem">
            <IoLanguage className="languageIcon" /> <span>English</span>
          </div>
          <div className="mobileSidebarBottomItem">
            <CgDarkMode className="languageIcon" /> <span>Dark Mode</span>
          </div>
          <div className="mobileSidebarBottomItem">
            <FiFileText className="languageIcon" /> <span>Documentation</span>
          </div>
          <div className="mobileSidebarBottomLogout">
            <FiLogOut className="languageIcon" /> Log out
          </div>
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
