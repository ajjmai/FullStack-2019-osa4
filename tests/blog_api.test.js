const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body.length).toBe(2);
});

test("blogs have id-field called 'id' ", async () => {
  const response = await api.get("/api/blogs");
  const data = response.body.map(b => b.id);

  const checkId = id => {
    expect(id).toBeDefined();
  };

  data.forEach(checkId);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const title = response.body.map(b => b.title);

  expect(response.body.length).toBe(3);
  expect(title).toContain("Type wars");
});

test("defaul value of likes is zero", async () => {
  const newBlog = {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const body = response.body[response.body.length - 1];
  const likes = body.likes;
  expect(likes).toBe(0);
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  };

  const blogsAtStart = await api.get("/api/blogs");
  length = blogsAtStart.body.length;

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400);

  const response = await api.get("/api/blogs");
  expect(response.body.length).toBe(length);
});

test("blog without url is not added", async () => {
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    likes: 10
  };

  const blogsAtStart = await api.get("/api/blogs");
  length = blogsAtStart.body.length;

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400);

  const response = await api.get("/api/blogs");
  expect(response.body.length).toBe(length);
});

test("a note can be deleted", async () => {
  const blogsAtStart = await api.get("/api/blogs");
  length = blogsAtStart.body.length;

  const blogToDelete = blogsAtStart.body[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await api.get("/api/blogs");
  expect(blogsAtEnd.body.length).toBe(length - 1);

  const titles = blogsAtEnd.body.map(b => b.title);

  expect(titles).not.toContain(blogToDelete.title);
});

afterAll(() => {
  mongoose.connection.close();
});
