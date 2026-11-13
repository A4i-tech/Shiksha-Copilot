const request = require("supertest");
const express = require("express");

const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const { excelUpload, profileImageUpload } = require("../../../middlewares/uploadMiddleware");

function buildApp(middleware) {
  const app = express();
  app.post("/upload", middleware, (req, res) => res.status(204).json({ ok: true }));
  return app;
}

function payload(bytes) {
  return Buffer.concat([Buffer.from("504b0304", "hex"), Buffer.alloc(bytes)]);
}

describe("uploadMiddleware", () => {
  it("accepts an xlsx inside the limit", async () => {
    const response = await request(buildApp(excelUpload))
      .post("/upload")
      .attach("file", payload(1024 * 1024), { filename: "t.xlsx", contentType: XLSX });

    expect(response.status).toBe(204);
  });

  it("rejects an xlsx over the limit with the limit and the next action", async () => {
    const response = await request(buildApp(excelUpload))
      .post("/upload")
      .attach("file", payload(3 * 1024 * 1024), { filename: "t.xlsx", contentType: XLSX });

    expect(response.status).toBe(413);
    expect(response.body.message).toContain("2 MB limit");
    expect(response.body.message).toContain("upload again");
  });

  it("rejects a file whose content does not match its type", async () => {
    const response = await request(buildApp(excelUpload))
      .post("/upload")
      .attach("file", Buffer.from("not a zip"), { filename: "t.xlsx", contentType: XLSX });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("does not match its type");
  });

  it("gives the image uploader its own limit message", async () => {
    const image = Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), Buffer.alloc(6 * 1024 * 1024)]);
    const response = await request(buildApp(profileImageUpload))
      .post("/upload")
      .attach("file", image, { filename: "p.png", contentType: "image/png" });

    expect(response.status).toBe(413);
    expect(response.body.message).toContain("Image is larger than the 5 MB limit");
  });
});
