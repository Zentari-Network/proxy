import { Router } from "express";
import StatusController from "./status.controller";

const StatusRouter = Router();

StatusRouter.get("/", StatusController.Get);

export default StatusRouter;
