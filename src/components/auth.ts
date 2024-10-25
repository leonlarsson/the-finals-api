import type { App } from "..";

export const registerAuthComponent = (app: App) => {
  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  });
};
