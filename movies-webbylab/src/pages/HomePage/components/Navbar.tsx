import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/joy";
import {
  AppBar,
  Toolbar,
  createTheme,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { HeaderDrawer } from "./HeaderDrawer";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { cleanUser } from "../../../app/authSlice";
import { moviesApi } from "../../../api/moviesRtkApi";


export const Navbar = () => {
  const greenTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#0D0D0D",
      },
    },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.authSlice);


  return (
    <Box sx={{ display: "flex", paddingBottom: 7 }}>
      <ThemeProvider theme={greenTheme}>
        <AppBar
          position="absolute"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              color="common.white"
              sx={{ my: 2, fontSize: 22, flexGrow: 1, paddingRight: 2 }}
            >
              MovieFan
            </Typography>
            {isMobile ? (
              <Box>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="menu"
                  sx={{ mr: 2, alignItems: "flex-end", color: "white" }}
                  onClick={() => setIsMenuOpened(!isMenuOpened)}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box>
                  <Button
                    onClick={() => navigate("/")}
                    sx={{
                      color: "#fff",
                      fontSize: 18,
                      textTransform: "none",
                    }}
                  >
                    Home
                  </Button>
                </Box>
                {!userData.isAuthenticated ? (
                  <Button
                    onClick={() => navigate("/login")}
                    variant="contained"
                    sx={{
                      color: "#fff",
                      backgroundColor: "#73020C",
                      "&:hover": { backgroundColor: "#A60311" },
                    }}
                  >
                    Login
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                          dispatch(cleanUser());
                          dispatch(moviesApi.util.resetApiState());
                      navigate("/login");
                    }}
                    variant="contained"
                    sx={{
                      color: "#fff",
                      backgroundColor: "#73020C",
                      "&:hover": { backgroundColor: "#A60311" },
                    }}
                  >
                    Log out
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>
        {isMenuOpened && <HeaderDrawer value={isMenuOpened} />}
      </ThemeProvider>
    </Box>
  );
};
