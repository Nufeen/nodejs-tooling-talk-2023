import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerui from "@fastify/swagger-ui";
import metricsPlugin from "fastify-metrics";

const fastify = Fastify({
  logger: true,
});

await fastify.register(swagger, {});

await fastify.register(metricsPlugin, { endpoint: "/metrics" });

fastify.register(swaggerui, {
  routePrefix: "/api",
});

fastify.get(
  "/",
  {
    schema: {
      response: {
        200: {
          description: "response and schema description",
          type: "object",
          properties: { hello: { type: "string" } },
        },
      },
    },
  },
  async (request, reply) => {
    return { hello: "ts world" };
  }
);

fastify.listen({ port: 3000 });
