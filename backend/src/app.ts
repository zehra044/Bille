import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customer.routes";
import transactionRoutes from "./routes/transaction.routes";
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
export default app;