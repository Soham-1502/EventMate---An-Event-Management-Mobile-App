import express from "express";
import CreateTicketType from "../controller/ticketController/createTicketType.js";
import GetEventTickets from "../controller/ticketController/GetEventTickets.js";
import UserBuyTicket from "../controller/ticketController/UserBuyTicket.js";

const router = express.Router();

router.post("/:eventId/tickets/:userId/create", CreateTicketType);

router.post("/:eventId/buyTicket", UserBuyTicket)

router.get("/:eventId/tickets",GetEventTickets)

export default router
