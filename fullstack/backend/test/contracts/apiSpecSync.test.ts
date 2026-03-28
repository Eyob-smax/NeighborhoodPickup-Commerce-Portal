import fs from "node:fs/promises";

import { openApiSpec } from "../../src/docs/openapi";

describe("api-spec markdown sync", () => {
  it("documents canonical base URL, docs endpoints, and cookie name", async () => {
    const markdown = await fs.readFile(
      new URL("../../../../docs/api-spec.md", import.meta.url),
      "utf8",
    );

    const baseUrl = openApiSpec.servers[0]?.url;
    const cookieName = openApiSpec.components.securitySchemes.cookieAuth.name;

    expect(markdown).toContain(`Base URL (local): \`${baseUrl}\``);
    expect(markdown).toContain("Swagger UI: `GET /docs`");
    expect(markdown).toContain("OpenAPI JSON: `GET /openapi.json`");
    expect(markdown).toContain(`Cookie name: \`${cookieName}\``);
  });

  it("documents critical implemented endpoints", async () => {
    const markdown = await fs.readFile(
      new URL("../../../../docs/api-spec.md", import.meta.url),
      "utf8",
    );

    const requiredEndpoints = [
      "POST /auth/login",
      "POST /auth/logout",
      "GET /auth/me",
      "POST /orders/quote",
      "POST /orders/checkout",
      "GET /orders/:id",
      "POST /comments",
      "GET /threads/:id/comments",
      "PATCH /notifications/:id/read-state",
      "GET /appeals",
      "POST /appeals",
      "GET /appeals/:id",
      "POST /appeals/:id/files",
      "GET /appeals/:id/timeline",
      "PATCH /appeals/:id/status",
      "GET /finance/reconciliation/export",
      "GET /audit/logs",
      "GET /audit/logs/export",
      "GET /audit/logs/verify-chain",
      "POST /behavior/events",
      "POST /admin/jobs/retention-run",
    ];

    for (const endpoint of requiredEndpoints) {
      expect(markdown).toContain(endpoint);
    }
  });
});
