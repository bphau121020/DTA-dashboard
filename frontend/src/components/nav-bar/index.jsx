import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import UserAvatar from '../../assets/images/avatar.png';
import { AuthContext } from "../../context/AuthContext";
import { logout as logoutFireBase } from "../../firebase/service";
import { logout } from "../../redux/user/userSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as CalenderIcon } from '../../assets/icons/calendar.svg';
import { ReactComponent as ClockIcon } from '../../assets/icons/clock.svg';
import { makeStyles } from "@material-ui/core";

const Navbar = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const useStyles = makeStyles((theme) => ({
    list: {
      padding: '0 10px'
    }
  }))
  const classes = useStyles();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logoutHandler = () => {
    logoutFireBase();
    dispatch(logout());
  };
  const user = useContext(AuthContext).user;
  const [dateState, setDateState] = useState(new Date());
  useEffect(() => {
    setInterval(() => setDateState(new Date()), 30000);
  }, []);
  return (
    <div className="navbar">
      <div className="navbar__left">
        <div className="navbar__left__title">
          <h3 >Have A Nice Day!</h3>
          <p >Hello {user.firstName}</p>
        </div>
      </div>
      <div className="navbar__center">
        <CalenderIcon fill="#fff" />
        <b>
          {dateState.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </b>
        <ClockIcon fill="#fff" />
        <b>
          {dateState.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
        </b>
      </div>
      <div className="navbar__right">
        <Link to="/input" className="link">INPUT</Link>
        <Link to="/upload" className="link">UPLOAD</Link>
        <div onClick={handleMenu} className="header__menu__item__icon">
          <Avatar alt="User" size="35" round="true" src={UserAvatar} />
        </div>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{ marginTop: 5 }}
        >
          <MenuItem onClick={logoutHandler} sx={{
            fontSize: 16, fontFamily: "'Montserrat', sans-serif"
          }}
            className={classes.list}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
