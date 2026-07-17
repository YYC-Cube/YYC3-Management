import { query } from '../client'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const MIGRATIONS_TABLE = 'sys_migration'

async function ensureMigrationsTable(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      checksum VARCHAR(64),
      duration_ms INTEGER
    )
  `)
}

async function getExecuted(): Promise<Set<string>> {
  const rows = await query<{ filename: string }>(
    `SELECT filename FROM ${MIGRATIONS_TABLE} ORDER BY id`
  )
  return new Set(rows.map(r => r.filename))
}

export async function runMigrations(): Promise<void> {
  console.log('[Migration] Starting...')
  await ensureMigrationsTable()
  const executed = await getExecuted()

  const dir = join(__dirname)
  const files = readdirSync(dir)
    .filter(f => f.endsWith('.sql') || f.endsWith('.pgsql'))
    .sort()

  let total = 0
  for (const file of files) {
    if (executed.has(file)) {
      console.log(`[Migration] SKIP ${file} (already executed)`)
      continue
    }

    const sql = readFileSync(join(dir, file), 'utf-8')
    const start = Date.now()

    try {
      await query(sql)
      const duration = Date.now() - start
      await query(
        `INSERT INTO ${MIGRATIONS_TABLE} (filename, checksum, duration_ms) VALUES ($1, $2, $3)`,
        [file, `${sql.length}_${sql.trim().slice(0, 20)}`, duration]
      )
      console.log(`[Migration] ✅ ${file} (${duration}ms)`)
      total++
    } catch (err) {
      console.error(`[Migration] ❌ ${file}:`, err)
      throw err
    }
  }

  console.log(`[Migration] Done. ${total} new migrations applied.`)
}

// CLI support
if (process.argv[1]?.endsWith('migrate.ts')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
