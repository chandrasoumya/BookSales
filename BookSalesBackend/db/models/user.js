const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  FName: {
    type: String,
    required: true,
  },
  LName: {
    type: String,
    required: true,
  },
  Mobile: {
    type: Number,
    required: true,
    unique: true,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    enum: ["Customer", "Admin", "Librarian"],
    default: "Customer",
  },
  Address: [
    {
      State: String,
      District: String,
      Town: String,
      PinCode: Number,
    },
  ],
  Cart: [
    {
      bookId: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
