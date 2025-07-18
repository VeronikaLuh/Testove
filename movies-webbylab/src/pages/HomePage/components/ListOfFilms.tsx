import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Input,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { searchMovies } from "../../../app/search";
import {
  useGetMoviesQuery,
  useLazyGetMovieByIdQuery,
  type Movie,
} from "../../../api/moviesRtkApi";
import { BookmarkAdd } from "@mui/icons-material";
import { useGetMoviesSearchQuery } from "../../../api/moviesRtkApi";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";


export interface MovieResponseId {
  data: Movie;
  meta: {
    total: number;
  };
}

export const ListOfFilms = () => {
  const dispatch = useDispatch();
  const { search } = useSelector((store) => store);
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState("year");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState<boolean>(false);
  const limit = 9;
  const offset = (currentPage - 1) * limit;

  console.log(search.isLoading);

  const inputOnChange = (event) => {
    setSearchValue(event.target.value);
    dispatch(searchMovies(event.target.value));
  };

  const { data: allMovies, isLoading: isAllLoading } = useGetMoviesQuery({
    sort: sortField,
    order: sortOrder,
    limit,
    offset,
  });
  const { data: searchedMovies, isLoading: isSearchLoading } =
    useGetMoviesSearchQuery({ search: searchValue }, { skip: !searchValue });

  const movies = searchValue ? searchedMovies?.data : allMovies?.data;
  const isLoading = searchValue ? isSearchLoading : isAllLoading;

  const [trigger, { data: movie, isFetching }] = useLazyGetMovieByIdQuery();

  const total = searchValue
    ? searchedMovies?.meta?.total || 0
    : allMovies?.meta?.total || 0;

  const [currentFilm, setCurrentFilm] = useState<MovieResponseId | null>(null);

  useEffect(() => {
    if (movie || open) {
      setCurrentFilm(movie);
    }
  }, [movie, open]);

  if (isLoading) return <p>Loading movies...</p>;
  console.log("movies:", movies);

  return (
    <Box
      sx={{
        backgroundColor: "#260101",
        padding: 2,
        margin: 6,
        borderRadius: 24,
        marginTop: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Input
          onChange={inputOnChange}
          value={searchValue}
          startDecorator={<SearchIcon sx={{ color: `#73020C` }} />}
          endDecorator={
            <Button
              sx={{
                backgroundColor: "#73020C",
                "&:hover": {
                  backgroundColor: "#400101",
                },
              }}
            >
              Search
            </Button>
          }
          color="danger"
          placeholder="Search..."
          sx={{
            "--Input-radius": "13px",
            "--Input-gap": "1px",
            width: `75%`,
            mx: "auto",
            backgroundColor: "#0D0D0D",
            color: "#fff",
          }}
        ></Input>
        <Button
          onClick={() => {
            setSortField("title");
            setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
          }}
          sx={{
            backgroundColor: "#A60311",
            "&:hover": {
              backgroundColor: "#400101",
            },
            color: "white",
          }}
        >
          {sortField === "title" && sortOrder === "ASC" ? "Z → A" : "A → Z"}
        </Button>
      </Box>
      <Box sx={{ padding: 2, color: "#fff" }}>
        <h2>List of Films</h2>
        <p>Here you can find a list of films.</p>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {movies &&
            movies.map((movie) => (
              <Card sx={{ width: 320, backgroundColor: "#73020C" }}>
                <div>
                  <Typography level="title-lg" sx={{ color: "white" }}>
                    {movie.title}
                  </Typography>
                  <IconButton
                    aria-label="bookmark"
                    variant="plain"
                    color="neutral"
                    size="sm"
                    sx={{
                      position: "absolute",
                      top: "0.875rem",
                      right: "0.5rem",
                      color: "white",
                    }}
                  >
                    <BookmarkAdd />
                  </IconButton>
                </div>
                <AspectRatio minHeight="120px" maxHeight="200px">
                  <img
                    src="/src/images/movieImage.jpg"
                    srcSet="/src/images/movieImage.jpg"
                    loading="lazy"
                    alt=""
                  />
                </AspectRatio>
                <CardContent orientation="horizontal">
                  <div>
                    <Typography level="body-lg" sx={{ color: "white" }}>
                      {movie.year}, {movie.format}
                    </Typography>
                  </div>
                  <Button
                    variant="solid"
                    size="md"
                    color="primary"
                    aria-label="Explore movies"
                    onClick={() => {
                      trigger(movie.id);
                      setOpen(true);
                    }}
                    sx={{
                      ml: "auto",
                      alignSelf: "center",
                      fontWeight: 600,
                      backgroundColor: "#A60311",
                      "&:hover": {
                        backgroundColor: "#400101",
                      },
                      color: "white",
                    }}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
        </Box>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={open}
          onClose={() => {
            setOpen(false);
            setCurrentFilm(null);
          }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ModalDialog>
            {!currentFilm ? (
              <Typography>Loading...</Typography>
            ) : (
              <Box>
                <ModalClose
                  onClick={() => {
                    setOpen(false);
                    setCurrentFilm(null);
                  }}
                  sx={{ pointerEvents: "auto", zIndex: 2, m: 2 }}
                />
                <Card
                  key={movie.id}
                  variant="outlined"
                  orientation="horizontal"
                  sx={{
                    maxWidth: 360,
                    "&:hover": {
                      boxShadow: "md",
                      borderColor: "neutral.outlinedHoverBorder",
                    },
                  }}
                >
                  <AspectRatio ratio="1" sx={{ width: 90 }}>
                    <img
                      src="/src/images/movieImage.jpg"
                      srcSet="/src/images/movieImage.jpg"
                      loading="lazy"
                      alt=""
                    />
                  </AspectRatio>
                  <CardContent>
                    <Typography
                      level="title-lg"
                      id="card-description"
                      sx={{ fontWeight: 600 }}
                    >
                      {currentFilm.data.title}
                    </Typography>
                    <Typography
                      level="body-sm"
                      aria-describedby="card-description"
                      sx={{ mb: 1 }}
                    >
                      <Link
                        overlay
                        underline="none"
                        href="#interactive-card"
                        sx={{ color: "text.tertiary" }}
                      >
                        {currentFilm.data.year}, {currentFilm.data.format}
                      </Link>
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography sx={{ mr: 1 }}>Actors:</Typography>
                      {currentFilm.data.actors &&
                      currentFilm.data.actors.length > 0 ? (
                        currentFilm.data.actors.map(
                          (actor: any, index: number) => (
                            <Chip
                              variant="soft"
                              color="danger"
                              sx={{
                                mr: 1,
                                gap: 1,
                                mb: 1,
                              }}
                              key={index}
                            >
                              {typeof actor === "string" ? actor : actor.name}
                            </Chip>
                          )
                        )
                      ) : (
                        <Typography>No actors listed</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
          </ModalDialog>
        </Modal>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(total / limit)}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "white",
                backgroundColor: "#0D0D0D",
                "&:hover": {
                  backgroundColor: "#400101",
                },
                borderRadius: "12px",
              },
              "& .Mui-selected": {
                backgroundColor: "#73020C",
                "&:hover": {
                  backgroundColor: "#400101",
                },
                color: "white",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
