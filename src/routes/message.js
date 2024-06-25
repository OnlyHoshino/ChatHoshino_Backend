import express from "express";
export const messageRouter = express.Router();

import dotenv from "dotenv";
import {
	sendMessageToAssistant,
	createRun,
	waitRun,
	receiveMessage,
} from "../ai/ai.js";
dotenv.config();

messageRouter.post("/add", async (req, res) => {
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
