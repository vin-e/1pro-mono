import { defineCollection, z } from "astro:content";

const services = defineCollection({
  type: 'content',
  schema: z.object({
    something: z.string()
  })
});

export const collections = {
  services
};