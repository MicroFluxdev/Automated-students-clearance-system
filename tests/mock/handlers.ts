// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("http://localhost:8080/auth/login", () => {
    return HttpResponse.json({ user: "Mock User" }, { status: 200 });
  }),
];
