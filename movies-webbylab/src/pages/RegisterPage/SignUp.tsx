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
import { common } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import type { UserRegister } from "../../models/UserModel.ts/UserModel";
import { useRegisterMutation } from "../../api/authApi";
import { setCookies } from "../../helpers/setCookies";
import { ACCESS_TOKEN } from "../../constants/cookies";
import { useAppDispatch } from "../../app/hooks";
import { setUser } from "../../app/authSlice";
import { moviesApi } from "../../api/moviesRtkApi"; 
import signUpImage from "../../images/signup.jpg";

type SignInFormElement = HTMLFormElement & {
  elements: {
    username: { value: string };
    email: { value: string };
    password: { value: string };
    confirmPassword: { value: string };
  };
};

export default function SignUpPage() {
  const [register] = useRegisterMutation();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<SignInFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.elements;

    const name = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

   
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const data: UserRegister = {
      name,
      email,
      password,
      confirmPassword,
    };

    try {
      const response = await register(data).unwrap();
      setCookies(ACCESS_TOKEN, response.token, 1);
      dispatch(setUser());
      dispatch(moviesApi.util.invalidateTags(["Movie"]));
      navigate("/");
    } catch (err: any) {
      setError(err?.data?.message || "Registration failed.");
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
          backdropFilter: "blur(15px)",
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
                <Typography level="h3">Sign Up</Typography>
                <Typography level="body-sm">
                  Have an account?{" "}
                  <Link
                    onClick={() => navigate("/login")}
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
                    Log in!
                  </Link>
                </Typography>
                {error && (
                  <Typography
                    level="body-sm"
                    color="danger"
                    sx={{ mt: 1, }}
                  >
                    {error}
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Stack gap={4} sx={{ mt: 2 }}>
              <form onSubmit={handleSubmit}>
                <FormControl sx={{ mb: 2 }}>
                  <FormLabel>Username</FormLabel>
                  <Input name="username" type="text" required />
                </FormControl>

                <FormControl sx={{ mb: 2 }}>
                  <FormLabel>Email</FormLabel>
                  <Input name="email" type="email" required />
                </FormControl>

                <FormControl sx={{ mb: 2 }}>
                  <FormLabel>Password</FormLabel>
                  <Input name="password" type="password" required />
                </FormControl>

                <FormControl sx={{ mb: 2 }}>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input name="confirmPassword" type="password" required />
                </FormControl>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      backgroundColor: "#A60311",
                      "&:hover": {
                        backgroundColor: "#7a0210",
                      },
                    }}
                  >
                    Sign Up
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
          backgroundImage: `url(${signUpImage})`,
        }}
      />
    </ThemeProvider>
  );
}
