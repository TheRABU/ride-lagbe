import app from "./app";
import { connectDatabase } from "./db/connectDB";
import { seedAdmin } from "./utils/seedAdmin";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server has started and running sir!!");
  connectDatabase();
  seedAdmin();
});
