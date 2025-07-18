import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Dialog,
  IconButton,
} from "@mui/material";
import * as React from "react";
import CreateIcon from "@mui/icons-material/Create";
import AddIcon from "@mui/icons-material/Add";
import { AddFilms } from "./AddFilms";
import CloseIcon from "@mui/icons-material/Close";
import { EditDeleteFilm } from "./EditDeleteFilm";

export const ModalCreate = (props: { value: boolean; onClose: () => void }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
   props.onClose();
  };

  const [value, setValue] = React.useState(0);

  return (
    <Dialog
      data-testid="confirm-dialog"
      open={props.value}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      color="#872341"
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#872341",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ width: { xs: "86%", sm: "500px" } }} marginTop={4}>
          <BottomNavigation
            showLabels
            value={value}
            sx={{ top: 2 }}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              sx={{
                border: 2,
                borderColor: `${value === 0 ? "" : "darkgray"}`,
                borderBottom: `${value === 0 ? "1" : ""}`,
                borderBottomColor: `${value === 0 ? "white" : ""}`,
                borderRadius: "16px 16px 0px 0px",
              }}
              label="Add new movie"
              icon={<AddIcon />}
            />
            <BottomNavigationAction
              sx={{
                border: 2,
                borderColor: `${value === 1 ? "" : "darkgray"}`,
                borderBottom: `${value === 0 ? "1" : ""}`,
                borderBottomColor: `${value === 1 ? "white" : ""}`,
                borderRadius: "16px 16px 0px 0px",
              }}
              label="Edit/Delete"
              icon={<CreateIcon />}
            />
          </BottomNavigation>
        </Box>
        <Box
          border={2}
          width={"95%"}
          marginBottom={10}
          borderRadius={{ xs: "0px 0px 16px 16px", sm: "16px" }}
          sx={{ border: 2, borderColor: "darkgray" }}
        >
          <Box display={value === 0 ? "block" : "none"}>
            <AddFilms />
          </Box>
          <Box display={value === 1 ? "block" : "none"}>
            <EditDeleteFilm />
          </Box>
        </Box>
      </div>
    </Dialog>
  );
};
