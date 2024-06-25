import express from "express";
import cors from "cors";
const app = express();

import dotenv from "dotenv";
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("");
});

app.listen(5000, function () {
	console.log("http://localhost:8080/ 서버 실행중");
});
