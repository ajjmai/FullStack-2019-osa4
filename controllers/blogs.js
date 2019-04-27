const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs.map(b => b.toJSON()));
});

blogRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  });

  try {
    const savedBlog = await blog.save();
    response.json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogRouter;
