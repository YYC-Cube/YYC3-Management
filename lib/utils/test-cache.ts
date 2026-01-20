// 测试结果缓存工具 - 用于缓存非关键测试场景的结果以提高测试执行效率
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @status: published
// @tags: 测试,缓存,性能,优化

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

interface CacheEntry {
  key: string;
  result: any;
  timestamp: number;
  testFile: string;
  testName: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRate: number;
}

class TestCache {
  private cacheDir: string;
  private cacheFile: string;
  private cache: Map<string, CacheEntry>;
  private stats: CacheStats;
  private enabled: boolean;
  private ttl: number;

  constructor(options: {
    enabled?: boolean;
    ttl?: number;
    cacheDir?: string;
  } = {}) {
    this.enabled = options.enabled ?? true;
    this.ttl = options.ttl ?? 3600000; // 默认1小时
    this.cacheDir = options.cacheDir ?? path.join(process.cwd(), '.test-cache');
    this.cacheFile = path.join(this.cacheDir, 'cache.json');
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      hitRate: 0,
    };

    this.ensureCacheDir();
    this.loadCache();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private loadCache(): void {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, 'utf-8');
        const entries = JSON.parse(data) as CacheEntry[];
        entries.forEach(entry => {
          if (Date.now() - entry.timestamp < this.ttl) {
            this.cache.set(entry.key, entry);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load test cache:', error);
    }
  }

  private saveCache(): void {
    try {
      const entries = Array.from(this.cache.values());
      fs.writeFileSync(this.cacheFile, JSON.stringify(entries, null, 2));
    } catch (error) {
      console.warn('Failed to save test cache:', error);
    }
  }

  private generateKey(testFile: string, testName: string, testArgs: any = {}): string {
    const hash = crypto.createHash('sha256');
    hash.update(testFile);
    hash.update(testName);
    hash.update(JSON.stringify(testArgs));
    return hash.digest('hex');
  }

  public get(testFile: string, testName: string, testArgs: any = {}): any | null {
    if (!this.enabled) {
      return null;
    }

    const key = this.generateKey(testFile, testName, testArgs);
    const entry = this.cache.get(key);

    this.stats.totalRequests++;

    if (entry && Date.now() - entry.timestamp < this.ttl) {
      this.stats.hits++;
      this.updateHitRate();
      console.log(`✅ Cache hit: ${testFile} - ${testName}`);
      return entry.result;
    }

    this.stats.misses++;
    this.updateHitRate();
    return null;
  }

  public set(testFile: string, testName: string, result: any, testArgs: any = {}): void {
    if (!this.enabled) {
      return;
    }

    const key = this.generateKey(testFile, testName, testArgs);
    const entry: CacheEntry = {
      key,
      result,
      timestamp: Date.now(),
      testFile,
      testName,
    };

    this.cache.set(key, entry);
    this.saveCache();
  }

  public invalidate(testFile?: string, testName?: string): void {
    if (!testFile && !testName) {
      this.cache.clear();
      this.saveCache();
      return;
    }

    for (const [key, entry] of this.cache.entries()) {
      if (testFile && entry.testFile !== testFile) {
        continue;
      }
      if (testName && entry.testName !== testName) {
        continue;
      }
      this.cache.delete(key);
    }

    this.saveCache();
  }

  public clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      hitRate: 0,
    };
    this.saveCache();
  }

  public cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.ttl) {
        this.cache.delete(key);
      }
    }
    this.saveCache();
  }

  private updateHitRate(): void {
    if (this.stats.totalRequests > 0) {
      this.stats.hitRate = this.stats.hits / this.stats.totalRequests;
    }
  }

  public getStats(): CacheStats {
    return { ...this.stats };
  }

  public printStats(): void {
    console.log('\n📊 Test Cache Statistics:');
    console.log(`   Total Requests: ${this.stats.totalRequests}`);
    console.log(`   Hits: ${this.stats.hits}`);
    console.log(`   Misses: ${this.stats.misses}`);
    console.log(`   Hit Rate: ${(this.stats.hitRate * 100).toFixed(2)}%`);
    console.log(`   Cache Size: ${this.cache.size} entries`);
    console.log('');
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public setTTL(ttl: number): void {
    this.ttl = ttl;
    this.cleanup();
  }
}

export default TestCache;
