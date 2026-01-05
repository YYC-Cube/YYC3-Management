/**
 * API Signature Verification Tests
 * API签名验证测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateSignature,
  verifySignature,
  APISignatureVerifier,
  signatureVerifier,
  ClientSignatureGenerator,
  validateAPIKeyFormat,
  validateAPISecretFormat,
  createSignatureErrorResponse,
  withAPISignature,
} from './signature';

describe('签名生成', () => {
  const secretKey = 'test-secret-key-12345';

  it('应该生成一致的签名', () => {
    const signature1 = generateSignature('GET', '/api/test', '', 'body123', '1234567890', secretKey);
    const signature2 = generateSignature('GET', '/api/test', '', 'body123', '1234567890', secretKey);

    expect(signature1).toBe(signature2);
  });

  it('应该为不同参数生成不同签名', () => {
    const signature1 = generateSignature('GET', '/api/test', '', 'body1', '1234567890', secretKey);
    const signature2 = generateSignature('GET', '/api/test', '', 'body2', '1234567890', secretKey);

    expect(signature1).not.toBe(signature2);
  });

  it('应该考虑所有参数', () => {
    const baseSignature = generateSignature('GET', '/api/test', '', 'body', '1234567890', secretKey);

    // 不同方法
    expect(baseSignature).not.toBe(generateSignature('POST', '/api/test', '', 'body', '1234567890', secretKey));

    // 不同路径
    expect(baseSignature).not.toBe(generateSignature('GET', '/api/other', '', 'body', '1234567890', secretKey));

    // 不同查询
    expect(baseSignature).not.toBe(generateSignature('GET', '/api/test', 'query=value', 'body', '1234567890', secretKey));

    // 不同请求体
    expect(baseSignature).not.toBe(generateSignature('GET', '/api/test', '', 'different', '1234567890', secretKey));

    // 不同时间戳
    expect(baseSignature).not.toBe(generateSignature('GET', '/api/test', '', 'body', '0987654321', secretKey));

    // 不同密钥
    expect(baseSignature).not.toBe(generateSignature('GET', '/api/test', '', 'body', '1234567890', 'different-key'));
  });

  it('应该处理空参数', () => {
    const signature = generateSignature('GET', '/', '', '', '1234567890', secretKey);

    expect(signature).toBeDefined();
    expect(signature.length).toBe(64); // SHA256 hex length
  });

  it('应该处理特殊字符', () => {
    const specialBody = JSON.stringify({ test: '数据', value: '@#$%' });
    const signature = generateSignature('POST', '/api/test', '', specialBody, '1234567890', secretKey);

    expect(signature).toBeDefined();
    expect(signature.length).toBe(64);
  });
});

describe('签名验证', () => {
  const secretKey = 'test-secret-key';

  it('应该验证正确的签名', () => {
    const signature = generateSignature('GET', '/api/test', '', 'body', '1234567890', secretKey);

    const isValid = verifySignature(signature, signature);
    expect(isValid).toBe(true);
  });

  it('应该拒绝错误的签名', () => {
    const correctSignature = generateSignature('GET', '/api/test', '', 'body', '1234567890', secretKey);
    const wrongSignature = generateSignature('POST', '/api/test', '', 'body', '1234567890', secretKey);

    const isValid = verifySignature(correctSignature, wrongSignature);
    expect(isValid).toBe(false);
  });

  it('应该拒绝不同长度的签名', () => {
    const signature = generateSignature('GET', '/api/test', '', 'body', '1234567890', secretKey);
    const shortSignature = signature.substring(0, 32);

    const isValid = verifySignature(signature, shortSignature);
    expect(isValid).toBe(false);
  });
});

describe('APISignatureVerifier', () => {
  let verifier: APISignatureVerifier;
  let testAPIKey: { key: string; secret: string };

  beforeEach(async () => {
    verifier = new APISignatureVerifier();
    testAPIKey = await verifier.createAPIKey({
      userId: 'user123',
      name: 'Test API Key',
      scopes: ['read', 'write'],
    });
  });

  describe('API密钥管理', () => {
    it('应该创建API密钥', async () => {
      const { key, secret } = await verifier.createAPIKey({
        userId: 'user456',
        name: 'Production Key',
        scopes: ['read'],
      });

      expect(key).toBeDefined();
      expect(secret).toBeDefined();
      expect(key).toMatch(/^ak_\d+_[a-z0-9]+$/i);
      expect(secret).toMatch(/^sk_\d+_[a-z0-9]+$/i);
    });

    it('应该创建有过期时间的API密钥', async () => {
      const keyData = await verifier.createAPIKey({
        userId: 'user789',
        name: 'Temporary Key',
        scopes: ['read'],
        expiresIn: 3600000, // 1小时
      });

      const apiKeys = await verifier.getUserAPIKeys('user789');
      expect(apiKeys).toHaveLength(1);
      expect(apiKeys[0].expiresAt).toBeDefined();
      expect(apiKeys[0].expiresAt).toBeGreaterThan(Date.now());
    });

    it('应该撤销API密钥', async () => {
      const { key } = testAPIKey;

      await verifier.revokeAPIKey(key);

      const apiKeys = await verifier.getUserAPIKeys('user123');
      expect(apiKeys[0].isActive).toBe(false);
    });

    it('应该获取用户的API密钥', async () => {
      await verifier.createAPIKey({
        userId: 'user123',
        name: 'Second Key',
        scopes: ['admin'],
      });

      const apiKeys = await verifier.getUserAPIKeys('user123');
      expect(apiKeys.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('请求验证', () => {
    it('应该验证带有正确签名的请求', async () => {
      const timestamp = Date.now().toString();
      const url = `http://example.com/api/test?param=value`;
      const body = JSON.stringify({ test: 'data' });

      const signature = generateSignature(
        'POST',
        '/api/test',
        'param=value',
        body,
        timestamp,
        testAPIKey.secret
      );

      const request = new Request(url, {
        method: 'POST',
        headers: {
          'x-signature': signature,
          'x-timestamp': timestamp,
          'x-api-key': testAPIKey.key,
        },
        body,
      });

      const result = await verifier.verifyRequest(request);

      expect(result.valid).toBe(true);
      expect(result.apiKey).toBeDefined();
      expect(result.apiKey?.userId).toBe('user123');
    });

    it('应该拒绝缺少签名头的请求', async () => {
      const request = new Request('http://example.com/api/test');

      const result = await verifier.verifyRequest(request);

      expect(result.valid).toBe(false);
      expect(result.code).toBe('SIGNATURE_MISSING');
    });

    it('应该拒绝无效的API密钥', async () => {
      const timestamp = Date.now().toString();
      const signature = 'some-signature';

      const request = new Request('http://example.com/api/test', {
        headers: {
          'x-signature': signature,
          'x-timestamp': timestamp,
          'x-api-key': 'invalid-api-key',
        },
      });

      const result = await verifier.verifyRequest(request);

      expect(result.valid).toBe(false);
      expect(result.code).toBe('API_KEY_INVALID');
    });

    it('应该拒绝已撤销的API密钥', async () => {
      await verifier.revokeAPIKey(testAPIKey.key);

      const timestamp = Date.now().toString();
      const signature = generateSignature('GET', '/api/test', '', '', timestamp, testAPIKey.secret);

      const request = new Request('http://example.com/api/test', {
        headers: {
          'x-signature': signature,
          'x-timestamp': timestamp,
          'x-api-key': testAPIKey.key,
        },
      });

      const result = await verifier.verifyRequest(request);

      expect(result.valid).toBe(false);
      expect(result.code).toBe('API_KEY_REVOKED');
    });

    it('应该拒绝过期的API密钥', async () => {
      const { key, secret } = await verifier.createAPIKey({
        userId: 'user-expired',
        name: 'Expired Key',
        scopes: ['read'],
        expiresIn: -1000, // 已过期
      });

      const timestamp = Date.now().toString();
      const signature = generateSignature('GET', '/api/test', '', '', timestamp, secret);

      const request = new Request('http://example.com/api/test', {
        headers: {
          'x-signature': signature,
          'x-timestamp': timestamp,
          'x-api-key': key,
        },
      });

      const result = await verifier.verifyRequest(request);

      expect(result.valid).toBe(false);
      expect(result.code).toBe('API_KEY_EXPIRED');
    });

    it('应该拒绝过期的时间戳', async () => {
      const oldTimestamp = (Date.now() - 10 * 60 * 1000 - 1000).toString(); // 超过5分钟
      const signature = generateSignature('GET', '/api/test', '', '', oldTimestamp, testAPIKey.secret);

      const request = new Request('http://example.com/api/test', {
        headers: {
          'x-signature': signature,
          'x-timestamp': oldTimestamp,
          'x-api-key': testAPIKey.key,
        },
      });

      const result = await verifier.verifyRequest(request);

      expect(result.valid).toBe(false);
      expect(result.code).toBe('TIMESTAMP_EXPIRED');
    });

    it('应该拒绝无效的时间戳格式', async () => {
      const invalidTimestamp = 'not-a-number';
      const signature = 'some-signature';

      const request = new Request('http://example.com/api/test', {
        headers: {
          'x-signature': signature,
          'x-timestamp': invalidTimestamp,
          'x-api-key': testAPIKey.key,
        },
      });

      const result = await verifier.verifyRequest(request);

      expect(result.valid).toBe(false);
      expect(result.code).toBe('TIMESTAMP_INVALID');
    });

    it('应该拒绝错误的签名', async () => {
      const timestamp = Date.now().toString();
      const wrongSignature = 'wrong-signature-value';

      const request = new Request('http://example.com/api/test', {
        headers: {
          'x-signature': wrongSignature,
          'x-timestamp': timestamp,
          'x-api-key': testAPIKey.key,
        },
      });

      const result = await verifier.verifyRequest(request);

      expect(result.valid).toBe(false);
      expect(result.code).toBe('SIGNATURE_INVALID');
    });

    it('应该处理带有查询参数的请求', async () => {
      const timestamp = Date.now().toString();
      const query = 'param1=value1&param2=value2';
      const signature = generateSignature('GET', '/api/test', query, '', timestamp, testAPIKey.secret);

      const request = new Request(`http://example.com/api/test?${query}`, {
        headers: {
          'x-signature': signature,
          'x-timestamp': timestamp,
          'x-api-key': testAPIKey.key,
        },
      });

      const result = await verifier.verifyRequest(request);

      expect(result.valid).toBe(true);
    });

    it('应该处理带有请求体的请求', async () => {
      const timestamp = Date.now().toString();
      const body = JSON.stringify({ key: 'value', nested: { data: 'test' } });
      const signature = generateSignature('POST', '/api/test', '', body, timestamp, testAPIKey.secret);

      const request = new Request('http://example.com/api/test', {
        method: 'POST',
        headers: {
          'x-signature': signature,
          'x-timestamp': timestamp,
          'x-api-key': testAPIKey.key,
        },
        body,
      });

      const result = await verifier.verifyRequest(request);

      expect(result.valid).toBe(true);
    });
  });
});

describe('ClientSignatureGenerator', () => {
  let generator: ClientSignatureGenerator;
  let testAPIKey: { key: string; secret: string };

  beforeEach(async () => {
    const verifier = new APISignatureVerifier();
    testAPIKey = await verifier.createAPIKey({
      userId: 'client-user',
      name: 'Client Key',
      scopes: ['read', 'write'],
    });

    generator = new ClientSignatureGenerator(testAPIKey.key, testAPIKey.secret);
  });

  it('应该为请求生成签名头', async () => {
    const headers = await generator.signRequest({
      method: 'POST',
      url: 'http://example.com/api/test',
      body: { test: 'data' },
    });

    expect(headers['x-api-key']).toBe(testAPIKey.key);
    expect(headers['x-timestamp']).toBeDefined();
    expect(headers['x-signature']).toBeDefined();
    expect(headers['x-signature'].length).toBe(64);
  });

  it('应该创建签名请求', async () => {
    const request = await generator.createSignedRequest({
      method: 'POST',
      url: 'http://example.com/api/test',
      body: { test: 'data' },
      headers: {
        'x-custom-header': 'custom-value',
      },
    });

    expect(request.headers.get('x-api-key')).toBe(testAPIKey.key);
    expect(request.headers.get('x-timestamp')).toBeDefined();
    expect(request.headers.get('x-signature')).toBeDefined();
    expect(request.headers.get('Content-Type')).toBe('application/json');
    expect(request.headers.get('x-custom-header')).toBe('custom-value');
  });

  it('应该处理GET请求', async () => {
    const headers = await generator.signRequest({
      method: 'GET',
      url: 'http://example.com/api/test',
    });

    expect(headers['x-api-key']).toBeDefined();
    expect(headers['x-timestamp']).toBeDefined();
    expect(headers['x-signature']).toBeDefined();
  });
});

describe('验证辅助函数', () => {
  describe('validateAPIKeyFormat', () => {
    it('应该验证有效的API密钥格式', () => {
      expect(validateAPIKeyFormat('ak_1234567890_abc123')).toBe(true);
      expect(validateAPIKeyFormat('AK_1_ABC')).toBe(true);
    });

    it('应该拒绝无效的API密钥格式', () => {
      expect(validateAPIKeyFormat('invalid')).toBe(false);
      expect(validateAPIKeyFormat('sk_1234567890_abc123')).toBe(false); // 以sk开头
      expect(validateAPIKeyFormat('ak_1234567890')).toBe(false); // 缺少后缀
    });
  });

  describe('validateAPISecretFormat', () => {
    it('应该验证有效的API密钥格式', () => {
      expect(validateAPISecretFormat('sk_1234567890_abc123def456')).toBe(true);
      expect(validateAPISecretFormat('SK_1_ABC')).toBe(true);
    });

    it('应该拒绝无效的API密钥格式', () => {
      expect(validateAPISecretFormat('invalid')).toBe(false);
      expect(validateAPISecretFormat('ak_1234567890_abc123')).toBe(false); // 以ak开头
      expect(validateAPISecretFormat('sk_1234567890')).toBe(false); // 缺少后缀
    });
  });
});

describe('错误响应', () => {
  it('应该创建正确的签名错误响应', () => {
    const response = createSignatureErrorResponse('Invalid signature', 'SIGNATURE_INVALID');

    expect(response.status).toBe(401);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    return response.json().then((body) => {
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('SIGNATURE_INVALID');
      expect(body.error.message).toBe('Invalid signature');
    });
  });
});

describe('withAPISignature辅助函数', () => {
  it('应该验证请求签名', async () => {
    const verifier = new APISignatureVerifier();
    const { key, secret } = await verifier.createAPIKey({
      userId: 'test-user',
      name: 'Test Key',
      scopes: ['read'],
    });

    const timestamp = Date.now().toString();
    const signature = generateSignature('GET', '/api/test', '', '', timestamp, secret);

    const request = new Request('http://example.com/api/test', {
      headers: {
        'x-signature': signature,
        'x-timestamp': timestamp,
        'x-api-key': key,
      },
    });

    const result = await withAPISignature(request, verifier);

    expect(result.valid).toBe(true);
    expect(result.apiKey).toBeDefined();
  });
});
