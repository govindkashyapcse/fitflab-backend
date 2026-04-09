# FitFlab Backend API

Node.js + Express + MongoDB + AWS S3 backend for the FitFlab fitness platform.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js |
| Database | MongoDB via Mongoose |
| Auth | JWT + bcryptjs |
| File Storage | AWS S3 (presigned URLs) |

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env from example
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, AWS credentials

# 3. Run dev server
npm run dev
```

---

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitflab

JWT_SECRET=change_me
JWT_EXPIRES_IN=7d

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

---

## Project Structure

```
src/
├── config/
│   ├── db.js           # MongoDB connection
│   └── s3.js           # AWS S3 client
├── controllers/        # Business logic
├── middlewares/
│   └── auth.middleware.js
├── models/
│   └── index.js        # All Mongoose schemas
├── routes/             # Express routers
├── utils/
│   ├── jwt.js
│   └── response.js
└── index.js            # App entry point
```

---

## Authentication

All protected routes require:
```
Authorization: Bearer <token>
```

### Roles & Access

| Role    | Notes |
|---------|-------|
| `athlete` | Self-registers. Full access immediately. |
| `coach`   | Self-registers. **Must be approved by admin** before any protected coach action is allowed. |
| `admin`   | Created manually in DB. Uses separate login endpoint. |

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register/athlete` | — | Register new athlete |
| POST | `/register/coach` | — | Register coach (pending approval) |
| POST | `/login` | — | Athlete / Coach login |
| POST | `/admin/login` | — | Admin login |
| GET | `/me` | ✅ Any | Get current user |

**Register Athlete body:**
```json
{
  "email": "john@example.com",
  "password": "secret123",
  "name": "John Doe",
  "gender": "male",
  "dob": "1995-06-15",
  "weight": 80,
  "height": 175
}
```

**Register Coach body:**
```json
{
  "email": "coach@example.com",
  "password": "secret123",
  "name": "Coach Ali",
  "gender": "male"
}
```

---

### Admin — `/api/admin`

All routes require admin JWT.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/coaches` | List all coaches (`?status=pending\|approved`) |
| PATCH | `/coaches/:coachId/approve` | Approve a coach |
| PATCH | `/coaches/:coachId/revoke` | Revoke coach approval |
| GET | `/users` | List all athletes |
| DELETE | `/users/:userId` | Delete a user |

---

### Users — `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/profile` | ✅ Any | Get own athlete profile |
| GET | `/profile/:userId` | ✅ Any | Get any user's profile |
| PATCH | `/profile` | ✅ Athlete | Update athlete profile (dob/weight/height) |
| PATCH | `/me` | ✅ Any | Update name/gender |
| PATCH | `/change-password` | ✅ Any | Change password |

---

### Workouts — `/api/workouts`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ Any | Browse all workouts |
| GET | `/:id` | ✅ Any | Get single workout |
| POST | `/` | ✅ Approved Coach / Admin | Create workout |
| PATCH | `/:id` | ✅ Approved Coach / Admin | Update workout |
| DELETE | `/:id` | ✅ Approved Coach / Admin | Delete workout |

**Create/Update body:**
```json
{
  "name": "Push-ups",
  "thumbnail": "https://bucket.s3.region.amazonaws.com/...",
  "videoUrl": "https://bucket.s3.region.amazonaws.com/...",
  "reps": 15,
  "sets": 3,
  "caloriesBurn": 50
}
```

---

### Workout Sessions — `/api/workout-sessions`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ Any | Browse all sessions |
| GET | `/:id` | ✅ Any | Get single session (workouts populated) |
| POST | `/` | ✅ Approved Coach / Admin | Create session |
| PATCH | `/:id` | ✅ Approved Coach / Admin | Update session |
| DELETE | `/:id` | ✅ Approved Coach / Admin | Delete session |

**Create body:**
```json
{
  "name": "Morning Blast",
  "thumbnail": "https://...",
  "workouts": ["workoutId1", "workoutId2"],
  "intensity": "high"
}
```

---

### Workout Logs — `/api/workout-logs`

Athlete only.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Log a completed workout |
| GET | `/` | Get my logs (`?startDate=2024-01-01&endDate=2024-01-31`) |
| DELETE | `/:id` | Delete a log entry |

**POST body:**
```json
{ "workoutId": "...", "date": "2024-06-01T08:00:00Z" }
```

**GET response includes:**
```json
{
  "logs": [...],
  "totalCaloriesBurned": 320
}
```

---

### Nutrition — `/api/nutrition`

**Foods:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/foods` | ✅ Any | Browse foods (`?search=chicken`) |
| GET | `/foods/:id` | ✅ Any | Get food detail |
| POST | `/foods` | ✅ Approved Coach / Admin | Add food |
| PATCH | `/foods/:id` | ✅ Approved Coach / Admin | Update food |
| DELETE | `/foods/:id` | ✅ Approved Coach / Admin | Delete food |

