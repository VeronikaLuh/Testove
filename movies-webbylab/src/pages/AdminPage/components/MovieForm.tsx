import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Typography, Chip } from "@mui/joy";
import { useGetMovieByIdQuery } from "../../../api/moviesRtkApi";

interface MovieFormProps {
  movieId: number;
  onSubmit: (movie: {
    id?: number;
    title: string;
    year: number;
    format: string;
    actors: string[];
  }) => Promise<void>;
  buttonText: string;
}

export const MovieForm = ({
  movieId,
  onSubmit,
  buttonText,
}: MovieFormProps) => {
  const { data: movie, isLoading: isLoading } = useGetMovieByIdQuery(movieId);

  const [title, setTitle] = useState(movie?.data.title || "");
  const [year, setYear] = useState(movie?.data.year?.toString() || "");
  const [format, setFormat] = useState(movie?.data.format || "");
  const [actorName, setActorName] = useState("");
  const [actors, setActors] = useState<string[]>(movie?.data.actors || []);

  const [errors, setErrors] = useState<{
    title?: string;
    year?: string;
    format?: string;
    actors?: string;
  }>({});

  useEffect(() => {
    if (movie) {
      setTitle(movie.data.title);
      setYear(movie.data.year?.toString() || "");
      setFormat(movie.data.format);
      const actors = movie.data.actors.map((i: { name: string }) => i.name);
      setActors(actors || []);
    }
  }, [movie]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!year.trim()) newErrors.year = "Year is required.";
    else {
      const yearNum = Number(year);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2021)
        newErrors.year = "Year must be a number between 1900 and 2021.";
    }
    if (!format.trim()) newErrors.format = "Format is required.";
    if (actors.length === 0)
      newErrors.actors = "At least one actor is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addActor = () => {
    if (actorName.trim() && !actors.includes(actorName.trim())) {
      setActors([...actors, actorName.trim()]);
      setActorName("");
    }
  };

  const removeActor = (index: number) => {
    console.warn("Removing actor at index:", index);
    console.warn(actors);
    setActors(actors.filter((_, i) => i !== index));
    console.warn(actors);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      return;
    }

      const newMovie = {
        id: movieId,
        title,
        year: Number(year),
        format,
        actors,
      };

      console.log("Submitting movie:", newMovie);

      try {
        await onSubmit(newMovie);
      
      } catch (error) {
        setErrors({ ...errors, title: "Failed to update movie." });
      }
    
  }

  return (
    <Box
      data-testid="movie-form"
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        gap: 2,
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <FormControl error={!!errors.title}>
        <Input
          data-testid="input-title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && (
          <FormHelperText data-testid="error-title">
            {errors.title}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors.year}>
        <Input
          data-testid="input-year"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        {errors.year && (
          <FormHelperText data-testid="error-year">
            {errors.year}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors.format}>
        <InputLabel id="format-label">Choose format</InputLabel>
        <Select
          labelId="format-label"
          value={format}
          label="Choose format"
          sx={{ color: "black" }}
          onChange={(e) => setFormat(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="VHS">VHS</MenuItem>
          <MenuItem value="DVD">DVD</MenuItem>
          <MenuItem value="Blu-Ray">Blu-Ray</MenuItem>
        </Select>
        {errors.format && (
          <FormHelperText data-testid="error-format">
            {errors.format}
          </FormHelperText>
        )}
      </FormControl>

      <Box>
        <Typography level="title-md" mb={1}>
          Actors:
        </Typography>
        <FormControl sx={{ mt: 1, maxWidth: 260 }}>
          <InputLabel>Add Actor</InputLabel>
          <Input
            value={actorName}
            onChange={(e) => setActorName(e.target.value)}
            placeholder="Enter actor name"
            sx={{ mb: 1 }}
          />
          <Button onClick={addActor} sx={{ mb: 1 }}>
            Add Actor
          </Button>
          <ul>
            {actors && actors.length > 0 ? (
              actors.map((actor: any, index: number) => (
                <li
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Chip variant="soft" color="primary" sx={{ mr: 1 }}>
                    {typeof actor === "string" ? actor : actor.name}
                  </Chip>
                  <Button
                    size="small"
                    color="error"
                    sx={{ minWidth: 0, padding: "2px 8px" }}
                    onClick={() => removeActor(index)}
                  >
                    Remove
                  </Button>
                </li>
              ))
            ) : (
              <li>No actors listed</li>
            )}
          </ul>
        </FormControl>
      </Box>

      <Button
        type="submit"
        data-testid="submit-button"
        sx={{ backgroundColor: "#400101", color: "white" }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};
