import { useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import "./SidebarMobile.module.css";
import Logo from "../../assets/img/LogoMobile.svg";
import LogoIcon from "../../assets/img/icons/logo.svg";
import { firstRoutes, secondRoutes, lastRoutes } from "../../routes";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, withRouter } from "next/router";
// nodejs library that concatenates classes
import classnames from "classnames";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
// react library that creates nice scrollbar on windows devices
import PerfectScrollbar from "react-perfect-scrollbar";
// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Button,
} from "reactstrap";
import { PrimaryButton, DefaultButton } from "../Buttons";
import styled from "styled-components";
import Typography from "../Typography";

import LanguageIcon from "../../assets/img/icons/language.svg";
import ModeIcon from "../../assets/img/icons/theme.svg";
import DocumentIcon from "../../assets/img/icons/documents.svg";
import LogoutIcon from "../../assets/img/icons/log_out.svg";
import DropdownIcon from "../../assets/img/icons/dropdown.svg";
import CopyIcon from "../../assets/img/icons/copy.svg";
import Switch from "react-switch";
import WalletModal from "../WalletModal";
import { useUser } from "contexts/UserContext";
import { useWeb3React } from "@web3-react/core";
import { formatAddress } from "../../utils/formatters";
import { IconButton } from "@material-ui/core";
import { useTheme } from "../../contexts/ThemeContext";
import { getCurrentTier } from "../../utils/ethereum";
import { stakingPlans } from "../../utils/constants";

const TopBar = styled.div`
  border-bottom: ${({ darkMode }) =>
    darkMode ? "1px solid #2f3641" : "1px solid #F5F5F5"};
  text-align: center;
  margin-bottom: 40px;
  padding: 16px;
`;

const InnerNavBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${({ logged }) =>
    logged ? "calc(100% - 161px)" : "calc(100% - 120px)"};
`;

const DisableLabelWrapper = styled.div`
  background: ${({ theme }) => theme.color.monoGrey2};
  padding: 2px 4px;
  color: ${({ theme }) => theme.color.monoGrey4};
  border-radius: 10px;
  font-size: 10px;
