require("dotenv").config();
import { ClearClient } from "./structures/ClearClient";

export const client = new ClearClient();

client.start();
