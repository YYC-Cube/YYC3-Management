/**
 * AI组件系统性能基准测试
 * 
 * 测试系统的各项性能指标：
 * - 组件初始化时间
 * - 事件发布延迟
 * - 请求-响应往返时间
 * - 内存使用情况
 * - 并发处理能力
 * 
 * @module Benchmarks/AIComponents
 */

import Benchmark from 'benchmark';
import { ComponentEventBus } from '../ComponentEventBus';
import { ComponentLifecycleManager } from '../ComponentLifecycleManager';
import { AIComponentsIntegration } from '../AIComponentsIntegration';
import type { ComponentEvent, ComponentConfig } from '../types';

// ============================================================================
// 基准测试工具
// ============================================================================

interface BenchmarkResult {
  name: string;
  opsPerSecond: number;
  meanTime: number; // 毫秒
  standardDeviation: number;
  marginOfError: number;
  relativeMarginOfError: number;
}

class PerformanceBenchmark {
  private suite: Benchmark.Suite;
  private results: BenchmarkResult[] = [];
  
  constructor(private name: string) {
    this.suite = new Benchmark.Suite(name);
  }
  
  add(testName: string, fn: () => void | Promise<void>): this {
    this.suite.add(testName, fn);
    return this;
  }
  
  async run(): Promise<BenchmarkResult[]> {
    return new Promise((resolve) => {
      this.suite
        .on('cycle', (event: any) => {
          const bench = event.target;
          const result: BenchmarkResult = {
            name: bench.name,
            opsPerSecond: bench.hz,
            meanTime: bench.stats.mean * 1000,
            standardDeviation: bench.stats.deviation * 1000,
            marginOfError: bench.stats.moe * 1000,
            relativeMarginOfError: bench.stats.rme,
          };
          
          this.results.push(result);
          console.log(String(bench));
        })
        .on('complete', () => {
          console.log(`\n${this.name} - Fastest: ${this.suite.filter('fastest').map('name')}`);
          resolve(this.results);
        })
        .run({ async: true });
    });
  }
  
  getResults(): BenchmarkResult[] {
    return this.results;
  }
}

// ============================================================================
// EventBus 性能测试
// ============================================================================

export async function benchmarkEventBus(): Promise<void> {
  console.log('\n=== ComponentEventBus Performance Benchmark ===\n');
  
  const benchmark = new PerformanceBenchmark('EventBus');
  const eventBus = ComponentEventBus.getInstance();
  
  // 测试1: 简单发布-订阅
  benchmark.add('Simple Publish-Subscribe', () => {
    const channel = 'bench-channel';
    const listener = () => {};
    const subscription = eventBus.subscribe(channel, listener);
    
    eventBus.publish(channel, {
      type: 'test',
      source: 'benchmark',
      data: {}
    });
    
    subscription.unsubscribe();
  });
  
  // 测试2: 多订阅者场景
  benchmark.add('Multiple Subscribers (10)', () => {
    const channel = 'multi-channel';
    const listeners = Array.from({ length: 10 }, () => () => {});
    const subscriptions = listeners.map(l => eventBus.subscribe(channel, l));
    
    eventBus.publish(channel, {
      type: 'test',
      source: 'benchmark',
      data: {}
    });
    
    subscriptions.forEach(s => s.unsubscribe());
  });
  
  // 测试3: 事件过滤
  benchmark.add('Event Filtering', () => {
    const channel = 'filter-channel';
    const listener = (event: ComponentEvent) => {
      if (event.type !== 'specific') return;
    };
    const subscription = eventBus.subscribe(channel, listener);
    
    // 匹配的事件
    eventBus.publish(channel, {
      type: 'specific',
      source: 'benchmark',
      data: {}
    });
    
    // 不匹配的事件
    eventBus.publish(channel, {
      type: 'other',
      source: 'benchmark',
      data: {}
    });
    
    subscription.unsubscribe();
  });
  
  // 测试4: 请求-响应模式
  benchmark.add('Request-Response Pattern', async () => {
    const channel = 'rpc-channel';
    
    const responder = (event: ComponentEvent) => {
      if (event.type === 'request') {
        eventBus.respond(event, { result: 'ok' });
      }
    };
    
    const subscription = eventBus.subscribe(channel, responder);
    
    await eventBus.request(channel, {
      type: 'request',
      source: 'benchmark',
      data: {}
    });
    
    subscription.unsubscribe();
  });
  
  // 测试5: 全局监听器
  benchmark.add('Global Listener', () => {
    const globalListener = () => {};
    const subscription = eventBus.subscribeGlobal(globalListener);
    
    eventBus.publish('channel-1', { type: 'test', source: 'benchmark', data: {} });
    eventBus.publish('channel-2', { type: 'test', source: 'benchmark', data: {} });
    
    subscription.unsubscribe();
  });
  
  const results = await benchmark.run();
  
  // 分析结果
  console.log('\n=== EventBus Performance Analysis ===\n');
  results.forEach(result => {
    console.log(`${result.name}:`);
    console.log(`  - Throughput: ${result.opsPerSecond.toFixed(0)} ops/sec`);
    console.log(`  - Mean Time: ${result.meanTime.toFixed(3)} ms`);
    console.log(`  - Std Dev: ±${result.standardDeviation.toFixed(3)} ms`);
    console.log(`  - Margin of Error: ±${result.relativeMarginOfError.toFixed(2)}%\n`);
  });
  
  // 性能目标验证
  const publishSubscribeResult = results.find(r => r.name.includes('Simple'));
  if (publishSubscribeResult) {
    const targetLatency = 10; // 目标: <10ms
    if (publishSubscribeResult.meanTime < targetLatency) {
      console.log(`✅ EventBus meets latency target (<${targetLatency}ms): ${publishSubscribeResult.meanTime.toFixed(2)}ms`);
    } else {
      console.warn(`⚠️  EventBus exceeds latency target: ${publishSubscribeResult.meanTime.toFixed(2)}ms > ${targetLatency}ms`);
    }
  }
}

