// =======================
// Add Blog
// =======================

const blogForm = document.getElementById("blogForm");

if (blogForm) {

    blogForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const content = document.getElementById("content").value.trim();

        if (title.length < 3) {
            alert("Title must contain at least 3 characters.");
            return;
        }

        if (author.length < 3) {
            alert("Author name must contain at least 3 characters.");
            return;
        }

        if (content.length < 10) {
            alert("Content must contain at least 10 characters.");
            return;
        }

        const submitBtn = document.getElementById("submitBtn");

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = "Adding...";
        }

        try {

            const response = await fetch("/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    author,
                    content
                })
            });

            const data = await response.json();

            alert(data.message);

            blogForm.reset();

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Add Blog";
            }

            window.location.href = "index.html";

        } catch (error) {

            console.error(error);

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Add Blog";
            }

            alert("Unable to connect to server.");

        }

    });

}

// =======================
// Load Blogs
// =======================

let allBlogs = [];

async function loadBlogs() {

    const blogContainer = document.getElementById("blogContainer");

    if (!blogContainer) return;

    try {

        const response = await fetch("/blogs");

        allBlogs = await response.json();

        displayBlogs(allBlogs);

    } catch (error) {

        console.error(error);

    }

}

// =======================
// Display Blogs
// =======================

function displayBlogs(blogs) {

    const blogContainer = document.getElementById("blogContainer");

    blogContainer.innerHTML = "";

    if (blogs.length === 0) {

        blogContainer.innerHTML = `
            <h2>No Matching Blogs Found</h2>
            <p>Click "Add Blog" to create your first blog.</p>
        `;

        return;
    }

    blogs.forEach(blog => {

        blogContainer.innerHTML += `
            <div class="blog-card">

                <h3>${blog.title}</h3>

                <p>${blog.content}</p>

                <p><strong>Author:</strong> ${blog.author}</p>

                <button onclick="editBlog(${blog.id})">
                    Edit
                </button>

                <button onclick="deleteBlog(${blog.id})">
                    Delete
                </button>

            </div>
        `;

    });

}

// =======================
// Search Blogs
// =======================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const keyword = searchInput.value.toLowerCase();

        const filteredBlogs = allBlogs.filter(blog => {

            return (
                blog.title.toLowerCase().includes(keyword) ||
                blog.author.toLowerCase().includes(keyword)
            );

        });

        displayBlogs(filteredBlogs);

    });

}

// =======================
// Edit Blog
// =======================

async function editBlog(id) {

    const title = prompt("Enter New Title");

    if (title === null) return;

    const author = prompt("Enter New Author");

    if (author === null) return;

    const content = prompt("Enter New Content");

    if (content === null) return;

    try {

        const response = await fetch(`/blogs/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                author,
                content
            })

        });

        const data = await response.json();

        alert(data.message);

        loadBlogs();

    } catch (error) {

        console.error(error);

        alert("Error updating blog.");

    }

}

// =======================
// Delete Blog
// =======================

async function deleteBlog(id) {

    const confirmDelete = confirm("Are you sure you want to delete this blog?");

    if (!confirmDelete) return;

    try {

        const response = await fetch(`/blogs/${id}`, {

            method: "DELETE"

        });

        const data = await response.json();

        alert(data.message);

        loadBlogs();

    } catch (error) {

        console.error(error);

        alert("Error deleting blog.");

    }

}

// =======================
// Start
// =======================

loadBlogs();