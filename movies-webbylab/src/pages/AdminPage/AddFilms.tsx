
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Select,
  Typography,
} from "@mui/material";
import { useAddMovieMutation, useImportMoviesMutation } from "../../api/moviesRtkApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Chip } from "@mui/joy";

export interface AddMovieRequest {
  title: string;
  year: string;
  format: string;
  actors: string[];
}

export const AddFilms = () => {
  const [mode, setMode] = useState<"manual" | "file">("manual");

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [format, setFormat] = useState("");
  const [actorName, setActorName] = useState("");
  const [actors, setActors] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    year?: string;
    format?: string;
    actors?: string;
    file?: string;
  }>({});

  const [addMovie] = useAddMovieMutation();
  const [importMovies] = useImportMoviesMutation();
  

  const addActor = () => {
    if (actorName.trim()) {
      setActors([...actors, actorName.trim()]);
      setActorName("");
    }
  };

  const removeActor = (index: number) => {
    setActors(actors.filter((_, i) => i !== index));
  };

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

  const validateFile = () => {
    const newErrors: typeof errors = {};
    if (!file) {
      newErrors.file = "File is required.";
    } else if (!file.name.endsWith(".txt")) {
      newErrors.file = "Only .txt files are supported.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "manual") {
      if (!validate()) return;

      const movie = {
        title,
        year: Number(year),
        format,
        actors: actors.filter((a) => a.trim() !== ""),
      };
      try {
        await addMovie(movie).unwrap();
        setSuccess(true); 
        setTitle(""); 
        setYear("");
        setFormat("");
        setActors([]);
        setActorName("");
        setTimeout(() => setSuccess(false), 2000);
      } catch (e) {
        setErrors({ ...errors, title: "Failed to add movie." });
      }
    } else if (mode === "file") {
      if (!validateFile()) return;

      const formData = new FormData();
      formData.append("movies", file!);
      try {
        await importMovies(formData).unwrap();
        setSuccess(true);
        setFile(null);
        setErrors({}); 
        if (document.getElementById("file-input")) {
          (document.getElementById("file-input") as HTMLInputElement).value =
            "";
        }
        setTimeout(() => setSuccess(false), 2000);
      } catch (e) {
        setErrors({ ...errors, file: "Failed to import movies." });
      }
    }
  };

  return (
    <Box
      data-testid="track-form"
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
      {success && (
        <Box sx={{ color: "green", mb: 2, textAlign: "center" }}>
          Movie added successfully!
        </Box>
      )}
      <FormControl component="fieldset">
        <FormLabel component="legend">Add movie via</FormLabel>
        <RadioGroup
          row
          value={mode}
          onChange={(e) => setMode(e.target.value as "manual" | "file")}
        >
          <FormControlLabel value="manual" control={<Radio />} label="Manual" />
          <FormControlLabel value="file" control={<Radio />} label="File" />
        </RadioGroup>
      </FormControl>

      {mode === "manual" ? (
        <>
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
              value={format}
              label="Choose format"
              sx={{ color: "black" }}
              onChange={(e) => setFormat(e.target.value)}
            >
              <MenuItem value="VHS">VHS</MenuItem>
              <MenuItem value="DVD">DVD</MenuItem>
              <MenuItem value="Blu-Ray">Blu-Ray</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle1" mb={1}>
              Actors:
            </Typography>
            <FormControl sx={{ mt: 1, width: 260 }}>
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
              {errors.actors && (
                <FormHelperText data-testid="error-title">
                  {errors.actors}
                </FormHelperText>
              )}
              <ul>
                {actors.map((actor, index) => (
                  <li
                    key={index}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Chip variant="soft" color="primary" sx={{ mr: 1 }}>
                      {actor}
                    </Chip>
                    <Button
                      size="small"
                      color="error"
                      sx={{ ml: 1, minWidth: 0, padding: "2px 8px" }}
                      onClick={() => removeActor(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </FormControl>
          </Box>
        </>
      ) : (
        <FormControl>
          <Input
            id="file-input"
            type="file"
            inputProps={{ accept: ".txt" }}
            onChange={(e) => {
              if (e.target.files?.[0]) setFile(e.target.files[0]);
            }}
          />
          {errors.file && (
            <FormHelperText data-testid="error-title" sx={{ color: "red" }}>
              {errors.file}
            </FormHelperText>
          )}
        </FormControl>
      )}

      <Button
        type="submit"
        data-testid="submit-button"
        sx={{ backgroundColor: "#400101", color: "white" }}
      >
        Add Movie
      </Button>
    </Box>
  );
};
