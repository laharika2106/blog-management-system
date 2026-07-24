const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let blogs = [];

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get All Blogs
app.get("/blogs", (req, res) => {
    res.json(blogs);
});

// Add Blog
app.post("/blogs", (req, res) => {

    const newBlog = {
        id: blogs.length + 1,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    };

    blogs.push(newBlog);

    res.status(201).json({
        message: "Blog Added Successfully",
        blog: newBlog
    });

});

// Update Blog
app.put("/blogs/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const blog = blogs.find(blog => blog.id === id);

    if (!blog) {
        return res.status(404).json({
            message: "Blog Not Found"
        });
    }

    blog.title = req.body.title;
    blog.author = req.body.author;
    blog.content = req.body.content;

    res.json({
        message: "Blog Updated Successfully",
        blog
    });

});

// Delete Blog
app.delete("/blogs/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const blogIndex = blogs.findIndex(blog => blog.id === id);

    if (blogIndex === -1) {
        return res.status(404).json({
            message: "Blog Not Found"
        });
    }

    const deletedBlog = blogs.splice(blogIndex, 1);

    res.json({
        message: "Blog Deleted Successfully",
        blog: deletedBlog[0]
    });

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});