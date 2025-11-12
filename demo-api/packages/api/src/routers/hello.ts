import { publicProcedure, router } from "../index";
import z from "zod";

export const helloRouter = router({
  greet: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      const name = input.name || "World";
      return {
        message: `Hello, ${name}!`,
        timestamp: new Date().toISOString(),
      };
    }),

  randomGreeting: publicProcedure.query(() => {
    const greetings = ["Hello", "Hi", "Hey", "Greetings", "Salutations"];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    return {
      greeting: randomGreeting,
      message: `${randomGreeting}, welcome to our API!`,
    };
  }),
});