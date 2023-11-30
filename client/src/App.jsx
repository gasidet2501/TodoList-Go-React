import { useState, useEffect } from "react";
import axios from "axios";

import ResponsiveAppBar from "./assets/components/ResponsiveAppBar";
import Container from "@mui/material/Container";
import ContentTodo from "./assets/components/ContentTodo";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // ทำการ fetch ข้อมูลจาก backend โดยใช้ Axios
    axios
      .get("http://localhost:8000/api/todos")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [setData]);

  return (
    <Container maxWidth="xl">
      <ResponsiveAppBar />
      <ContentTodo data={data} setData={setData} />
    </Container>
  );
}

export default App;
