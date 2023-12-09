import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import RemoveRedEyeTwoToneIcon from "@mui/icons-material/RemoveRedEyeTwoTone";
import { IconButton, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { SnackbarProvider, useSnackbar } from "notistack";

import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 5,
  borderRadius: 5,
  p: 4,
};

const ContentTodo = ({ data, setData }) => {
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [detail, setDetail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDetail = () => setOpenDetail(true);
  const handleCloseDetail = () => setOpenDetail(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/todos"); // เปลี่ยน URL ตามที่ต้องการ
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function handleSubmit() {
    // ทำสิ่งที่คุณต้องการเมื่อ Submit Form

    let done = false;
    let values = { title, body, done };

    try {
      // ส่ง request ไปยัง localhost:8000/api/insert ด้วย method POST
      await axios.post("http://localhost:8000/api/insert", values);

      // เมื่อสำเร็จ, โหลดข้อมูลใหม่
      fetchData();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
    setTitle("");
    setBody("");
    handleClose();
  }

  // Check done
  async function handleToggle(id) {
    try {
      await axios.patch(`http://localhost:8000/api/${id}/done`); // เปลี่ยน URL ตามที่ต้องการ
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // view detail form todo
  async function viewDetail(id) {
    try {
      const respones = await axios.get(`http://localhost:8000/api/todo/${id}`); // เปลี่ยน URL ตามที่ต้องการ
      setDetail(respones.data);
      console.log(respones.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // delete todo
  async function deleteTodo(id) {
    try {
      await axios.delete(`http://localhost:8000/api/delete/${id}`); // เปลี่ยน URL ตามที่ต้องการ
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Show toast when delete todo
  const handleClickVariant = (variant) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("This is a success message!", { variant });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6} marginTop={5}>
            <>
              <h1>Welcome to our Todolist app</h1>

              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your go-to
                companion for seamless task management and productivity
                enhancement! Designed with simplicity and efficiency in mind,
                our Todolist app empowers you to organize your daily activities,
                set priorities, and accomplish your goals with ease.
              </p>
              {/* <Button
                onClick={handleOpen}
                variant="contained"
                endIcon={<SendIcon />}
                sx={{
                  borderRadius: 30,
                  marginTop: 1,
                }}
              >
                Add Todo
              </Button> */}
            </>
            <center>
              <Button
                onClick={handleOpen}
                variant="contained"
                endIcon={<SendIcon />}
                sx={{
                  borderRadius: 30,
                  marginTop: 1,
                }}
              >
                Add Todo
              </Button>
              <h1>My Todo List</h1>

              {/* ======================================================= */}
              <List sx={{ width: "100%", maxWidth: 360 }}>
                {data.map((todo) => (
                  <ListItem key={todo.id}>
                    <ListItemIcon style={{ marginRight: "40px" }}>
                      <RemoveRedEyeTwoToneIcon
                        // onClick={handleOpenDetail}
                        onClick={async () => {
                          // โค้ดที่ต้องการให้ทำงาน
                          handleOpenDetail();
                          await viewDetail(todo.id);
                        }}
                      ></RemoveRedEyeTwoToneIcon>
                    </ListItemIcon>

                    <ListItemText
                      key={todo.id}
                      style={{
                        textDecoration: todo.done ? "line-through" : "none",
                      }}
                    >
                      {todo.title}
                    </ListItemText>
                    <Switch
                      edge="end"
                      onClick={async () => {
                        // โค้ดที่ต้องการให้ทำงาน
                        await handleToggle(todo.id);
                      }}
                      // onClick={handleToggle(todo.id)}
                      checked={todo.done ? true : false}
                      inputProps={{
                        "aria-labelledby": "switch-list-label-wifi",
                      }}
                    />
                    <ListItemIcon style={{ marginLeft: "40px" }}>
                      <DeleteForeverTwoToneIcon
                        onClick={async () => {
                          // โค้ดที่ต้องการให้ทำงาน
                          await deleteTodo(todo.id);
                          handleClickVariant("success");
                        }}
                      />
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            </center>
            {/* ======================================================= */}
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </Box>

      {/* ---------------------------------form add todo----------------------------------------------- */}

      <Dialog
        // fullScreen
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Add Todo List
          <IconButton onClick={handleClose} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <TextField
              id="outlined-required"
              label="Title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></TextField>
            <TextField
              variant="outlined"
              label="Body"
              placeholder="Body"
              multiline
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></TextField>

            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------Detail----------------------------------------------- */}

      <Dialog
        // fullScreen
        open={openDetail}
        onClose={handleCloseDetail}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{detail.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            &nbsp;&nbsp;&nbsp;&nbsp;{detail.body}
            <br />
            <br />
            Your todo is{" "}
            <strong>{detail.done ? "complete" : "uncomplete"}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ContentTodo.propTypes = {
  data: PropTypes.array, // ปรับตามประเภทของ data ที่คุณต้องการ
  setData: PropTypes.func, // ปรับตามประเภทของ data ที่คุณต้องการ
};

export default ContentTodo;
