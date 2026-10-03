import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Evita Next inferir root errado quando há outros lockfiles no usuário.
  outputFileTracingRoot: path.join(__dirname),
  // O seed é lido via fs em runtime; sem isso ele não entra no bundle de deploy.
  outputFileTracingIncludes: {
    "/": ["./data/zonas-criticas.seed.geojson"],
  },
};

export default nextConfig;
