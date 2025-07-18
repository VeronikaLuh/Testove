import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { ThemeProvider } from "@mui/joy";
import { common, red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/authApi";
import { useAppDispatch } from "../../app/hooks";
import type { UserLogin } from "../../models/UserModel.ts/UserModel";
import { setCookies } from "../../helpers/setCookies";
import { ACCESS_TOKEN } from "../../constants/cookies";
import { setUser } from "../../app/authSlice";
import { moviesApi } from "../../api/moviesRtkApi";
import signInImage from "../../images/signin.jpg";

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface ValidationErrors {
  email: boolean;
  password: boolean;
}

export default function SignInPage() {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const [validationErrors, setValidationErrors] =
    React.useState<ValidationErrors>({
      email: false,
      password: false,
    });
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<SignInFormElement>) => {
    event.preventDefault();

    const formElements = event.currentTarget.elements;
    const email = formElements.email.value.trim();
    const password = formElements.password.value.trim();

    
    const errors: ValidationErrors = {
      email: email === "",
      password: password === "",
    };

    setValidationErrors(errors);

    if (errors.email || errors.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const data: UserLogin = {
      email,
      password,
    };

    try {
      const response = await login(data).unwrap();
      if (!response.token) {
        setErrorMessage("Incorrect email or password.");
        return;
      }
      setCookies(ACCESS_TOKEN, response.token, 1);
      dispatch(setUser());
      dispatch(moviesApi.util.invalidateTags(["Movie"]));
      navigate("/");
    } catch (error) {
      setErrorMessage("Incorrect email or password.");
    }
  };


  return (
    <ThemeProvider>
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
            "--Cover-width": "50vw", // must be `vw` only
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(255 255 255 / 0.2)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width:
              "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
            maxWidth: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: "flex",
              alignItems: "left",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                gap: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography level="title-lg">MovieFan</Typography>
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .${formLabelClasses.asterisk}`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography level="h3">Sign in</Typography>
                <Typography level="body-sm">
                  New to company?{" "}
                  <Link
                    onClick={() => navigate("/register")}
                    level="title-sm"
                    sx={{
                      color: "#A60311",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#7a0210",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign up!
                  </Link>
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{ color: "red" }}
                  display={errorMessage ? "block" : "none"}
                >
                  {errorMessage}
                </Typography>
              </Stack>
            </Stack>

            <Stack gap={4} sx={{ mt: 2 }}>
              <form onSubmit={handleSubmit}>
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input
                    error={validationErrors.email}
                    type="email"
                    name="email"
                  />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input
                    error={validationErrors.password}
                    type="password"
                    name="password"
                  />
                </FormControl>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  ></Box>
                  <Button
                    type="submit"
                    sx={{
                      backgroundColor: "#A60311",
                      "&:hover": {
                        backgroundColor: "#7a0210",
                      },
                    }}
                    fullWidth
                  >
                    Sign In
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box
            component="footer"
            sx={{
              py: 3,
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Typography sx={{ color: common.black }}>
              {"Copyright © "}
              <Link
                sx={{ color: common.black }}
                href="https://your-website.com/"
              >
                MovieFan
              </Link>{" "}
              {new Date().getFullYear()}
              {"."}
            </Typography>
            <Typography>
              <Link
                onClick={() => navigate("/")}
                sx={{ marginRight: 4, color: common.black }}
              >
                Home
              </Link>{" "}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${signInImage})`,
        }}
      />
    </ThemeProvider>
  );
}
