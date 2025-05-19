import express from "express";
import addToNewsLetter from "../controllers/newsLetterController.js";
import { unSubscribeToNewsLetter } from "../controllers/newsLetterController.js";

const newsLetterRoute = express.Router();

newsLetterRoute.post('/subscribe', addToNewsLetter);
newsLetterRoute.post('/unsubscribe', unSubscribeToNewsLetter);

export default newsLetterRoute;