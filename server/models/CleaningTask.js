const mongoose = require("mongoose");

const cleaningTaskSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "El número de habitación es obligatorio"],
      trim: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El empleado es obligatorio"],
    },

    employeeEmail: {
      type: String,
      required: [true, "El email del empleado es obligatorio"],
      lowercase: true,
      trim: true,
    },

    instructions: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pendiente", "en_proceso", "completada"],
      default: "pendiente",
    },

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CleaningTask", cleaningTaskSchema);