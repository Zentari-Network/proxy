import { Router } from "express";
import CheckerController from "./checker.controller";

const CheckerRouter = Router();

CheckerRouter.post("/", CheckerController.Check);

export default CheckerRouter;
