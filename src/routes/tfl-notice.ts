import { createRoute, z } from "@hono/zod-openapi";
import type { App } from "..";
import { authentication } from "../middleware/authentication";
import { cache } from "../middleware/cache";
import { withSearchParams } from "../middleware/withSearchParams";
import type { Tags } from "../types";

const path = "/tfl-notice";
const tags = ["the-finals-leaderboard.com"] satisfies Tags[];

const returnSchema = z.object({
  type: z.string().nullable().openapi({ description: "The type of notice.", example: "psa" }),
  message: z.string().nullable().openapi({
    description: "The notice message.",
    example: "Check out my [free API](https://api.the-finals-leaderboard.com)",
  }),
});

export const registerTflNoticeRoutes = (app: App) => {
  const getRoute = createRoute({
    method: "get",
    path,
    middleware: [withSearchParams(), cache("tfl-notice", 1)],
    tags,
    summary: "Get notice",
    description: "Get the latest notice on the-finals-leaderboard.com",
    responses: {
      200: {
        description: "The current notice on the-finals-leaderboard.com",
        content: {
          "application/json": {
            schema: returnSchema.openapi({ description: "The current notice on the-finals-leaderboard.com" }),
          },
        },
      },
    },
  });

  const postRoute = createRoute({
    method: "post",
    path,
    middleware: [authentication],
    tags,
    summary: "Set notice",
    description: "Set the latest notice on the-finals-leaderboard.com",
    request: {
      body: {
        content: {
          "application/json": {
            schema: returnSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "The notice has been set.",
        content: {
          "application/json": {
            schema: returnSchema.openapi({ description: "The notice that was set." }),
          },
        },
      },
    },
  });

  app.openapi(getRoute, async (c) => {
    const noticeMessage = await c.env.KV.get("tfl-notice", "json");
    const parsedNoticeMessage = returnSchema.safeParse(noticeMessage);

    if (parsedNoticeMessage.success) {
      return c.json(parsedNoticeMessage.data, 200);
    }

    return c.json({ type: null, message: null }, 200);
  });

  app.openapi(postRoute, async (c) => {
    const { type, message } = c.req.valid("json");
    await c.env.KV.put("tfl-notice", JSON.stringify({ type, message }));
    return c.json({ type, message }, 200);
  });
};
