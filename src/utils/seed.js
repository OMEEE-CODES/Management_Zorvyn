require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Record = require("../models/Record");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database");

    // Clear existing data
    await User.deleteMany({});
    await Record.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    const analyst = await User.create({
      name: "Analyst User",
      email: "analyst@example.com",
      password: "password123",
      role: "analyst",
    });

    await User.create({
      name: "Viewer User",
      email: "viewer@example.com",
      password: "password123",
      role: "viewer",
    });

    console.log("Users created");

    // Create sample financial records
    const records = [
      { amount: 5000, type: "income", category: "salary", date: new Date("2026-01-15"), description: "January salary", createdBy: admin._id },
      { amount: 2000, type: "income", category: "freelance", date: new Date("2026-01-20"), description: "Freelance project", createdBy: admin._id },
      { amount: 1200, type: "expense", category: "rent", date: new Date("2026-01-01"), description: "Monthly rent", createdBy: admin._id },
      { amount: 300, type: "expense", category: "utilities", date: new Date("2026-01-05"), description: "Electricity and water", createdBy: admin._id },
      { amount: 450, type: "expense", category: "food", date: new Date("2026-01-10"), description: "Groceries", createdBy: admin._id },
      { amount: 5000, type: "income", category: "salary", date: new Date("2026-02-15"), description: "February salary", createdBy: admin._id },
      { amount: 800, type: "income", category: "investment", date: new Date("2026-02-20"), description: "Stock dividends", createdBy: admin._id },
      { amount: 1200, type: "expense", category: "rent", date: new Date("2026-02-01"), description: "Monthly rent", createdBy: admin._id },
      { amount: 150, type: "expense", category: "transport", date: new Date("2026-02-10"), description: "Bus pass", createdBy: admin._id },
      { amount: 200, type: "expense", category: "entertainment", date: new Date("2026-02-14"), description: "Movie and dinner", createdBy: admin._id },
      { amount: 5000, type: "income", category: "salary", date: new Date("2026-03-15"), description: "March salary", createdBy: admin._id },
      { amount: 1500, type: "income", category: "freelance", date: new Date("2026-03-22"), description: "Consulting work", createdBy: analyst._id },
      { amount: 1200, type: "expense", category: "rent", date: new Date("2026-03-01"), description: "Monthly rent", createdBy: admin._id },
      { amount: 500, type: "expense", category: "healthcare", date: new Date("2026-03-05"), description: "Doctor visit", createdBy: admin._id },
      { amount: 350, type: "expense", category: "education", date: new Date("2026-03-10"), description: "Online course", createdBy: analyst._id },
    ];

    await Record.insertMany(records);
    console.log(`${records.length} records created`);

    console.log("\nSeed completed! Test credentials:");
    console.log("  Admin:   admin@example.com / password123");
    console.log("  Analyst: analyst@example.com / password123");
    console.log("  Viewer:  viewer@example.com / password123");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedData();
