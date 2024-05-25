import next from "next";
import routes from "./routes.js";
import { createServer } from "http";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer(handler).listen(3000, err => {
    if (err) throw err;

    console.log("Ready on localhost:3000");    
  });
});