const mongoose = require("mongoose");

const cleaningTaskSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructions: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pendiente", "en_progreso", "completada"],
      default: "pendiente",
    },
    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CleaningTask", cleaningTaskSchema);