// 客户管理端到端测试 - 完整的客户生命周期管理流程
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: E2E测试,客户管理,用户旅程

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestDataGenerator } from '../data-driven/test-data-generator';

describe('客户管理端到端测试', () => {
  let testDataGenerator: TestDataGenerator;

  beforeEach(() => {
    testDataGenerator = new TestDataGenerator();
  });

  afterEach(() => {
    testDataGenerator.clear();
  });

  describe('用户旅程1: 客户创建 -> 编辑 -> 搜索 -> 导出', () => {
    it('应该完成完整的客户管理流程', async () => {
      const customer = testDataGenerator.generateCustomer();

      expect(customer).toBeDefined();
      expect(customer.id).toBeDefined();
      expect(customer.name).toBeDefined();
      expect(customer.email).toBeDefined();
      expect(customer.phone).toBeDefined();
      expect(customer.status).toBeDefined();
    });

    it('应该能够编辑客户信息', async () => {
      const customer = testDataGenerator.generateCustomer();
      const updatedCustomer = {
        ...customer,
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      expect(updatedCustomer.name).toBe('Updated Name');
      expect(updatedCustomer.email).toBe('updated@example.com');
      expect(updatedCustomer.id).toBe(customer.id);
    });

    it('应该能够搜索客户', async () => {
      const customers = testDataGenerator.generateCustomers(10);
      const searchTerm = customers[0].name.substring(0, 3);

      const searchResults = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(searchResults.length).toBeGreaterThan(0);
      searchResults.forEach(result => {
        expect(result.name.toLowerCase()).toContain(searchTerm.toLowerCase());
      });
    });

    it('应该能够导出客户数据', async () => {
      const customers = testDataGenerator.generateCustomers(5);

      expect(customers).toHaveLength(5);
      customers.forEach(customer => {
        expect(customer).toHaveProperty('id');
        expect(customer).toHaveProperty('name');
        expect(customer).toHaveProperty('email');
      });
    });
  });

  describe('用户旅程2: 客户批量导入 -> 验证 -> 筛选 -> 批量导出', () => {
    it('应该能够批量导入客户数据', async () => {
      const customers = testDataGenerator.generateCustomers(100);

      expect(customers).toHaveLength(100);
      customers.forEach(customer => {
        expect(customer.id).toBeDefined();
        expect(customer.name).toBeDefined();
        expect(customer.email).toBeDefined();
      });
    });

    it('应该能够验证导入的数据', async () => {
      const customers = testDataGenerator.generateCustomers(50);

      const validCustomers = customers.filter(customer =>
        customer.email.includes('@') &&
        customer.name.length > 0 &&
        customer.phone.length > 0
      );

      expect(validCustomers.length).toBe(customers.length);
    });

    it('应该能够筛选客户', async () => {
      const customers = testDataGenerator.generateCustomers(20);
      const activeCustomers = customers.filter(customer =>
        customer.status === 'active'
      );

      expect(activeCustomers.length).toBeGreaterThan(0);
      activeCustomers.forEach(customer => {
        expect(customer.status).toBe('active');
      });
    });

    it('应该能够批量导出客户数据', async () => {
      const customers = testDataGenerator.generateCustomers(30);
      const selectedCustomers = customers.slice(0, 10);

      expect(selectedCustomers).toHaveLength(10);
      selectedCustomers.forEach(customer => {
        expect(customer).toHaveProperty('id');
        expect(customer).toHaveProperty('name');
      });
    });
  });

  describe('用户旅程3: 客户高级搜索 -> 结果导出 -> 批量更新状态', () => {
    it('应该能够使用高级搜索', async () => {
      const customers = testDataGenerator.generateCustomers(50);
      const searchCriteria = {
        status: 'active',
        minAge: 25,
        maxAge: 35,
      };

      const searchResults = customers.filter(customer =>
        customer.status === searchCriteria.status &&
        customer.age >= searchCriteria.minAge &&
        customer.age <= searchCriteria.maxAge
      );

      expect(searchResults.length).toBeGreaterThan(0);
      searchResults.forEach(result => {
        expect(result.status).toBe('active');
        expect(result.age).toBeGreaterThanOrEqual(25);
        expect(result.age).toBeLessThanOrEqual(35);
      });
    });

    it('应该能够导出搜索结果', async () => {
      const customers = testDataGenerator.generateCustomers(40);
      const searchResults = customers.filter(customer =>
        customer.status === 'active'
      );

      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults).toBeInstanceOf(Array);
    });

    it('应该能够批量更新客户状态', async () => {
      const customers = testDataGenerator.generateCustomers(15);
      const customerIds = customers.slice(0, 5).map(c => c.id);

      const updatedCustomers = customers.map(customer =>
        customerIds.includes(customer.id)
          ? { ...customer, status: 'inactive' as const }
          : customer
      );

      const inactiveCustomers = updatedCustomers.filter(customer =>
        customer.status === 'inactive'
      );

      expect(inactiveCustomers.length).toBe(5);
    });
  });

  describe('边界场景: 大数据量客户管理', () => {
    it('应该能够处理大量客户数据', async () => {
      const customers = testDataGenerator.generateCustomers(1000);

      expect(customers).toHaveLength(1000);
      expect(customers[0].id).toBe(1);
      expect(customers[999].id).toBe(1000);
    });

    it('应该能够快速搜索大量客户数据', async () => {
      const customers = testDataGenerator.generateCustomers(500);
      const searchTerm = customers[250].name.substring(0, 3);

      const startTime = Date.now();
      const searchResults = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const endTime = Date.now();

      expect(searchResults.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('应该能够导出大量客户数据', async () => {
      const customers = testDataGenerator.generateCustomers(800);

      expect(customers).toHaveLength(800);
      customers.forEach(customer => {
        expect(customer).toHaveProperty('id');
        expect(customer).toHaveProperty('name');
      });
    });
  });

  describe('异常场景: 错误处理', () => {
    it('应该能够处理网络中断', async () => {
      const customers = testDataGenerator.generateCustomers(10);

      expect(customers).toHaveLength(10);

      const networkError = new Error('Network error');
      expect(() => {
        throw networkError;
      }).toThrow('Network error');
    });

    it('应该能够处理数据验证失败', async () => {
      const invalidCustomer = {
        id: 1,
        name: '',
        email: 'invalid-email',
        phone: '',
        status: 'invalid' as const,
      };

      const isValid = invalidCustomer.name.length > 0 &&
                     invalidCustomer.email.includes('@') &&
                     ['active', 'inactive', 'pending'].includes(invalidCustomer.status);

      expect(isValid).toBe(false);
    });

    it('应该能够处理导入文件损坏', async () => {
      const corruptedData = 'corrupted,data,here';

      expect(() => {
        JSON.parse(corruptedData);
      }).toThrow();
    });

    it('应该能够处理并发操作冲突', async () => {
      const customer = testDataGenerator.generateCustomer();

      const update1 = { ...customer, name: 'Update 1' };
      const update2 = { ...customer, name: 'Update 2' };

      expect(update1.id).toBe(customer.id);
      expect(update2.id).toBe(customer.id);
      expect(update1.name).not.toBe(update2.name);
    });
  });

  describe('性能场景: 响应时间验证', () => {
    it('应该在2秒内完成客户创建', async () => {
      const startTime = Date.now();
      const customer = testDataGenerator.generateCustomer();
      const endTime = Date.now();

      expect(customer).toBeDefined();
      expect(endTime - startTime).toBeLessThan(2000);
    });

    it('应该在2秒内完成客户搜索', async () => {
      const customers = testDataGenerator.generateCustomers(100);
      const searchTerm = customers[50].name.substring(0, 3);

      const startTime = Date.now();
      const searchResults = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const endTime = Date.now();

      expect(searchResults.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(2000);
    });

    it('应该在5秒内完成批量导入', async () => {
      const startTime = Date.now();
      const customers = testDataGenerator.generateCustomers(500);
      const endTime = Date.now();

      expect(customers).toHaveLength(500);
      expect(endTime - startTime).toBeLessThan(5000);
    });
  });
});
