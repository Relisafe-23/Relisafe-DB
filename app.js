import express, { json } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import globalErrHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";

const app = express();

//Routes
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import projectPermission from "./routes/projectPermissionRoutes.js";
import productBreakdownStructureRoutes from "./routes/productBreakdownStructureRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import failureRatePrediction from "./routes/failureRatePredictionRoutes.js";
import mttrPredictionRoutes from "./routes/mttrPredictionRoutes.js";
import pmMraRoutes from "./routes/pmMraRoutes.js";
import sparePartsAnalysis from "./routes/sparePartsAnalysisRoutes.js";
import productTreeStructureRoutes from "./routes/productTreeStructureRoutes.js";
import FMECARoutes from "./routes/FMECARoutes.js";
import SafetyRoutes from "./routes/safetyRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";

//Allow Cross-Origin requests
app.use(cors());

//Set security HTTP headers
app.use(helmet());

//Limit request from the same API
const limiter = rateLimit({
  max: 150000,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});

app.use("/api", limiter);

//Body parser, reading data from body into req.body

app.use(
  json({
    limit: "25MB",
  })
);

// Data sanitization against No Sql query injection
app.use(mongoSanitize());

//Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

//Prevent parameter pollution
app.use(hpp());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/projectCreation", projectRoutes);
app.use("/api/v1/projectPermission", projectPermission);
app.use("/api/v1/productBreakdownStructure", productBreakdownStructureRoutes);
app.use("/api/v1/productTreeStructure", productTreeStructureRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/failureRatePrediction", failureRatePrediction);
app.use("/api/v1/mttrPrediction", mttrPredictionRoutes);
app.use("/api/v1/pmMra", pmMraRoutes);
app.use("/api/v1/sparePartsAnalysis", sparePartsAnalysis);
app.use("/api/v1/FMECA", FMECARoutes);
app.use("/api/v1/safety", SafetyRoutes);
app.use("/api/v1/library",libraryRoutes);
// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", "undefined route");
  next(err, req, res, next);
});

app.use(globalErrHandler);

export default app;
