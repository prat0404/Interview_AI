"use client";
import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Divider,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logo from "../public/logo.png";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import AccountInfoPopup from "./AccountInfoPopup";
import Image from 'next/image';
import logo from '../public/logo.png';



const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    borderRadius: "1rem",
    width: "23.5rem",
    padding: "1.5rem 0px",
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 24px 48px",
    border: "1px solid transparent",
    maxWidth: "calc(100vw - 2rem)",
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "column",
  },
});

const StyledItem = styled(MenuItem)({
  padding: "0.875rem 1.5rem",
  borderRadius: 0,
  transition: "background-color 0.3s ease-in-out",
  margin: "0px",
  userSelect: "none",
  cursor: "pointer",
  backgroundColor: "unset",
  color: "var(--accent)",
  WebkitBoxAlign: "center",
  alignItems: "center",
  fontFamily: "inherit",
  fontWeight: "400",
  fontSize: "0.8125rem",
  lineHeight: "1.25",
  minHeight: "2.25rem",
  letterSpacing: "0.5px",
  flex: "1 1 0%",
  gap: "1rem",
  WebkitBoxPack: "start",
  justifyContent: "flex-start",
});



function Navbar() {

  const { user, logOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [handleManageAccount, setHandleManageAccount] = useState(false);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await logOut();
    handleMenuClose();
    setHandleManageAccount(false);
  };

  const handleManageAccountPopup = (e: any) => {
    handleMenuClose();
    setHandleManageAccount(true);
  };



  return (
    <div>
      <div className="bg-gray-950 border-gray-800">
        <div className="container flex items-center justify-between h-14 px-4 md:px-6 mx-auto">
          <Link className="flex items-center space-x-2 text-sm font-medium leading-none" href="/">
            <Image src={logo} alt="Logo" width={40} height={40} />

          </Link>

          {/* <nav className="hidden md:flex items-center space-x-4">
            <Link className="font-medium text-gray-100 hover:underline" href="#">
              Features
            </Link>
            <Link className="font-medium text-gray-100 hover:underline" href="#">
              Pricing
            </Link>
            <Link className="font-medium text-gray-100 hover:underline" href="#">
              Contact
            </Link>
          </nav> */}

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div>
                <IconButton
                  size="large"
                  color="inherit"
                  aria-label="menu"
                  aria-controls="menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  className="text-gray-100 hover:text-gray-300"
                  style={{ width: "3.5rem", height: "3.5rem" }}
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile Picture"
                      width={10}
                      height={10}
                      className="rounded-full"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <AccountCircleIcon
                      style={{
                        maxWidth: "100%" as const,
                        width: "100%",
                        height: "auto",
                        display: "block",
                        verticalAlign: "middle",
                        overflowClipMargin: "content-box",
                        overflow: "clip",
                      }}
                    />
                  )}
                </IconButton>

                <StyledMenu
                  id="menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <div style={styles.menuHeader}>
                    <div style={styles.avatarContainer}>
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="Profile Picture"
                          width={100}
                          height={100}
                          className="rounded-full"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      ) : (
                        <AccountCircleIcon style={styles.avatar} />
                      )}
                    </div>
                    <div style={styles.userInfo}>
                      <Typography variant="body1">{user.email}</Typography>
                      {(!user.displayName || !user.photoURL) && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{
                            border: "1px solid red",
                            textAlign: "center",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            color: "red",
                          }}
                        >
                          PROFILE INCOMPLETE
                        </Typography>
                      )}
                    </div>
                  </div>
                  <StyledItem onClick={handleManageAccountPopup}>Manage Account</StyledItem>
                  <StyledItem onClick={handleSignOut}>Sign Out</StyledItem>
                </StyledMenu>

                {handleManageAccount && (
                  <AccountInfoPopup user={user} onClose={() => setHandleManageAccount(false)} />
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link className="inline-block h-10 w-20 flex items-center justify-center rounded-md border border-gray-800 bg-black text-white border-gray-800"
                  href="/login">
                  Sign in
                </Link>

                {/* <Link href="/login?mode=register"
                  className="inline-block h-10 w-20 flex items-center justify-center rounded-md border border-gray-800 bg-gray-50 text-gray-900  border-gray-800"            
                >
                  Sign up
                </Link> */}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );


}


const styles = {
  navbar: {
    backgroundColor: "#fff",
    color: "#172554",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 7vw",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    lineHeight: "1.5rem",
    fontWeight: "600",
    fontSize: "0.875rem",
  },
  menuHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0px 1.5rem",
    marginBottom: "0.5rem",
  },
  avatarContainer: {
    borderRadius: "50%",
    overflow: "hidden",
    width: "2.75rem",
    height: "2.75rem",
    backgroundColor: "rgba(0, 0, 0, 0.24)",
    boxShadow: "var(--cl-shimmer-hover-shadow)",
    transition: "box-shadow 280ms ease-out 0s",
    marginRight: "0.5rem",
  },
  avatar: {
    // objectFit: "cover",
    maxWidth: "100%" as const,
    width: "100%",
    height: "auto",
    display: "block",
    verticalAlign: "middle",
    overflowClipMargin: "content-box",
    overflow: "clip",
  },
  userInfo: {
    display: "flex",
    flexFlow: "column",
    minWidth: "0px",
    textAlign: "left" as const,
  },
};

export default Navbar;


function User2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  )
}