// ============================================================================
// LifecycleManager 性能测试
// ============================================================================

export async function benchmarkLifecycleManager(): Promise<void> {
  console.log('\n=== ComponentLifecycleManager Performance Benchmark ===\n');
  
  const benchmark = new PerformanceBenchmark('LifecycleManager');
  
  // 创建mock组件工厂
  function createMockComponent(id: string, deps: string[] = []) {
    const mockConfig: ComponentConfig = {
      id,
      name: id,
      enabled: true,
      autoStart: true,
      dependencies: deps,
      priority: 0,
      timeout: 10000,
      retryPolicy: {
        maxAttempts: 3,
        backoffMultiplier: 2,
        initialDelay: 1000,
        maxDelay: 5000
      },
      metrics: {
        enabled: true,
        interval: 60000,
        retention: 3600000
      }
    };
    
    return {
      id,
      name: id,
      config: mockConfig,
      initialize: async (config: ComponentConfig) => {},
      start: async () => {},
      stop: async () => {},
      destroy: async () => {},
      getStatus: () => 'idle' as const,
    };
  }
  
  // 测试1: 注册单个组件
  benchmark.add('Register Single Component', () => {
    const manager = new ComponentLifecycleManager();
    const component = createMockComponent('comp-1');
    manager.register(component);
  });
  
  // 测试2: 注册10个组件
  benchmark.add('Register 10 Components', () => {
    const manager = new ComponentLifecycleManager();
    for (let i = 0; i < 10; i++) {
      manager.register(createMockComponent(`comp-${i}`));
    }
  });
  
  // 测试3: 简单依赖解析（3个组件）
  benchmark.add('Resolve Simple Dependencies (3 components)', async () => {
    const manager = new ComponentLifecycleManager();
    manager.register(createMockComponent('comp-1', []));
    manager.register(createMockComponent('comp-2', ['comp-1']));
    manager.register(createMockComponent('comp-3', ['comp-2']));
    await manager.initializeAll();
  });
  
  // 测试4: 复杂依赖解析（10个组件）
  benchmark.add('Resolve Complex Dependencies (10 components)', async () => {
    const manager = new ComponentLifecycleManager();
    
    // 创建树形依赖结构
    manager.register(createMockComponent('root', []));
    for (let i = 1; i < 10; i++) {
      const parent = `comp-${Math.floor((i - 1) / 2)}`;
      manager.register(createMockComponent(`comp-${i}`, i === 1 ? ['root'] : [parent]));
    }
    
    await manager.initializeAll();
  });
  
  // 测试5: 并行初始化（5个相同优先级组件）
  benchmark.add('Parallel Initialization (5 components)', async () => {
    const manager = new ComponentLifecycleManager();
    
    for (let i = 0; i < 5; i++) {
      const comp = createMockComponent(`comp-${i}`, []);
      manager.register(comp);
    }
    
    await manager.initializeAll();
  });
  
  const results = await benchmark.run();
  
  // 分析结果
  console.log('\n=== LifecycleManager Performance Analysis ===\n');
  results.forEach(result => {
    console.log(`${result.name}:`);
    console.log(`  - Throughput: ${result.opsPerSecond.toFixed(0)} ops/sec`);
    console.log(`  - Mean Time: ${result.meanTime.toFixed(3)} ms`);
    console.log(`  - Std Dev: ±${result.standardDeviation.toFixed(3)} ms\n`);
  });
  
  // 性能目标验证
  const initResult = results.find(r => r.name.includes('Simple Dependencies'));
  if (initResult) {
    const targetTime = 200; // 目标: <200ms
    if (initResult.meanTime < targetTime) {
      console.log(`✅ Component initialization meets target (<${targetTime}ms): ${initResult.meanTime.toFixed(2)}ms`);
    } else {
      console.warn(`⚠️  Component initialization exceeds target: ${initResult.meanTime.toFixed(2)}ms > ${targetTime}ms`);
    }
  }
}

