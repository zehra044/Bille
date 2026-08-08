import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customer.routes";
import transactionRoutes from "./routes/transaction.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import reportRoutes from "./routes/report.routes";
import trashRoutes from "./routes/trash.routes";
import backupRoutes from "./routes/backup.routes";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    app: "Bille",
    version: "0.1.0",
    message: "Backend is running "
  });
});
app.use("/customers", customerRoutes);
app.use("/customers", transactionRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/reports", reportRoutes);
app.use("/trash", trashRoutes);
app.use("/backup", backupRoutes);
export default app;
