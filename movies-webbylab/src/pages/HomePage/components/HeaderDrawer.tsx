import { Box, Button, List, ListItem, SwipeableDrawer, Toolbar } from "@mui/material";
import React from "react";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { cleanUser } from "../../../app/authSlice";

export const HeaderDrawer = (props: { value: boolean }) => {

  const navigate = useNavigate();
  const userData = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();

    const colorTheme = createTheme({
      components: {
        MuiDrawer: {
          styleOverrides: {
            paper: {
              background: "#0D0D0D",
            },
          },
        },
      },
    });

  const theme = useTheme();
  const { value: isOpen } = props;
  const [state, setState] = React.useState({
    top: false
  });

  const toggleDrawer =
  ( open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, 'top': open });
    };

  return (
    <>
    <ThemeProvider theme={colorTheme}>
      <SwipeableDrawer
        anchor={"top"}
        open={isOpen}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
        sx={{
          flexShrink: 0,
        }}
      >
        <Toolbar/>
        <Box sx={{ overflow: "auto"}}>
          <List>
              <ListItem><Button
                    href="/"
                    sx={{ color: "#fff", fontSize: 18, textTransform: "none" }}>
                    Home
                  </Button></ListItem>
                  <ListItem >
                  {!userData.isAuthenticated ? (
                    <Button
                      onClick={() => navigate("/login")}
                      variant="contained"
                      sx={{ color: "#fff", backgroundColor: "#73020C", "&:hover": { backgroundColor: "#A60311" } }}
                    >
                      Login
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        dispatch(cleanUser());
                        navigate("/login");
                      }}
                      color="success"
                      variant="contained"
                      sx={{ color: "#fff", backgroundColor: "#73020C", "&:hover": { backgroundColor: "#A60311" } }}
                    >
                      Log out
                    </Button>
                  )}</ListItem>
                 
          </List>
        </Box>
      </SwipeableDrawer>
      </ThemeProvider>
    </>
  );
};
