import app from "../server/src/server.js";
import { connectDatabase } from "../server/src/config/database.js";

let ready;
export default async function handler(req, res) {
  ready ||= connectDatabase();
  await ready;
  return app(req, res);
}
