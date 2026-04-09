import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import s3Client from "../config/s3.js";
import { successResponse, errorResponse } from "../utils/response.js";

const BUCKET = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION;

// Allowed MIME types per upload category
const ALLOWED_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/quicktime", "video/webm"],
};

const FOLDER_MAP = {
  workout_thumbnail: "workouts/thumbnails",
  workout_video: "workouts/videos",
  food_thumbnail: "foods/thumbnails",
  session_thumbnail: "sessions/thumbnails",
  awareness_thumbnail: "awareness/thumbnails",
  avatar: "users/avatars",
};

/**
 * POST /api/upload/presigned-url
 * Body: { folder, fileName, fileType }
 * Returns a presigned PUT URL the React client uses to upload directly to S3.
 */
export const getPresignedUrl = async (req, res) => {
  try {
    const { folder, fileName, fileType } = req.body;

    if (!folder || !fileName || !fileType) {
      return errorResponse(res, "folder, fileName and fileType are required.");
    }

    const s3Folder = FOLDER_MAP[folder];
    if (!s3Folder) {
      return errorResponse(
        res,
        `Invalid folder. Allowed: ${Object.keys(FOLDER_MAP).join(", ")}`
      );
    }

    // Validate MIME type
    const mediaCategory = fileType.startsWith("video/") ? "video" : "image";
    if (!ALLOWED_TYPES[mediaCategory].includes(fileType)) {
      return errorResponse(res, `File type "${fileType}" is not allowed.`);
    }

    // Build a unique S3 key
    const ext = fileName.split(".").pop();
    const uniqueKey = `${s3Folder}/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: uniqueKey,
      ContentType: fileType,
    });

    // URL expires in 5 minutes — enough time for the client to upload
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });

    // The final public URL the app stores in the DB after upload succeeds
    const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${uniqueKey}`;

    return successResponse(res, { presignedUrl, publicUrl, key: uniqueKey });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * DELETE /api/upload
 * Body: { key }
 * Deletes an object from S3 by key. Admin or owner only — caller must verify
 * ownership before hitting this endpoint (handled in route middleware).
 */
export const deleteS3Object = async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return errorResponse(res, "S3 key is required.");
    }

    const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
    await s3Client.send(command);

    return successResponse(res, null, "File deleted from storage.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
