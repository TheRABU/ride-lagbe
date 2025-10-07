import app from "./app";
import { connectDatabase } from "./db/connectDB";
import { seedAdmin } from "./utils/seedAdmin";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost-or-the-live-url:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
};

startServer();
