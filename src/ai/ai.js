import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export async function sendMessageToAssistant(threadId, userMessage) {
	const response = await openai.beta.threads.messages.create(threadId, {
		role: "user",
		content: userMessage,
	});

	return response;
}

export async function createRun(threadId, assistantId) {
	const run = await openai.beta.threads.runs.create(threadId, {
		assistant_id: assistantId,
	});
	return run;
}

export async function waitRun(run, threadId) {
	// 주어진 실행이 완료될 때까지 기다린다.
	// status가 "queued" 또는 "in_progress"인 경우 계속 polling 하며 대기한다.
	while (run.status === "queued" || run.status === "in_progress") {
		// run.status를 업데이터한다.
		run = await openai.beta.threads.runs.retrieve(threadId, run.id);
		// API 요청 사이에 잠깐의 대기 시간을 두어 서버 부하를 줄인다.
		await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
	}
	return run;
}

export async function receiveMessage(threadId) {
	const response = await openai.beta.threads.messages.list(threadId, "asc");
	return response;
}

async function main() {
	const assistantId = "asst_A2sd6XiYDIqUZrhOU1FXcwEe";
	const threadId = "thread_q5MDoeajd3f1cLSfp14UJyNJ";
	const userMessage = "오늘 나랑 놀래?";

	try {
		// 메시지 전송 및 응답 받기
		const message = await sendMessageToAssistant(threadId, userMessage);
		// console.log("질문: ", userMessage);

		// Run 생성
		const run = await createRun(threadId, assistantId);
		// console.log("Run created:", run);

		// 기다리기
		await waitRun(run, threadId);
		// console.log(result);

		const response = await receiveMessage(threadId);

		console.log(response.data[0].content[0].text.value);
	} catch (error) {
		console.error("Error:", error);
	}
}

// main();
