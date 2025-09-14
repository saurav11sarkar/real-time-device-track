import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// public folder serve
app.use("/public", express.static(path.join(process.cwd(), "public")));

// routes
app.get("/", (req: Request, res: Response) => {
  res.render("index");
  // res.send("API is working 🚀");
});

// not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API not found",
    path: req.originalUrl,
  });
});

// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export default app;
