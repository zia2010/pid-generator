import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoaderWithMessage } from "../Spinner/Spinner";
import { resetDraft } from "../draftGenerator/draftGeneratorSlice";
import { loggedIn, resetloggedIn } from "./loginSlice";
import { hideSpinner, showSpinner } from "../Spinner/spinnerSlice";
import { resetRephraser } from "../rephraser/rephraserSlice";
import { resetTabValue } from "../../shared/elementLib/appBarSlice";
import { resetNotification } from "../../shared/compositeLib/notificationSlice";

export default function SignIn() {
  const navigate = useNavigate();
  const credentials = [
    { email: "himanshi.domir@globallogic.com", password: "test@123" },
    { email: "prasad@globallogic.com", password: "test@123" },
  ];
  const dispatch = useDispatch();
  const emailRef = useRef(null);
  const pwdRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    dispatch(resetloggedIn());
    dispatch(resetDraft());
    dispatch(hideSpinner());
    dispatch(resetTabValue(0));
    dispatch(resetNotification());
    dispatch(resetRephraser());
  }, []);
  const handleSubmit = (event) => {
    dispatch(showSpinner());
    dispatch(resetDraft());
    dispatch(resetRephraser());
    event.preventDefault();
    const isValidCredentials = credentials.some(
      ({ email, password }) =>
        email === emailRef.current.value && password === pwdRef.current.value
    );
    if (isValidCredentials) {
      dispatch(hideSpinner());
      dispatch(loggedIn(emailRef.current.value));
      navigate("/dashboard");
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        component="h2"
        className="fontFamilyPoppins"
        style={{ paddingTop: "75px", textTransform: "uppercase" }}
      >
        IntellKT POC
      </Typography>
      <Container
        component="main"
        maxWidth="xs"
        style={{
          border: "5px solid #1976d2",
          borderRadius: "25px",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              variant="outlined"
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              inputRef={emailRef}
              autoFocus
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              inputRef={pwdRef}
              type={showPassword ? "text" : "password"} // <-- This is where the magic happens
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ backgroundColor: "black" }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
