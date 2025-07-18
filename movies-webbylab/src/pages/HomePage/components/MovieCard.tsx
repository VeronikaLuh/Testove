import {
  Box,
  Button,
  Card,
  CardContent,
  CardCover,
  Input,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { ListOfFilms } from "./ListOfFilms";
import { useState } from "react";
import { ModalCreate } from "../../AdminPage/ModalCreate";
import { useAppSelector } from "../../../app/hooks";
import homeImage from "../../../images/homeImage.jpg";

export const MovieCard = () => {
  const navigate = useNavigate();
  const [isButtonOpened, setOpen] = useState(false);
  const userData = useAppSelector((state) => state.authSlice);

  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
    <Box
      sx={{
        flexWrap: "wrap",
        p: 0,
        m: 0,
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        overflowY: "auto",
        backgroundColor: "#0D0D0D",
      }}
    >
      <Card
        sx={{
          minWidth: 300,
          width: "100%",
          height: "100%",
          maxWidth: "100vw",
          maxHeight: "100vh",
          position: "relative",
          border: "none",
          borderRadius: 0,
        }}
      >
        <CardCover>
          <img
            src={homeImage}
            srcSet={homeImage}
            loading="lazy"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </CardCover>
        <CardContent>
          <Box textAlign="center" marginTop={3} marginBottom={4}>
            <Typography
              level="body-lg"
              fontWeight="lg"
              fontSize={60}
              sx={{
                fontWeight: "bold",
                textDecoration: "outline",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              }}
              textAlign={"center"}
              textColor="#fff"
              mt={{ xs: 12, sm: 10 }}
            >
              Hi movie fan!
            </Typography>
            <Typography
              level="body-lg"
              fontWeight="lg"
              fontSize={32}
              sx={{
                textDecoration: "outline",
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              }}
              textAlign={{ xs: "start", sm: "center" }}
              textColor="#fff"
              marginTop={2}
            >
              Find the best movies by name or actor!
            </Typography>
            {userData.isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  onClick={handleClickOpen}
                  data-testid="create-track-button"
                  variant="outlined"
                  sx={{
                    color: "#fff",
                    fontSize: 22,
                    textTransform: "none",
                    marginTop: 4,
                    marginBottom: 2,
                    borderWidth: 2,
                    borderColor: "#fff",
                    backgroundColor: "#73020C",
                    "&:hover": {
                      backgroundColor: "#A60311",
                    },
                  }}
                >
                  Add new movie!
                </Button>
                <ListOfFilms />
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  data-testid="create-track-button"
                  variant="outlined"
                  sx={{
                    color: "#fff",
                    fontSize: 22,
                    textTransform: "none",
                    marginTop: 4,
                    marginBottom: 2,
                    borderWidth: 2,
                    borderColor: "#fff",
                    backgroundColor: "#73020C",
                    "&:hover": {
                      backgroundColor: "#A60311",
                    },
                  }}
                >
                  Sign in to add movies!
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
      {isButtonOpened && (
        <ModalCreate value={isButtonOpened} onClose={() => setOpen(false)} />
      )}
    </Box>
  );
};
