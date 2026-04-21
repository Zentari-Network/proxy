import APIHandler from "./api/handler";
import ConfigHandler from "./utils/config/handler";
import DatabaseHandler from "./utils/database/handler";
import ExitHandler from "./utils/exit/handler";

new ConfigHandler();
new DatabaseHandler();
new APIHandler();
new ExitHandler();
