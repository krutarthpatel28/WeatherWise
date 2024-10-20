post1.js 



import express from 'express';
import { Router } from 'express';
const router = Router();
import Post from '../models/Post';

// CREATE OPERATION (Add a new post)
router.post("", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });

    post.save()
        .then(post => {
            if (post) {
                res.status(201).json({
                    message: "Post added successfully",
                    post: {
                        ...post,
                        id: post._id
                    }
                });
            }
        })
        .catch(error => {
            console.error("Error adding post:", error);
            res.status(500).json({ message: "Error adding post", error: error.message });
        });
});

// READ OPERATION (Fetch posts by user)
router.get("/mypost", (req, res, next) => {
    Post.find({ creator: req.userData.userId })
        .then(posts => {
            if (posts) {
                res.status(200).json({
                    message: "Posts fetched successfully!",
                    posts: posts
                });
            } else {
                res.status(404).json({ message: "No posts found" });
            }
        })
        .catch(error => {
            console.error("Error fetching posts:", error);
            res.status(500).json({ message: "Error fetching posts", error: error.message });
        });
});

// UPDATE OPERATION (Update an existing post)
router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
    });

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
        .then(result => {
            if (result.nModified > 0) {
                res.status(200).json({ message: "Update successful!" });
            } else {
                res.status(401).json({ message: "Not authorized to update post" });
            }
        })
        .catch(error => {
            console.error("Error updating post:", error);
            res.status(500).json({ message: "Error updating post", error: error.message });
        });
});

// DELETE OPERATION (Delete a post)
router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: "Deletion successful!" });
            } else {
                res.status(401).json({ message: "Not authorized to delete this post" });
            }
        })
        .catch(error => {
            console.error("Error deleting post:", error);
            res.status(500).json({ message: "Error deleting post", error: error.message });
        });
});

module.exports = router;