// ============================================================================
// 内存使用测试
// ============================================================================

export async function benchmarkMemoryUsage(): Promise<void> {
  console.log('\n=== Memory Usage Benchmark ===\n');
  
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const eventBus = ComponentEventBus.getInstance();
    
    // 初始内存
    const baseline = process.memoryUsage();
    console.log('Baseline memory usage:');
    console.log(`  - Heap Used: ${(baseline.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Heap Total: ${(baseline.heapTotal / 1024 / 1024).toFixed(2)} MB\n`);
    
    // 创建大量订阅
    const subscriptions: any[] = [];
    const channelCount = 100;
    const subscribersPerChannel = 10;
    
    for (let c = 0; c < channelCount; c++) {
      const channel = `channel-${c}`;
      for (let s = 0; s < subscribersPerChannel; s++) {
        subscriptions.push(eventBus.subscribe(channel, () => {}));
      }
    }
    
    // 测量内存
    const afterSubscriptions = process.memoryUsage();
    const memDiff = afterSubscriptions.heapUsed - baseline.heapUsed;
    
    console.log(`After creating ${channelCount * subscribersPerChannel} subscriptions:`);
    console.log(`  - Heap Used: ${(afterSubscriptions.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Memory Increase: ${(memDiff / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Per Subscription: ${(memDiff / (channelCount * subscribersPerChannel) / 1024).toFixed(2)} KB\n`);
    
    // 发布事件
    for (let i = 0; i < 1000; i++) {
      eventBus.publish(`channel-${i % channelCount}`, {
        type: 'test',
        source: 'benchmark',
        data: { index: i },
      });
    }
    
    const afterEvents = process.memoryUsage();
    const eventMemDiff = afterEvents.heapUsed - afterSubscriptions.heapUsed;
    
    console.log('After publishing 1000 events:');
    console.log(`  - Heap Used: ${(afterEvents.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Memory Increase: ${(eventMemDiff / 1024 / 1024).toFixed(2)} MB\n`);
    
    // 清理
    subscriptions.forEach(sub => sub.unsubscribe());
    eventBus.clearAll();
    
    // 强制垃圾回收（如果可用）
    if (global.gc) {
      global.gc();
    }
    
    const afterCleanup = process.memoryUsage();
    console.log('After cleanup:');
    console.log(`  - Heap Used: ${(afterCleanup.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Memory Recovered: ${((afterEvents.heapUsed - afterCleanup.heapUsed) / 1024 / 1024).toFixed(2)} MB\n`);
    
    // 性能目标验证
    const targetMemory = 50; // 目标: <50MB
    const totalMemory = (afterEvents.heapUsed - baseline.heapUsed) / 1024 / 1024;
    
    if (totalMemory < targetMemory) {
      console.log(`✅ Memory usage meets target (<${targetMemory}MB): ${totalMemory.toFixed(2)}MB`);
    } else {
      console.warn(`⚠️  Memory usage exceeds target: ${totalMemory.toFixed(2)}MB > ${targetMemory}MB`);
    }
  } else {
    console.log('Memory profiling not available in this environment');
  }
}

// ============================================================================
// 并发性能测试
// ============================================================================

export async function benchmarkConcurrency(): Promise<void> {
  console.log('\n=== Concurrency Performance Benchmark ===\n');
  
  const eventBus = ComponentEventBus.getInstance();
  const channel = 'concurrent-channel';
  
  // 设置响应者
  eventBus.subscribe(channel, (event: ComponentEvent) => {
    if (event.type === 'request') {
      // 模拟异步处理
      setTimeout(() => {
        eventBus.respond(event, { result: 'ok' });
      }, 1);
    }
  });
  
  // 测试不同并发级别
  const concurrencyLevels = [1, 10, 50, 100];
  
  for (const level of concurrencyLevels) {
    const startTime = Date.now();
    
    const requests = Array.from({ length: level }, (_, i) => 
      eventBus.request(channel, {
        type: 'request',
        source: 'benchmark',
        data: { index: i },
      })
    );
    
    await Promise.all(requests);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    const throughput = level / (duration / 1000);
    
    console.log(`Concurrency Level: ${level}`);
    console.log(`  - Total Time: ${duration}ms`);
    console.log(`  - Throughput: ${throughput.toFixed(0)} requests/sec`);
    console.log(`  - Avg Latency: ${(duration / level).toFixed(2)}ms per request\n`);
  }
}

// ============================================================================
// 运行所有基准测试
// ============================================================================

export async function runAllBenchmarks(): Promise<void> {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║     YYC³ AI Components System Performance Benchmarks      ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  try {
    await benchmarkEventBus();
    await benchmarkLifecycleManager();
    await benchmarkMemoryUsage();
    await benchmarkConcurrency();
    
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    Benchmarks Complete!                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('Benchmark failed:', error);
    throw error;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runAllBenchmarks().catch(console.error);
}
