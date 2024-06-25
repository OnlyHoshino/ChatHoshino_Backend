import express from "express";
import cors from "cors";
const app = express();

import {
	sendMessageToAssistant,
	createRun,
	waitRun,
	receiveMessage,
} from "./ai/ai.js";
import dotenv from "dotenv";
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({ a: 1 });
});

app.post("/message/add", async (req, res) => {
	console.log(req.body);
	if (req.body.message === "") {
		res.send("메세지가 없습니다.");
	}
	sendMessageToAssistant(process.env.THREAD_ID, req.body.message);
	const run = await createRun(process.env.THREAD_ID, process.env.ASSISTANT_ID);
	await waitRun(run, process.env.THREAD_ID);
	const response = await receiveMessage(process.env.THREAD_ID);

	console.log(response.data[0].content[0].text.value);
	res.json({ res: response.data[0].content[0].text.value });
});

app.listen(5000, function () {
	console.log("http://localhost:5000/ 서버 실행중");
});
