import app from "./app";
import { connectDatabase } from "./db/connectDB";
import { seedAdmin } from "./utils/seedAdmin";
import { Server } from "http"

let server: Server;

const PORT = process.env.PORT || 5000;





const startServer = async () => { 
  try {
    await connectDatabase();
    await seedAdmin();
      server = app.listen(PORT, () => {
            console.log(`Server is listening to port ${PORT}`);
        });
  } catch (error: any) {
    console.log(error.message);
  }
}

startServer();


process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})
