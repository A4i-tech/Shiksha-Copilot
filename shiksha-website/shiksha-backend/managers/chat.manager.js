const BaseManager = require("./base.manager");
const ChatDao = require("../dao/chat.dao");
const formatApiResponse = require("../helper/response");
const { postToChatBot, postToLessonChatBot, postToChatBotStream } = require("../services/chat.bot.service");
const { CHAT_LIMIT } = require("../config/constants");
const ChapterDao = require("../dao/chapter.dao");
const MasterSubjectDao = require("../dao/master.subject.dao");
const TeacherLessonPlanDao = require("../dao/teacher.lesson.plan.dao");
const MasterLessonDao = require("../dao/master.lesson.dao");

class ChatManager extends BaseManager {
	constructor() {
		super(new ChatDao());
		this.chatDao = new ChatDao();
		this.chapterDao = new ChapterDao();
		this.subjectDao = new MasterSubjectDao();
		this.teacherLessonPlanDao = new TeacherLessonPlanDao();
		this.masterLessonDao = new MasterLessonDao();
	}

	async sendMessage(userId, message) {
		try {
			const today = new Date();
			today.setUTCHours(0, 0, 0, 0);
			let chatSession = await this.chatDao.getActiveSession(userId, today);

			if (!chatSession) {
				chatSession = await this.chatDao.create({
					userId,
					sessionDate: today,
					requestCount: 0,
				});
				await this.chatDao.createMessage({
					chatHistoryId: chatSession._id,
					messages: [],
				});
			}

			const totalMessages = await this.getTotalSessionMessagesCount(userId);

			if (totalMessages >= CHAT_LIMIT) {
				return formatApiResponse(
					false,
					"Session closed due to request limit exceeded",
					null
				);
			}

			let existingMessages = await this.chatDao.getMessagesBySessionId(
				chatSession._id
			);

			let formattedMessages = existingMessages.messages
				.map((m) => [
					{ role: "user", message: m.question },
					{ role: "system", message: m.answer },
				])
				.flat();
			formattedMessages.reverse();

			formattedMessages.push({ role: "user", message });

			const response = await postToChatBot({
				user_id: userId,
				messages: formattedMessages,
			});

			if (response.status !== 200) {
				throw new Error(`Something went wrong with copilot! Please try later`);
			}

			if (!response.data || !response.data.response) {
				throw new Error("Something went wrong with copilot! Please try later");
			}

			await this.chatDao.addMessage(chatSession._id, {
				question: message,
				answer: response.data.response,
				references: response.data.references || [],
			});

			chatSession.requestCount += 1;

			chatSession.save();

			return formatApiResponse(
				true,
				"Response from copilot",
				{ response: response.data.response, references: response.data.references || [] }
			);
		} catch (err) {
			return formatApiResponse(false, err.message, err);
		}
	}

	async sendMessageStream(userId, message) {
		try {
			const today = new Date();
			today.setUTCHours(0, 0, 0, 0);
			let chatSession = await this.chatDao.getActiveSession(userId, today);

			if (!chatSession) {
				chatSession = await this.chatDao.create({
					userId,
					sessionDate: today,
					requestCount: 0,
				});
				await this.chatDao.createMessage({
					chatHistoryId: chatSession._id,
					messages: [],
				});
			}

			const totalMessages = await this.getTotalSessionMessagesCount(userId);

			if (totalMessages >= CHAT_LIMIT) {
				return { success: false, message: "Session closed due to request limit exceeded" };
			}

			let existingMessages = await this.chatDao.getMessagesBySessionId(
				chatSession._id
			);

			let formattedMessages = existingMessages.messages
				.map((m) => [
					{ role: "user", message: m.question },
					{ role: "system", message: m.answer },
				])
				.flat();
			formattedMessages.reverse();

			formattedMessages.push({ role: "user", message });

			const response = await postToChatBotStream({
				user_id: userId,
				messages: formattedMessages,
			});

			// Handle DB persistence asynchronously
			const stream = response.data;
			let buffer = '';
			let fullAnswer = '';
			let references = [];

			stream.on('data', (chunk) => {
				try {
					buffer += chunk.toString();
					const lines = buffer.split('\n');
					buffer = lines.pop();

					for (const line of lines) {
						if (line.trim() === '') continue;
						if (line.startsWith('data: ')) {
							const dataStr = line.slice(6);
							if (dataStr === '[DONE]') continue;
							try {
								const data = JSON.parse(dataStr);
								if (data.type === 'content') {
									fullAnswer += data.delta;
								} else if (data.type === 'references') {
									references = data.data;
								}
							} catch (e) {
								// console.error('Error parsing SSE data for DB save', e);
								// Sometime chunks might be malformed if cut in middle of JSON, but buffer handles lines.
								// However, if JSON itself contains \n it might break? 
								// Standard SSE sends one line per event data. My Python implementation sends json.dumps() + "\n". 
								// json.dumps usually escapes newlines unless ensure_ascii=False etc. 
								// So splitting by \n is generally safe for this specific implementation.
							}
						}
					}
				} catch (err) {
					console.error("Error in stream data handler", err);
				}
			});

			stream.on('end', async () => {
				try {
					if (fullAnswer) {
						await this.chatDao.addMessage(chatSession._id, {
							question: message,
							answer: fullAnswer,
							references: references
						});
						chatSession.requestCount += 1;
						await chatSession.save();
					}
				} catch (dbError) {
					console.error("Error saving chat to DB after stream", dbError);
				}
			});

			return { success: true, stream: response.data };

		} catch (err) {
			return { success: false, message: err.message, error: err };
		}
	}

