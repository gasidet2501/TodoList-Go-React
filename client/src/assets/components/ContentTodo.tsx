import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Modal from "@mui/material/Modal";
import { IconButton, TextField } from "@mui/material";

import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
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
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // โหลดข้อมูลเมื่อ component ถูกโหลด
    fetchData();
  }, []); // ถ้าคุณต้องการให้โหลดข้อมูลเมื่อมีการเปลี่ยนแปลงใน dependencies, เพิ่ม dependencies เข้าไปใน array นี้

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/todos"); // เปลี่ยน URL ตามที่ต้องการ
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const functionopenpopup = () => {
    setOpen(true);
  };
  const closepopup = () => {
    setOpen(false);
  };

  async function handleSubmit() {
    // ทำสิ่งที่คุณต้องการเมื่อ Submit Form

    let done = false;
    let values = { title, body, done };

    try {
      const bodyJson = {
        title: "title",
        body: "body",
        done: false,
      };

      // ส่ง request ไปยัง localhost:8000/api/insert ด้วย method POST
      await axios.post("http://localhost:8000/api/insert", bodyJson);

      // เมื่อสำเร็จ, โหลดข้อมูลใหม่
      fetchData();
    } catch (error) {
      const bodyJson = {
        title: "title",
        body: "body",
        done: false,
      };

      // ส่ง request ไปยัง localhost:8000/api/insert ด้วย method POST
      axios.post("http://localhost:8000/api/insert", bodyJson);
    }

    // try {
    //   const response = await axios.post("http://localhost:8000/api/insert", {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(values),
    //   });

    //   //   setData(response.data);
    //   console.log(response.data);
    //   console.log(JSON.stringify(values));
    //   setTitle("");
    //   setBody("");
    //   closepopup(); // ปิด Dialog หลังจาก Submit
    // } catch (error) {
    //   // จัดการข้อผิดพลาดที่เกิดขึ้นที่นี่ (ถ้ามี)
    //   console.error("Error creating todo:", error);
    // }
    // console.log(JSON.stringify(values));
    // console.log("Title:", title);
    // console.log("Body:", body);
  }

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
            </>

            <h1>My Todo List</h1>
            <ul>
              {data.map((todo) => (
                <li key={todo.id}>{todo.title}</li>
              ))}
            </ul>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </Box>

      <Dialog
        // fullScreen
        open={open}
        onClose={closepopup}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Add Todo List{" "}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
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
        <DialogActions>
          {/* <Button color="success" variant="contained">Yes</Button>
                    <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContentTodo;
