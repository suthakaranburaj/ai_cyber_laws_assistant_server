import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from "express";

import userRouter from "./controllers/User/user.route";
import chatRoute from "./controllers/Chat/chatRoute";
import loginRoute from "./controllers/Login/loginRoute";
import { create } from "domain";

const app = express();

dotenv.config({
    path: "./.env",
});


const PORT = process.env.PORT;
app.use(
    cors({
        origin: [
            `http://localhost:${process.env.CLIENT_ORIGIN_PORT}`,
            "http://localhost:5174",
            `http://localhost:5173`
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/login", loginRoute);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});



app.use((req, res) => {
    res.status(404).send({ message: "Not Found" });
});

export default app;
