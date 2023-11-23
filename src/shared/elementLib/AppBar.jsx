import {
  Button,
  ClickAwayListener,
  Container,
  Grid,
  Grow,
  MenuList,
  Paper,
  Popper,
  Stack,
  Tab,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DownArrow from "../../assets/icons/Down-arrow.svg";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import "./Appbar.scss";
import { resetDraft } from "../../components/draftGenerator/draftGeneratorSlice";
import { resetRephraser } from "../../components/rephraser/rephraserSlice";
import { setMainTabValue } from "./appBarSlice";
export default function ButtonAppBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  const { email, isLoggedIn } = useSelector((state) => state.login);
  const { mainTabValue } = useSelector((state) => state.mainTab);
  const handleLogout = () => {
    navigate("/");
  };
  const backToHome = () => {
    navigate("/dashboard");
  };

  const handleContentCreatorTabclick = () => {
    dispatch(resetRephraser());
    dispatch(setMainTabValue(0));
    navigate("/dashboard");
  };

  const handleRepurposeTabclick = () => {
    dispatch(resetDraft());
    dispatch(setMainTabValue(1));
    navigate("/rephraser");
  };
  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }
  return (
    <>
      <AppBar className="grafi-header">
        <Container className="headerContainer" maxWidth={false}>
          <Grid container>
            <Grid item xs={8}>
              <Box className="headerTabWrapper">
                <Box>
                  {email && email.length > 0 && isLoggedIn && (
                    <Tabs
                      value={
                        mainTabValue === 0 ? "/draftGenerator" : "/rephraser"
                      }
                    >
                      <Tab
                        className="headerTabs"
                        label="IntelliKT"
                        value="/dashboard"
                        component={Link}
                        to="/dashboard"
                        onClick={() => handleContentCreatorTabclick()}
                      />
                      {/* <Tab
                        className="headerTabs"
                        label="Rephraser"
                        value="/rephraser"
                        component={Link}
                        to="/rephraser"
                        disabled
                        style={{opacity: 0.4}}
                        onClick={() => handleRepurposeTabclick()}
                      /> */}
                    </Tabs>
                  )}
                </Box>
              </Box>
            </Grid>
            {/* {email && email.length > 0 && isLoggedIn && ( */}
            <Grid className="userWrapper" item xs={4}>
              <Stack className="userWrapper-row" direction="row">
                <div>
                  <Button
                    className="userButton"
                    disableRipple
                    ref={anchorRef}
                    id="composition-button"
                    aria-controls={open ? "composition-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    size="small"
                    onClick={handleToggle}
                  >
                    <Box className="userIcon">
                      <ContactPageIcon fontSize="large" />
                      {/* </Box> */}
                      {/* <Box className="userDownArrow"> */}
                      {/* <img src={DownArrow} alt="down arrow" /> */}
                    </Box>
                  </Button>
                  <Popper
                    className="userPopper"
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="bottom-end"
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === "bottom-start"
                              ? "left top"
                              : "left bottom",
                        }}
                        className="userOption"
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList
                              autoFocusItem={open}
                              id="composition-menu"
                              aria-labelledby="composition-button"
                              onKeyDown={() => handleListKeyDown}
                            >
                              <Button
                                size="small"
                                style={{ textTransform: "none" }}
                                variant="contained"
                                onClick={handleLogout}
                              >
                                Sign Out
                              </Button>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              </Stack>
            </Grid>
            {/* )} */}
          </Grid>
        </Container>
      </AppBar>
    </>
  );
}
