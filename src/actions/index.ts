import { db } from "@/db";
import { addHeart, getNrOfHearts } from "@/domain/hearts";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";

export const server = {
  addHeart: defineAction({
    input: z.void(),
    handler: async (_input, ctx) => {
      if (!ctx.locals.user) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to add a heart",
        });
      }
      return await addHeart({ db }, { user: ctx.locals.user });
    },
  }),
  getNrOfHearts: defineAction({
    handler: async () => {
      return await getNrOfHearts({ db });
    },
  }),
};
