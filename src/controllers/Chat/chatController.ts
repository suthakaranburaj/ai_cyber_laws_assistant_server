import { Request, Response } from "express";
import knex from "../../db/constrants";
import sendResponse from "../../utils/api_response_handler";
import { asyncHandler } from "../../utils/asyncHandler";

export const create_chat_section = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { user_id, title } = req.body;

        const chatTitle = title || "New Chat";

        if (!user_id) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "User Id not given",
                statusCode: 400,
            });
            return;
        }

        const existingUser = await knex("User").where({ user_id }).first();

        if (!existingUser) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "User Id not found",
                statusCode: 404,
            });
            return;
        }

        const create = await knex("chat_section")
            .insert({
                user_id,
                title: chatTitle,
            })
            .returning("chat_section_id");

        if (create.length === 0) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "Chat not created",
                statusCode: 400,
            });
            return;
        }

        sendResponse({
            res,
            status: "success",
            data: create,
            message: "Chat created successfully !",
            statusCode: 201,
        });
    }
);

export const get_chat_section = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { user_id } = req.body;
        const { chat_section_id } = req.params;

        if (!user_id) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "Chat section id or User Id not given !",
                statusCode: 400,
            });
            return;
        }

        const chat_section = await knex("chat_section")
            .select("*")
            .where({ user_id, chat_section_id });

        if (!chat_section) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "Chat not found !",
                statusCode: 400,
            });
            return;
        }

        sendResponse({
            res,
            status: "success",
            data: chat_section,
            message: "Chat Section Fetched successfull !",
            statusCode: 200,
        });
    }
);

export const get_all_chat_section = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { user_id } = req.query;

        if (!user_id) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "User Id not given",
                statusCode: 400,
            });
            return;
        }

        const all_chat_section = await knex("chat_section")
            .select("chat_section_id", "title", "createdAt", "updatedAt")
            .where({
                user_id,
                status: true,
            });

        if (!all_chat_section) {
            sendResponse({
                res,
                status: "success",
                data: null,
                message: "No Chat section found !",
                statusCode: 200,
            });
            return;
        }

        sendResponse({
            res,
            status: "success",
            data: all_chat_section,
            message: "Chats Section fetched successfully !",
            statusCode: 200,
        });
        return;
    }
);

export const create_message = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { user_id, chat_section, type } = req.query;

        if (!user_id || !chat_section) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "User ID or Chat Section ID not provided",
                statusCode: 400,
            });
            return;
        }

        const { message } = req.body;

        if (!message) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "Message content not provided",
                statusCode: 400,
            });
            return;
        }

        const existingChatSection = await knex("chat_section")
            .where({ chat_section_id: chat_section, user_id })
            .first();

        if (!existingChatSection) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message:
                    "Chat section not found or does not belong to the user",
                statusCode: 404,
            });
            return;
        }

        const newMessage = await knex("Message")
            .insert({
                chat_section_id: chat_section,
                sender_id: user_id,
                content: message,
                type,
            })
            .returning("*");

        if (newMessage.length === 0) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "Failed to create message",
                statusCode: 400,
            });
            return;
        }

        sendResponse({
            res,
            status: "success",
            data: newMessage[0],
            message: "Message created successfully",
            statusCode: 201,
        });
    }
);

export const get_Messages = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { chat_section_id, user_id } = req.query;

        if (!chat_section_id) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "Chat Section ID not provided",
                statusCode: 400,
            });
            return;
        }

        const messages = await knex("Message")
            .select("*")
            .where({ chat_section_id, sender_id: user_id });

        if (!messages || messages.length === 0) {
            sendResponse({
                res,
                status: "success",
                data: [],
                message: "No messages found",
                statusCode: 200,
            });
            return;
        }

        sendResponse({
            res,
            status: "success",
            data: messages,
            message: "Messages fetched successfully",
            statusCode: 200,
        });
    }
);

export const delete_chat_section = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
);
