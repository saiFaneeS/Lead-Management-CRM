import mongoose from "mongoose";
import { Role } from "../models/role.model.js";
import { DB_NAME } from "../constants.js0";

const roles = [
  {
    name: "super_admin",
    permissions: [
      "create_lead",
      "edit_lead",
      "delete_lead",
      "view_lead",
      "create_task",
      "edit_task",
      "delete_task",
      "view_task",
      "view_reports",
      "manage_users",
      "manage_roles",
    ],
    description: "Super admin with full access to all features",
  },
  {
    name: "admin",
    permissions: [
      "create_lead",
      "edit_lead",
      "delete_lead",
      "view_lead",
      "create_task",
      "edit_task",
      "delete_task",
      "view_task",
      "view_reports",
      "manage_users",
    ],
    description: "Admin with most permissions except role management",
  },
  {
    name: "user",
    permissions: [
      "create_lead",
      "edit_lead",
      "view_lead",
      "create_task",
      "edit_task",
      "view_task",
    ],
    description: "Normal user with basic permissions",
  },
];

const seedRoles = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://saifanees:thimsa204@cluster0.y52kvyy.mongodb.net/leadnest"
    );

    await Role.deleteMany({});

    await Role.insertMany(roles);

    console.log("Roles have been seeded");
  } catch (error) {
    console.error("Error seeding roles:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedRoles();
