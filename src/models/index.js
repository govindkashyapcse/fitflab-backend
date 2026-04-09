import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

/* =========================
   USER
========================= */
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true},
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["athlete", "coach", "admin"], default: "athlete" },
    gender: { type: String, enum: ["male", "female", "other"] },

    // Coach-specific: approval status managed by admin
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role === "athlete" || this.role === "admin";
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword, dbPassword) {
  const res = await bcrypt.compare(candidatePassword, dbPassword);
  return res;
};

/* =========================
   ATHLETE PROFILE
========================= */
const athleteProfileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    dob: Date,
    weight: Number, // in kg
    height: Number, // in cm
  },
  { timestamps: true }
);

/* =========================
   NUTRITION GOAL
========================= */
const nutritionGoalSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    caloriesTarget: { type: Number, required: true },
    nutrientsTarget: {
      protein: { type: Number, required: true, min: 0 },
      carbs: { type: Number, required: true, min: 0 },
      fats: { type: Number, required: true, min: 0 },
    },
  },
  { timestamps: true }
);

/* =========================
   FOOD
========================= */
const foodSchema = new Schema(
  {
    name: { type: String, required: true },
    thumbnail: String, // S3 URL
    servingSize: Number, // in grams
    nutrients: {
      protein: { type: Number, required: true, min: 0 },
      carbs: { type: Number, required: true, min: 0 },
      fats: { type: Number, required: true, min: 0 },
    },
    calories: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // coach who added it
  },
  { timestamps: true }
);

/* =========================
   FOOD LOG
========================= */
const foodLogSchema = new Schema(
  {
    food: { type: Schema.Types.ObjectId, ref: "Food", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, default: 1 }, // number of servings
    calories: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/* =========================
   WORKOUT
========================= */
const workoutSchema = new Schema(
  {
    name: { type: String, required: true },
    thumbnail: String, // S3 URL
    videoUrl: String,  // S3 URL or external
    reps: Number,
    sets: Number,
    caloriesBurn: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // coach who created it
  },
  { timestamps: true }
);

/* =========================
   WORKOUT SESSION
========================= */
const workoutSessionSchema = new Schema(
  {
    name: { type: String, required: true },
    thumbnail: String, // S3 URL
    workouts: [{ type: Schema.Types.ObjectId, ref: "Workout" }],
    intensity: { type: String, enum: ["low", "medium", "high"] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // coach who created it
  },
  { timestamps: true }
);

/* =========================
   WORKOUT LOG
========================= */
const workoutLogSchema = new Schema(
  {
    workout: { type: Schema.Types.ObjectId, ref: "Workout", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    caloriesBurn: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/* =========================
   AWARENESS POST
========================= */
const awarenessPostSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    thumbnail: String, // S3 URL
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // coach who created it
  },
  { timestamps: true }
);

/* =========================
   EXPORT MODELS
========================= */
export const User = model("User", userSchema);
export const AthleteProfile = model("AthleteProfile", athleteProfileSchema);
export const NutritionGoal = model("NutritionGoal", nutritionGoalSchema);
export const Food = model("Food", foodSchema);
export const FoodLog = model("FoodLog", foodLogSchema);
export const Workout = model("Workout", workoutSchema);
export const WorkoutSession = model("WorkoutSession", workoutSessionSchema);
export const WorkoutLog = model("WorkoutLog", workoutLogSchema);
export const AwarenessPost = model("AwarenessPost", awarenessPostSchema);
