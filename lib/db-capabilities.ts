import { db } from "@/prisma/db";

const TABLE_CAPABILITIES_TTL_MS = 60_000;
let capabilityCache: Map<string, boolean> = new Map();
let capabilityCacheExpiresAt = 0;

async function loadTableCapabilities(): Promise<Map<string, boolean>> {
  const now = Date.now();
  if (now < capabilityCacheExpiresAt) {
    return capabilityCache;
  }

  const rows = await db.$queryRaw<Array<{ table_name: string }>>`
    SELECT tablename AS table_name
    FROM pg_catalog.pg_tables
    WHERE schemaname = 'public'
  `;

  const nextCache = new Map<string, boolean>();
  for (const row of rows) {
    nextCache.set(row.table_name, true);
  }

  capabilityCache = nextCache;
  capabilityCacheExpiresAt = now + TABLE_CAPABILITIES_TTL_MS;
  return capabilityCache;
}

export async function hasTable(tableName: string): Promise<boolean> {
  const capabilities = await loadTableCapabilities();
  return capabilities.get(tableName) ?? false;
}

export async function hasTables(
  tableNames: string[]
): Promise<Record<string, boolean>> {
  const capabilities = await loadTableCapabilities();
  const result: Record<string, boolean> = {};
  for (const tableName of tableNames) {
    result[tableName] = capabilities.get(tableName) ?? false;
  }
  return result;
}
