#!/usr/bin/env node

const { Pool } = require('pg');
const { createClient } = require('redis');

const DATABASE_URL = 'postgresql://yyc3:yyc3_my@192.168.3.45:5432/yyc3_my';
const REDIS_URL = 'redis://localhost:6379';

async function testPostgreSQL() {
  console.log('\n🔍 测试 PostgreSQL 数据库连接...');
  console.log('连接信息:', DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    connectionTimeoutMillis: 10000
  });

  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL 连接成功！');
    
    const result = await client.query('SELECT version();');
    console.log('📊 数据库版本:', result.rows[0].version.split(' ')[1]);
    
    const dbResult = await client.query('SELECT current_database();');
    console.log('📁 当前数据库:', dbResult.rows[0].current_database);
    
    const userResult = await client.query('SELECT current_user;');
    console.log('👤 当前用户:', userResult.rows[0].current_user);
    
    const tablesResult = await client.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 数据表数量:', tablesResult.rows[0].table_count);
    
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL 连接失败:', error.message);
    await pool.end().catch(() => {});
    return false;
  }
}

async function testRedis() {
  console.log('\n🔍 测试 Redis 连接...');
  console.log('连接信息:', REDIS_URL);
  
  const client = createClient({
    url: REDIS_URL,
    socket: {
      connectTimeout: 10000
    }
  });

  try {
    await client.connect();
    console.log('✅ Redis 连接成功！');
    
    const pingResult = await client.ping();
    console.log('📡 PING 结果:', pingResult);
    
    const info = await client.info('server');
    const versionMatch = info.match(/redis_version:([^\r\n]+)/);
    if (versionMatch) {
      console.log('📊 Redis 版本:', versionMatch[1]);
    }
    
    const dbSize = await client.dbSize();
    console.log('📁 数据库大小:', dbSize, '个键');
    
    await client.quit();
    return true;
  } catch (error) {
    console.error('❌ Redis 连接失败:', error.message);
    await client.quit().catch(() => {});
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('YYC³ 数据库连接测试');
  console.log('='.repeat(60));

  const pgResult = await testPostgreSQL();
  const redisResult = await testRedis();

  console.log('\n' + '='.repeat(60));
  console.log('测试结果汇总:');
  console.log('='.repeat(60));
  console.log(`PostgreSQL: ${pgResult ? '✅ 成功' : '❌ 失败'}`);
  console.log(`Redis:      ${redisResult ? '✅ 成功' : '❌ 失败'}`);
  console.log('='.repeat(60));

  process.exit(pgResult && redisResult ? 0 : 1);
}

main().catch(error => {
  console.error('测试过程中发生错误:', error);
  process.exit(1);
});
