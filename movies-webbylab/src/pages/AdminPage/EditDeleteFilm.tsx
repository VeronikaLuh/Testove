import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  PaginationItem,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useEditMovieMutation,
  useDeleteMovieMutation,
  useGetMoviesQuery,
  type Movie,
} from "../../api/moviesRtkApi";
import { MovieForm } from "./components/MovieForm";

export const EditDeleteFilm = () => {
  const [httpError, setHttpError] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentFilm, setCurrentFilm] = useState<Movie | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filmToDelete, setFilmToDelete] = useState<Movie | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;
  const offset = (currentPage - 1) * limit;

  const { data: movies, isLoading } = useGetMoviesQuery({ limit, offset });
  const [editMovie] = useEditMovieMutation();
  const [deleteMovie] = useDeleteMovieMutation();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleEditSubmit = async (updatedMovie: Movie) => {
    try {
      await editMovie(updatedMovie).unwrap();
      setEditDialogOpen(false);
      setHttpError(null);
    } catch (e) {
      setHttpError("Failed to update movie. Please check your data.");
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    await deleteMovie(id);
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Stack sx={{ color: "#872341" }} spacing={2} direction="row">
        <CircularProgress color="inherit" />
      </Stack>
    );
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  

  return (
    <Box
      sx={{
        width: 450,
        gap: 2,
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Typography>Number of results: ({movies?.meta.total})</Typography>
      <Typography sx={{ fontSize: 14 }}>
        {offset + 1} to{" "}
        {typeof movies?.meta.total === "number"
          ? Math.min(offset + limit, movies.meta.total)
          : offset + limit}{" "}
        of {movies?.meta.total ?? 0} items:
      </Typography>
      {movies?.data?.map((movie) => (
        <Box
          key={movie.id}
          sx={{ display: "flex", flexDirection: "row", gap: 2 }}
        >
          <div>
            <Typography>{movie.title}</Typography>
            <Typography>
              {movie.year}, {movie.format}
            </Typography>
            <Typography>
              {" "}
              Actors:{" "}
              {Array.isArray(movie.actors) && movie.actors.length > 0
                ? movie.actors.map((actor: any) => actor.name).join(", ")
                : "No actors listed"}
            </Typography>
          </div>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCurrentFilm(movie);
                setEditDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setFilmToDelete(movie);
                setDeleteDialogOpen(true);
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      ))}
      {(movies?.meta?.total ?? 0) > limit && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil((movies?.meta?.total ?? 0) / limit)}
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
      )}

      <Dialog
        data-testid="confirm-dialog"
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>Edit movie</DialogTitle>
        <DialogContent>
          {currentFilm && (
            <MovieForm
              movieId={currentFilm.id!}
              onSubmit={handleEditSubmit}
              buttonText="Update Movie"
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        data-testid="confirm-dialog"
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{filmToDelete?.title}",
          {filmToDelete?.year}?
        </DialogContent>
        <DialogActions>
          <Button
            data-testid="cancel-delete"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteConfirm(filmToDelete?.id!)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