	async listMessages(userId) {
		try {
			const today = new Date();
			today.setUTCHours(0, 0, 0, 0);
			let chatSession = await this.chatDao.getActiveSession(userId, today);

			if (!chatSession) {
				return formatApiResponse(false, "Chat session not found", []);
			}

			let messages = await this.chatDao.getMessagesBySessionId(chatSession._id);

			return formatApiResponse(true, "Chat history fetched!", messages);
		} catch (err) {
			return formatApiResponse(false, err.message, err);
		}
	}

	async _getLessonDetails(recordId, chapterId, userId) {
		const lessonDetails = await this.teacherLessonPlanDao.getById(recordId);
		if (!lessonDetails) {
			throw new Error("Lesson plan not found");
		}

		const { lessonId } = lessonDetails;

		if (lessonDetails.teacherId.toString() !== userId.toString()) {
			throw new Error("RecordId dosen't belong to specific user!");
		}

		const masterLessonDetails = await this.masterLessonDao.getById(lessonId);
		if (!masterLessonDetails) {
			throw new Error("Master lesson not found");
		}
		if (masterLessonDetails.chapterId.toString() !== chapterId) {
			throw new Error("Chapter does not match the lesson");
		}

		const chapterDetails = await this.chapterDao.getById(chapterId);
		if (!chapterDetails) {
			throw new Error("Chapter not found");
		}

		let subjectDetails = await this.subjectDao.getById(chapterDetails.subjectId);
		if (!subjectDetails) {
			return formatApiResponse(false, "Subject not found", null);
		}

		return {
			lessonDetails,
			chapterDetails,
			subjectDetails
		};
	}

	_createChatPayload(chapter, subject, messages, userId) {
		return {
			user_id: userId.toString(),
			chapter_id: `Board=${chapter.board},Medium=${chapter.medium},Grade=${chapter.standard},Subject=${subject.subjectName},Number=${chapter.orderNumber},Title=${chapter.topics}`,
			index_path: chapter.indexPath ?? `shiksha/data_new_book/${chapter.board}/${chapter.medium}/${chapter.standard}/${subject.subjectName}/pdf/${chapter.orderNumber}/index/pdf_idx`,
			messages
		};
	}

	async sendLessonMessage(userId, recordId, chapterId, message) {
		try {

			const { lessonDetails, chapterDetails, subjectDetails } = await this._getLessonDetails(
				recordId, chapterId, userId
			);

			const todayStart = new Date();
			todayStart.setUTCHours(0, 0, 0, 0);
			const todayEnd = new Date();
			todayEnd.setUTCHours(23, 59, 59, 999);

			const totalMessages = await this.getTotalSessionMessagesCount(userId);

			let messageHistory = await this.chatDao.getLessonMessages(
				lessonDetails._id,
				userId,
				todayStart,
				todayEnd
			);

			if (totalMessages >= CHAT_LIMIT) {
				return formatApiResponse(
					false,
					"Daily limit has been exceeded",
					null
				);
			}

			let formattedMessages = (messageHistory || []).map((chat) => [
				{ role: "user", message: chat.message.question },
				{ role: "system", message: chat.message.answer },
			])
				.flat();

			formattedMessages.reverse();

			formattedMessages.push({ role: "user", message });

			const payload = this._createChatPayload(chapterDetails, subjectDetails, formattedMessages, userId)

			const response = await postToLessonChatBot(payload);

			if (response.status !== 200) {
				throw new Error(`Lesson chatbot error. Please try again later.`);
			}

			if (!response.data || !response.data.response) {
				throw new Error("Lesson chatbot returned an invalid response.");
			}

			await this.chatDao.createLessonChats({
				teacherId: userId,
				recordId: lessonDetails._id,
				message: {
					question: message,
					answer: response.data.response,
					references: response.data.references || [],
					version: 2,
				}
			});

			return formatApiResponse(true, "Lesson chat response", {
				response: response.data.response,
				references: response.data.references || [],
			});
		} catch (err) {
			return formatApiResponse(false, err.message, err);
		}
	}

	async listLessonMessages(recordId, chapterId, userId) {
		try {
			const { lessonDetails, chapterDetails, subjectDetails } = await this._getLessonDetails(
				recordId, chapterId, userId
			);

			let messagesHistory = await this.chatDao.getLessonMessages(
				lessonDetails._id,
				userId
			);

			let messages = (messagesHistory || []).map((chat) => chat.message)

			return formatApiResponse(true, "Lesson messages fetched successfully", { messages, chapterDetails, subject: subjectDetails });
		} catch (err) {
			return formatApiResponse(false, err.message, err);

		}

	}


	async getTotalSessionMessagesCount(userId) {
		const todayStart = new Date();
		todayStart.setUTCHours(0, 0, 0, 0);

		const todayEnd = new Date();
		todayEnd.setUTCHours(23, 59, 59, 999);

		let chatSession = await this.chatDao.getActiveSession(userId, todayStart);

		let messageHistory = await this.chatDao.getAllLessonMessages(
			userId,
			todayStart,
			todayEnd
		);

		const messageCount = chatSession?.requestCount + messageHistory?.length;
		return messageCount
	}
}

module.exports = ChatManager;
