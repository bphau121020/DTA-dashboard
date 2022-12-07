import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import logo from "../../assets/images/Logo.png";
import { auth } from "../../firebase/config";
import { getDocData } from "../../firebase/service";
import { login } from "../../redux/user/userSlice";
import { ReactComponent as Background } from '../../assets/images/background.svg';

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),

  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minium 8 charaters length")
    .required("Password is required"),
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const navigate = useNavigate();
  let [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const [snackData, setSnackData] = React.useState({
    isOpen: false,
    message: ""
  });
  let data;

  if (user != null) {
    data = {
      uid: user.uid,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
  }

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        dispatch(login(data));
      }
    }
  }, [user]);

  const handleClick = (message) => {
    setSnackData({
      isOpen: true,
      message: message
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackData({ ...snackData, isOpen: false });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: () => {
      handleSignIn();
    },
  });

  async function handleSignIn() {
    await signInWithEmailAndPassword(
      auth,
      formik.values.email,
      formik.values.password
    ).then(async (userCredential) => {
      user = userCredential.user;
      const data = await getDocData(user);
      if (data.role === "ADMIN") {
        dispatch(login(data));
        navigate("/input");
      }
      else {
        handleClick("You don't have permission to access this resource.")
      }
    })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/wrong-password')
          handleClick(' Wrong username or password!')
        else if (errorCode === "auth/too-many-requests")
          handleClick('Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.')
      });
  };

  return (
    <Stack sx={{ width: '100%', alignItems: 'center' }}>
      <Snackbar open={snackData.isOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%', fontSize: '14px' }}>
          {snackData.message}
        </Alert>
      </Snackbar>
      <div className="login">
        <div className="login__left">
          <form className="login__left__form" onSubmit={formik.handleSubmit}>
            <div className="login__left__form--logo">
              <img src={logo} style={{ zIndex: '1' }} alt="" />
              <span style={{ zIndex: '1' }}>DTA</span>
            </div>
            <section className="login__left__form--content">
              <div className="form-title">
                <h1 className="title">Sign In</h1>
                <span className="sub">Sign in stay connected</span>
              </div>
              <div className="form-input form-email">
                <div className="">Email</div>
                <input
                  className=""
                  type="text"
                  name="email"
                  placeholder="Type your username"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                ></input>
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div style={{ marginBottom: "10px", color: "red", fontSize: '14px' }}>
                  {formik.errors.email}
                </div>
              ) : null}
              <div className="form-input form-password">
                <div className="">Password</div>
                <input
                  className=""
                  type="Password"
                  name="password"
                  placeholder="Type your Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                ></input>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div style={{ marginBottom: "10px", color: "red", fontSize: '14px' }}>
                  {formik.errors.password}
                </div>
              ) : null}
              <div className="form-btn">
                <button className="btn-signin" type="submit">Sign in</button>
              </div>
            </section>
          </form>
        </div>
        <div className="login__right">
          <Background />
        </div>
      </div>
    </Stack>
  );
};

export default Login;
