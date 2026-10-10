import "dotenv/config";
import request from "supertest";
import app from "./app.js";
import mongoose from "mongoose";
import users from "./users.js";
import redis from "./redis.js";

async function connectdbtest() {
    try {
        const MONGO_URI_TEST = process.env.MONGO_URI_TEST || process.env.MONGO_URI_TEST_DOCKER;
        await mongoose.connect(MONGO_URI_TEST);
        console.log("MONGO_DB connected successfully");
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const TEST_EMAIL = "test@gmail.com";

const waitForRedis = async () => {
    for (let i = 0; i < 50 && !redis.isReady; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!redis.isReady) throw new Error("Redis is not ready");
};

const blogVersion = async () => Number(await redis.get("blogs:version")) || 0;

const clearBlogCache = async () => {
    const keys = await redis.keys("blogs:*");
    if (keys.length) await redis.del(keys);
};

beforeAll(async () => {
    await connectdbtest();
    await users.deleteMany({ $or: [{ email: TEST_EMAIL }, { username: "test1234" }] });
})

afterAll(async () => {
    await users.deleteMany({ $or: [{ email: TEST_EMAIL }, { username: "test1234" }] });
    if (redis.isOpen) await redis.quit().catch(() => {});
    await mongoose.connection.close();
});

test('GET /quotes should return 200', async () => {
    const response = await request(app).get("/quotes");
    expect(response.status).toBe(200);
});

test('GET /blogs should return 200', async () => {
    const response = await request(app).get("/blogs");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blogs");
    expect(response.body).toHaveProperty("totalPages");
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
    await waitForRedis();

    const loginresponse = await request(app).post("/auth/login").send({
        identifier:"test@gmail.com",
        password:"test12345"
    });

    const accessToken=loginresponse.body.access_token;

    const response = await request(app).get("/blogs/me").set("Authorization",`Bearer ${accessToken}`);
    expect(response.status).toBe(200);

    const userresponse = await request(app).get("/users/test1234").set("Authorization",`Bearer ${accessToken}`);
    expect(userresponse.status).toBe(200);

    const versionBefore = await blogVersion();

    const postresponse = await request(app).post("/blogs").set("Authorization",`Bearer ${accessToken}`).send({
        title: "Test Blog",
        content: "This is a test blog content.",
        anonymous: false
    });
    expect(postresponse.status).toBe(201);
    expect(postresponse.body).toHaveProperty("title","Test Blog");
    expect(postresponse.body).toHaveProperty("content", "This is a test blog content.")
    const blogid=postresponse.body._id;

    const versionAfterCreate = await blogVersion();
    expect(versionAfterCreate).toBeGreaterThan(versionBefore);

    const deleteresponse = await request(app).delete(`/blogs/${blogid}`).set("Authorization",`Bearer ${accessToken}`);
    expect(deleteresponse.status).toBe(200);

    const versionAfterDelete = await blogVersion();
    expect(versionAfterDelete).toBeGreaterThan(versionAfterCreate);
});

describe("Redis blog cache", () => {
    const LIST_URL = "/blogs?page=1&limit=10";

    const currentListKey = async () =>
        `blogs:list:v${await blogVersion()}:p1:l10`;

    beforeAll(async () => {
        await waitForRedis();
    }, 15000);

    beforeEach(async () => {
        await clearBlogCache();
    });

    test("GET /blogs saves the page in Redis with an expiry", async () => {
        const response = await request(app).get(LIST_URL);
        expect(response.status).toBe(200);

        const key = await currentListKey();
        expect(await redis.get(key)).not.toBeNull();
        expect(await redis.ttl(key)).toBeGreaterThan(0);
    });

    test("a second request is served from the cache", async () => {
        const key = await currentListKey();
        const fake = { blogs: [], page: 1, totalPages: 0, total: 0, from: "cache" };
        await redis.set(key, JSON.stringify(fake), { EX: 60 });

        const response = await request(app).get(LIST_URL);

        expect(response.status).toBe(200);
        expect(response.body.from).toBe("cache");
    });

    test("searches are not cached", async () => {
        const response = await request(app).get("/blogs?search=zzz&page=1&limit=10");
        expect(response.status).toBe(200);

        const keys = await redis.keys("blogs:list:*");
        expect(keys).toHaveLength(0);
    });
});