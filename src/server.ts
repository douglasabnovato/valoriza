import express from "express";

const app = express();//@types/express

app.get("/test", (req, res) => {
  return res.send("Olá NLW, método GET!")
});

app.post("/test-post", (req, res) => {
  return res.send("Olá NLW, método POST!")
}); 

app.listen(3000, () => console.log("Server is running!!"));//http://localhost:3000