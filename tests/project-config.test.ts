import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "..");

function readProjectFile(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), "utf8");
}

const workflow = readProjectFile(".github/workflows/ci.yml");
const workspaceConfig = readProjectFile("pnpm-workspace.yaml");
const packageJson = JSON.parse(readProjectFile("package.json")) as {
  packageManager?: string;
  engines?: { pnpm?: string };
};

function extractStep(source: string, uses: string): string {
  const lines = source.split(/\r?\n/);
  const usesIndex = lines.findIndex((line) => line.trim() === `uses: ${uses}`);
  if (usesIndex === -1) throw new Error(`Step "${uses}" não encontrado no workflow`);

  const stepStart = lines.slice(0, usesIndex + 1).findLastIndex((line) => /^\s*- /.test(line));
  const stepIndent = lines[stepStart].search(/\S/);
  const nextStep = lines.findIndex(
    (line, index) => index > usesIndex && line.search(/\S/) === stepIndent && /^\s*- /.test(line),
  );

  return lines.slice(stepStart, nextStep === -1 ? undefined : nextStep).join("\n");
}

function majorVersion(version: string): number {
  return Number(version.match(/\d+/)?.[0]);
}

describe("versão do pnpm", () => {
  it("é fixada no packageManager do package.json", () => {
    expect(packageJson.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+$/);
  });

  it("tem engines.pnpm compatível com o packageManager", () => {
    const pinned = majorVersion(packageJson.packageManager ?? "");
    expect(majorVersion(packageJson.engines?.pnpm ?? "")).toBe(pinned);
  });

  it("não é repetida no pnpm/action-setup do workflow", () => {
    const setupPnpm = extractStep(workflow, "pnpm/action-setup@v6");
    expect(setupPnpm).not.toMatch(/^\s*version:/m);
  });
});

describe("configuração do pnpm", () => {
  it("usa nodeLinker hoisted no pnpm-workspace.yaml", () => {
    expect(workspaceConfig).toMatch(/^nodeLinker:\s*hoisted\s*$/m);
  });

  it("não depende do .npmrc para opções que o pnpm 11+ ignora", () => {
    const npmrcPath = path.join(root, ".npmrc");
    const npmrc = existsSync(npmrcPath) ? readFileSync(npmrcPath, "utf8") : "";
    expect(npmrc).not.toMatch(/^\s*node-linker\s*=/m);
  });
});
