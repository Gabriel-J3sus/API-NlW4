import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database';

describe("User", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      email: "user@example.com",
      name: "User Example"
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a user with an existing email", async () => {
    const response = await request(app).post("/users").send({
      email: "user@example.com",
      name: "User Example"
    });

    expect(response.status).toBe(400);
  })
})

// rm ./src/database/database.test.sqlite
