import { Environments } from "../constants/common";

export const baseUrl =
  process.env.NODE_ENV === Environments.Production
    ? "https://p.raxis.xyz"
    : "http://localhost:3000";
