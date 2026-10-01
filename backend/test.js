import request from "supertest";
import app from "./app.js";
import mongoose from "mongoose";
import "dotenv/config";

async function connectdbtest() {
    try {
        const MONGO_URI_TEST = process.env.MONGO_URI_TEST;
        await mongoose.connect(MONGO_URI_TEST);
        console.log("MONGO_DB connected successfully");
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

beforeAll(async () => {
    await connectdbtest();
})

afterAll(async () => {
  await mongoose.connection.close();
});

test('GET /quotes should return 200', async () => {
    const response = await request(app).get("/quotes");
    expect(response.status).toBe(200);
});

test('GET /blogs should return 200', async () => {
    const response = await request(app).get("/blogs");
    expect(response.status).toBe(200);
});

test('GET /articles should return 200', async () => {
    const response = await request(app).get("/articles");
    expect(response.status).toBe(200);
});

test('register login post and delete', async () => {
    const registerresponse = await  request(app).post("/auth/register").send({
        username:"test1234",
        name:"test",
        email:"test@gmail.com",
        password:"test12345"
    });
    expect(registerresponse.status).toBe(201);

    const loginresponse = await request(app).post("/auth/login").send({
        identifier:"test@gmail.com",
        password:"test12345"
    });
    expect(loginresponse.status).toBe(200);
    expect(loginresponse.body).toHaveProperty("access_token");
    expect(loginresponse.body).toHaveProperty("refresh_token");
});
test('registration reject', async () => {
    const registerresponse = await  request(app).post("/auth/register").send({
        username:"test1234",
        name:"test",
        email:"test@gmail.com",
        password:"test12345"
    });
    expect(registerresponse.status).toBe(409);
});
test('login unsucessful', async () => {
    const loginresponse = await request(app).post("/auth/login").send({
        identifier:"test@gmail.com",
        password:"wrongpassword"
    });
    expect(loginresponse.status).toBe(401);
});
test('login route with valid token', async () => {
    const loginresponse = await request(app).post("/auth/login").send({
        identifier:"test@gmail.com",
        password:"test12345"
    });

    const accessToken=loginresponse.body.access_token;

    const response = await request(app).get("/blogs/me").set("Authorization",`Bearer ${accessToken}`);
    expect(response.status).toBe(200);

    const userresponse = await request(app).get("/users/test1234").set("Authorization",`Bearer ${accessToken}`);
    expect(userresponse.status).toBe(200);

    const postresponse = await request(app).post("/blogs").set("Authorization",`Bearer ${accessToken}`).send({
        title: "Test Blog",
        content: "This is a test blog content.",
        anonymous: false
    });
    expect(postresponse.status).toBe(201);
    expect(postresponse.body).toHaveProperty("title","Test Blog");
    expect(postresponse.body).toHaveProperty("content", "This is a test blog content.")
    const blogid=postresponse.body._id;

    const deleteresponse = await request(app).delete(`/blogs/${blogid}`).set("Authorization",`Bearer ${accessToken}`);
    expect(deleteresponse.status).toBe(200);
});
