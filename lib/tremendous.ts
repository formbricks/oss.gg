import { TREMENDOUS_API_KEY } from "@/lib/constants";
import { Configuration, Environments, OrdersApi } from "tremendous";

const config = new Configuration({
  basePath: process.env.NODE_ENV === "production" ? Environments.production : Environments.testflight,
  accessToken: TREMENDOUS_API_KEY,
});

export const bountyOrders = new OrdersApi(config);