`;
const DropdownMenu = ({ menus }) => (
  <div className="d-flex justify-content-between w-100">
    <Typography color="monoWhite" size={14}>
      {menus[0]}
    </Typography>
    <DropdownIcon className="ml-2" />
  </div>
);

const MobileNav = ({ rtlActive, router }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const { account, library, disconnect } = useUser();
  const { darkMode, setDarkMode } = useTheme();
  const [currentTier, setCurrentTier] = useState(0);
  const nextRouter = useRouter();

  useEffect(() => {
    if (!account || !library) return;

    const loadInfo = async () => {
      const currentTier = await getCurrentTier(null, account, library);

      setCurrentTier(currentTier);
    };

    loadInfo();
  }, [account, library]);

  const activeRoute = (routeName) => {
    // if (routeName === "/") return router.pathname === "/" ? "active" : "";
    // return router.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  const openExternalLink = (path) => {
    window.open(path, "_blank");
  };

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes, disabled) => {
    return routes.map((prop, key) => (
      <NavItem className={activeRoute(prop.layout + prop.path)} key={key}>
        {prop.isExternal ? (
          <NavLink
            className={`d-flex justify-content-between ${activeRoute(
              prop.layout + prop.path
            )}`}
            disabled={disabled}
            onClick={() => openExternalLink(prop.path)}
          >
            <div>
              {prop.icon}
              <span className="nav-link-text ml-3">{prop.name}</span>
            </div>
            {disabled && <DisableLabelWrapper>Soon</DisableLabelWrapper>}
          </NavLink>
        ) : (
          <Link
            href={prop.isExternal ? prop.path : prop.layout + prop.path}
            passHref={prop.isExternal}
          >
            <NavLink
              className={`d-flex justify-content-between ${activeRoute(
                prop.layout + prop.path
              )}`}
              disabled={disabled}
            >
              <div>
                {prop.icon}
                <span className="nav-link-text ml-3">{prop.name}</span>
              </div>
              {disabled && <DisableLabelWrapper>Soon</DisableLabelWrapper>}
            </NavLink>
          </Link>
        )}
      </NavItem>
    ));
  };

  const LogOutMenu = () => (
    <NavItem className="mb-4 activated">
      <NavLink onClick={disconnect}>
        <LogoutIcon className="mr-3" />
        <span className="nav-link-text">Log Out</span>
      </NavLink>
    </NavItem>
  );

  const LanguageMenu = () => (
    <NavItem className="activated">
      <NavLink>
        <div className="d-flex justify-content-between w-100">
          <LanguageIcon className="mr-3" />
          <DropdownMenu menus={["English"]} />
          {/* <span className="nav-link-text">Lout out</span> */}
        </div>
      </NavLink>
    </NavItem>
  );

  const ModeMenu = () => (
    <NavItem className="activated">
      <NavLink>
        <div className="d-flex justify-content-between w-100">
          <div>
            <ModeIcon className="mr-3" />
            <span className="nav-link-text">Dark mode</span>
          </div>
          <Switch
            onChange={setDarkMode}
            checked={darkMode}
            onColor="#507869"
            onHandleColor="#27C29D"
            handleDiameter={22}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            // activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={15}
            width={38}
            className="react-switch"
            id="material-switch"
          />
        </div>
      </NavLink>
    </NavItem>
  );

  const DocumentationMenu = () => (
    <NavItem className="activated">
      <NavLink
        onClick={() =>
          openExternalLink(
            "https://app.gitbook.com/@autonio/s/autonio-foundation"
          )
        }
      >
        <DocumentIcon className="mr-3" />
        <span className="nav-link-text">Documentation</span>
      </NavLink>
    </NavItem>
  );

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
            {account ? (
              <div
                className="d-flex align-items-center"
                style={{
                  background: "#2C323D",
                  paddingLeft: "15px",
                  borderRadius: "5px",
                }}
              >
                <Typography color="monoWhite" size={14} weight={600}>
                  {formatAddress(account)}
                </Typography>
                <IconButton aria-label="delete">
                  <CopyIcon />
                </IconButton>
              </div>
            ) : (
              <PrimaryButton
                onClick={() => setOpenWalletModal(true)}
                className="w-100"
              >
                Connect Wallet
              </PrimaryButton>
            )}
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

          {account && (
            <div className="text-align-left" style={{ marginTop: "20px" }}>
              <div className="d-flex align-items-center justify-content-between">
                <Typography
                  color="textGrey"
                  size={12}
                  weight={400}
                  className="d-flex align-items-center"
                >
                  Plan:
                  <Typography
                    color="monoWhite"
                    size={14}
                    weight={600}
                    className="ml-2"
                  >
                    {stakingPlans[currentTier].name}
                  </Typography>
                </Typography>
                <DefaultButton
                  size={12}
                  weight={600}
                  background="monoGrey2"
                  color="monoWhite"
                  className="px-2 py-1"
                  onClick={() => nextRouter.push("/staking")}
                >
                  upgrade
                </DefaultButton>
              </div>
            </div>
          )}

          <div className="SidebarItems">
            <div className="navbar-first">
              <Nav navbar style={{ cursor: "pointer" }}>
                {createLinks(firstRoutes)}
              </Nav>
              <Nav navbar style={{ cursor: "pointer" }}>
                {createLinks(secondRoutes, true)}
              </Nav>
            </div>
          </div>
        </div>
        <div className="mobileSidebarBottom">
          <Nav navbar>
            <LanguageMenu />
            <ModeMenu />
            <DocumentationMenu />
            <div className="mt-6" />

            {account && <LogOutMenu />}
            <div>
              <LogoIcon />
              <Typography color="textGrey" size={10} className="mt-4">
                Version 2.0
              </Typography>
            </div>
          </Nav>
        </div>
      </div>
      <WalletModal open={openWalletModal} setOpen={setOpenWalletModal} />
    </header>
  );
};

export default MobileNav;
