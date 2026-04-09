import { AwarenessPost } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createPost = async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body;

    const post = await AwarenessPost.create({
      title,
      description,
      thumbnail,
      createdBy: req.user._id,
    });

    return successResponse(res, { post }, "Awareness post created.", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await AwarenessPost.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    return successResponse(res, { posts });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await AwarenessPost.findById(req.params.id).populate(
      "createdBy",
      "name"
    );
    if (!post) return errorResponse(res, "Post not found.", 404);
    return successResponse(res, { post });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await AwarenessPost.findById(req.params.id);
    if (!post) return errorResponse(res, "Post not found.", 404);

    if (
      req.user.role !== "admin" &&
      post.createdBy?.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, "Not authorized.", 403);
    }

    const updated = await AwarenessPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return successResponse(res, { post: updated }, "Post updated.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await AwarenessPost.findById(req.params.id);
    if (!post) return errorResponse(res, "Post not found.", 404);

    if (
      req.user.role !== "admin" &&
      post.createdBy?.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, "Not authorized.", 403);
    }

    await post.deleteOne();
    return successResponse(res, null, "Post deleted.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
