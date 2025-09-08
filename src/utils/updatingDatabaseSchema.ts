import mongoose from "mongoose";

// Driver schema (only required fields for migration)
const driverSchema = new mongoose.Schema({}, { strict: false });
const userSchema = new mongoose.Schema({}, { strict: false });

const Driver = mongoose.model("Driver", driverSchema, "drivers");
const User = mongoose.model("User", userSchema, "users");

export const updateSchemas = async () => {
  try {
    // Update drivers
    const driverResult = await Driver.updateMany(
      { isBlocked: { $exists: false } },
      { $set: { isBlocked: false, isService: "APPROVED" } }
    );

    // Update users
    // const userResult = await User.updateMany(
    //   { isBlocked: { $exists: false } },
    //   { $set: { isBlocked: false } }
    // );

    console.log("Drivers updated:", driverResult.modifiedCount);
    // console.log("Users updated:", userResult.modifiedCount);

    process.exit(0);
  } catch (error: any) {
    console.log("error at updating util::", error.message);
    process.exit(1);
  }
};
