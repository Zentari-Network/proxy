import { Router } from "express";
import CheckerRouter from "./checker/checker.route";
import StatusRouter from "./status/status.route";

const CenterRouter = Router();

CenterRouter.use("/checker", CheckerRouter);
CenterRouter.use("/status", StatusRouter);

export default CenterRouter;