**Create food body:**
```json
{
  "name": "Grilled Chicken Breast",
  "thumbnail": "https://...",
  "servingSize": 100,
  "calories": 165,
  "nutrients": { "protein": 31, "carbs": 0, "fats": 3.6 }
}
```

**Nutrition Goal (athlete only):**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/goal` | Get my nutrition goal |
| POST | `/goal` | Set / update goal (upsert) |

**Goal body:**
```json
{
  "caloriesTarget": 2200,
  "nutrientsTarget": { "protein": 150, "carbs": 250, "fats": 70 }
}
```

---

### Food Logs — `/api/food-logs`

Athlete only.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Log food eaten |
| GET | `/` | My logs + nutrition totals (`?startDate=&endDate=`) |
| DELETE | `/:id` | Delete a log entry |

**POST body:**
```json
{ "foodId": "...", "quantity": 2, "date": "2024-06-01T12:30:00Z" }
```

**GET response includes:**
```json
{
  "logs": [...],
  "totals": { "calories": 1800, "protein": 120, "carbs": 200, "fats": 55 },
  "goal": { "caloriesTarget": 2200, ... }
}
```

---

### Awareness Posts — `/api/awareness`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ Any | Browse all posts |
| GET | `/:id` | ✅ Any | Get single post |
| POST | `/` | ✅ Approved Coach / Admin | Create post |
| PATCH | `/:id` | ✅ Approved Coach / Admin | Update post |
| DELETE | `/:id` | ✅ Approved Coach / Admin | Delete post |

---

### File Upload — `/api/upload`

#### Flow (Client → S3 direct upload)

```
React App                     Backend                    AWS S3
   |                              |                          |
   |-- POST /api/upload/presigned-url -->                    |
   |   { folder, fileName, fileType }                        |
   |                              |                          |
   |<-- { presignedUrl, publicUrl, key } --                  |
   |                              |                          |
   |-- PUT presignedUrl (binary file) ---------------------->|
   |                              |                          |
   |  Store publicUrl in DB field (thumbnail / videoUrl)     |
```

**Step 1 — Get presigned URL:**
```
POST /api/upload/presigned-url
Authorization: Bearer <token>

{
  "folder": "workout_thumbnail",
  "fileName": "pushup.jpg",
  "fileType": "image/jpeg"
}
```

Response:
```json
{
  "presignedUrl": "https://bucket.s3.amazonaws.com/workouts/thumbnails/uuid.jpg?X-Amz-...",
  "publicUrl": "https://bucket.s3.amazonaws.com/workouts/thumbnails/uuid.jpg",
  "key": "workouts/thumbnails/uuid.jpg"
}
```

**Step 2 — Upload from React:**
```js
await fetch(presignedUrl, {
  method: "PUT",
  headers: { "Content-Type": file.type },
  body: file,
});
```

**Step 3 — Save publicUrl in your create/update call:**
```json
{ "thumbnail": "https://bucket.s3.amazonaws.com/workouts/thumbnails/uuid.jpg" }
```

**Allowed folders:**

| folder key | S3 path |
|---|---|
| `workout_thumbnail` | `workouts/thumbnails/` |
| `workout_video` | `workouts/videos/` |
| `food_thumbnail` | `foods/thumbnails/` |
| `session_thumbnail` | `sessions/thumbnails/` |
| `awareness_thumbnail` | `awareness/thumbnails/` |
| `avatar` | `users/avatars/` |

---

## S3 Bucket Policy (CORS)

Add this CORS config to your S3 bucket to allow PUT from your React app:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": ["http://localhost:3000", "https://your-production-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

---

## Creating the First Admin (manual)

Since admins are created manually, run this once in a MongoDB shell or a seed script:

```js
import bcrypt from "bcryptjs";
import { User } from "./src/models/index.js";

await User.create({
  email: "admin@fitflab.com",
  password: await bcrypt.hash("adminpassword", 12),
  name: "Super Admin",
  role: "admin",
  isApproved: true,
});
```

---

## Error Response Format

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Action description",
  "data": { ... }
}
```
