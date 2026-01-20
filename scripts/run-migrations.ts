import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'
import pool from '../lib/db/client'

const MIGRATIONS_DIR = path.join(process.cwd(), 'migrations')

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n')

  try {
    const client = await pool.connect()

    try {
      const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter((file) => file.endsWith('.sql'))
        .sort()

      console.log(`📁 Found ${files.length} migration files\n`)

      for (const file of files) {
        const version = file.split('_')[0]
        const filePath = path.join(MIGRATIONS_DIR, file)
        const sql = fs.readFileSync(filePath, 'utf-8')

        console.log(`📝 Applying migration: ${file}`)

        const startTime = Date.now()

        try {
          await client.query('BEGIN')

          await client.query(sql)

          await client.query(`
            INSERT INTO migrations (version, name, execution_time, success)
            VALUES ($1, $2, $3, true)
            ON CONFLICT (version) DO UPDATE SET
              applied_at = CURRENT_TIMESTAMP,
              execution_time = $3,
              success = true,
              error_message = NULL
          `, [version, file.replace('.sql', ''), Date.now() - startTime])

          await client.query('COMMIT')

          const duration = Date.now() - startTime
          console.log(`✅ Migration ${file} completed successfully (${duration}ms)\n`)
        } catch (error) {
          await client.query('ROLLBACK')

          await client.query(`
            INSERT INTO migrations (version, name, execution_time, success, error_message)
            VALUES ($1, $2, $3, false, $4)
            ON CONFLICT (version) DO UPDATE SET
              applied_at = CURRENT_TIMESTAMP,
              execution_time = $3,
              success = false,
              error_message = $4
          `, [version, file.replace('.sql', ''), Date.now() - startTime, String(error)])

          console.error(`❌ Migration ${file} failed:`, error)
          throw error
        }
      }

      const result = await client.query(`
        SELECT version, name, applied_at, execution_time, success
        FROM migrations
        ORDER BY version
      `)

      console.log('\n📊 Migration Summary:')
      console.log('─'.repeat(80))
      result.rows.forEach((row: any) => {
        const status = row.success ? '✅' : '❌'
        console.log(`${status} ${row.version.padEnd(5)} | ${row.name.padEnd(40)} | ${row.execution_time}ms | ${row.applied_at}`)
      })
      console.log('─'.repeat(80))
      console.log(`\n✨ All migrations completed successfully!`)

    } finally {
      client.release()
    }
  } catch (error) {
    console.error('\n💥 Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigrations()
