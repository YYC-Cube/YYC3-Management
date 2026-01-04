/**
 * API Signature Verification
 * API签名验证
 *
 * 使用HMAC-SHA256进行API请求签名验证
 */

import { createHmac, timingSafeEqual } from 'crypto';

/**
 * 签名配置
 */
interface SignatureConfig {
  algorithm?: string;        // 哈希算法
  timestampHeader?: string;  // 时间戳请求头
  signatureHeader?: string;  // 签名请求头
  apiKeyHeader?: string;     // API密钥请求头
  toleranceMs?: number;      // 时间戳容差 (毫秒)
}

const DEFAULT_CONFIG: Required<SignatureConfig> = {
  algorithm: 'sha256',
  timestampHeader: 'x-timestamp',
  signatureHeader: 'x-signature',
  apiKeyHeader: 'x-api-key',
  toleranceMs: 5 * 60 * 1000, // 5分钟
};

/**
 * API密钥存储接口
 */
interface APIKey {
  key: string;
  secret: string;
  userId: string;
  name: string;
  scopes: string[];
  isActive: boolean;
  createdAt: number;
  expiresAt?: number;
}

interface APIKeyStore {
  findByKey(key: string): Promise<APIKey | null>;
  findByUserId(userId: string): Promise<APIKey[]>;
  create(keyData: Omit<APIKey, 'key' | 'createdAt'>): Promise<APIKey>;
  revoke(key: string): Promise<void>;
}

/**
 * 内存API密钥存储 (开发环境)
 */
class MemoryAPIKeyStore implements APIKeyStore {
  private keys: Map<string, APIKey> = new Map();

  async findByKey(key: string): Promise<APIKey | null> {
    return this.keys.get(key) || null;
  }

  async findByUserId(userId: string): Promise<APIKey[]> {
    return Array.from(this.keys.values()).filter(k => k.userId === userId);
  }

  async create(keyData: Omit<APIKey, 'key' | 'createdAt'>): Promise<APIKey> {
    const key = `ak_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const secret = `sk_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

    const apiKey: APIKey = {
      ...keyData,
      key,
      secret,
      createdAt: Date.now(),
    };

    this.keys.set(key, apiKey);
    return apiKey;
  }

  async revoke(key: string): Promise<void> {
    const apiKey = this.keys.get(key);
    if (apiKey) {
      apiKey.isActive = false;
    }
  }
}

/**
 * 生成API签名
 */
export function generateSignature(
  method: string,
  path: string,
  query: string,
  body: string,
  timestamp: string,
  secretKey: string,
  algorithm: string = DEFAULT_CONFIG.algorithm
): string {
  // 构建签名payload
  const payload = `${method.toUpperCase()}\n${path}\n${query}\n${body}\n${timestamp}`;

  // 使用HMAC生成签名
  return createHmac(algorithm, secretKey)
    .update(payload)
    .digest('hex');
}

/**
 * 验证API签名 (使用timing-safe比较)
 */
export function verifySignature(
  expectedSignature: string,
  actualSignature: string
): boolean {
  // 长度不同直接返回false
  if (expectedSignature.length !== actualSignature.length) {
    return false;
  }

  try {
    return timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(actualSignature)
    );
  } catch {
    return false;
  }
}

/**
 * API签名验证器
 */
export class APISignatureVerifier {
  private config: Required<SignatureConfig>;
  private apiKeyStore: APIKeyStore;

  constructor(
    config: SignatureConfig = {},
    apiKeyStore?: APIKeyStore
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.apiKeyStore = apiKeyStore || new MemoryAPIKeyStore();
  }

  /**
   * 验证请求签名
   */
  async verifyRequest(req: Request): Promise<{
    valid: boolean;
    apiKey?: APIKey;
    error?: string;
    code?: string;
  }> {
    // 1. 获取必需的请求头
    const signature = req.headers.get(this.config.signatureHeader);
    const timestamp = req.headers.get(this.config.timestampHeader);
    const apiKey = req.headers.get(this.config.apiKeyHeader);

    if (!signature || !timestamp || !apiKey) {
      return {
        valid: false,
        error: 'Missing required headers: x-signature, x-timestamp, or x-api-key',
        code: 'SIGNATURE_MISSING',
      };
    }

    // 2. 查找API密钥
    const keyData = await this.apiKeyStore.findByKey(apiKey);

    if (!keyData) {
      return {
        valid: false,
        error: 'Invalid API key',
        code: 'API_KEY_INVALID',
      };
    }

    // 3. 检查密钥是否激活
    if (!keyData.isActive) {
      return {
        valid: false,
        error: 'API key has been revoked',
        code: 'API_KEY_REVOKED',
      };
    }

    // 4. 检查密钥是否过期
    if (keyData.expiresAt && keyData.expiresAt < Date.now()) {
      return {
        valid: false,
        error: 'API key has expired',
        code: 'API_KEY_EXPIRED',
      };
    }

    // 5. 验证时间戳
    const requestTime = parseInt(timestamp, 10);
    const now = Date.now();

    if (isNaN(requestTime)) {
      return {
        valid: false,
        error: 'Invalid timestamp format',
        code: 'TIMESTAMP_INVALID',
      };
    }

    if (Math.abs(now - requestTime) > this.config.toleranceMs) {
      return {
        valid: false,
        error: `Request timestamp expired. Tolerance: ${this.config.toleranceMs}ms`,
        code: 'TIMESTAMP_EXPIRED',
      };
    }

    // 6. 生成期望的签名
    const url = new URL(req.url);
    const query = url.search.substring(1); // 移除'?'
    const body = await req.text();
    const expectedSignature = generateSignature(
      req.method,
      url.pathname,
      query,
      body,
      timestamp,
      keyData.secret,
      this.config.algorithm
    );

    // 7. 验证签名
    const isValid = verifySignature(expectedSignature, signature);

    if (!isValid) {
      return {
        valid: false,
        error: 'Invalid signature',
        code: 'SIGNATURE_INVALID',
      };
    }

    return {
      valid: true,
      apiKey: keyData,
    };
  }

  /**
   * 创建API密钥
   */
  async createAPIKey(params: {
    userId: string;
    name: string;
    scopes: string[];
    expiresIn?: number;
  }): Promise<{ key: string; secret: string }> {
    const keyData = await this.apiKeyStore.create({
      userId: params.userId,
      name: params.name,
      scopes: params.scopes,
      isActive: true,
      expiresAt: params.expiresIn ? Date.now() + params.expiresIn : undefined,
    });

    return {
      key: keyData.key,
      secret: keyData.secret,
    };
  }

  /**
   * 撤销API密钥
   */
  async revokeAPIKey(key: string): Promise<void> {
    await this.apiKeyStore.revoke(key);
  }

  /**
   * 获取用户的API密钥
   */
  async getUserAPIKeys(userId: string): Promise<APIKey[]> {
    return this.apiKeyStore.findByUserId(userId);
  }
}

/**
 * 默认签名验证器实例
 */
export const signatureVerifier = new APISignatureVerifier();

/**
 * 客户端签名生成器
 */
export class ClientSignatureGenerator {
  constructor(
    private apiKey: string,
    private apiSecret: string
  ) {}

  /**
   * 为请求生成签名
   */
  async signRequest(req: {
    method: string;
    url: string;
    body?: any;
  }): Promise<{
    'x-api-key': string;
    'x-timestamp': string;
    'x-signature': string;
  }> {
    const url = new URL(req.url);
    const query = url.search.substring(1);
    const body = req.body ? JSON.stringify(req.body) : '';
    const timestamp = Date.now().toString();

    const signature = generateSignature(
      req.method,
      url.pathname,
      query,
      body,
      timestamp,
      this.apiSecret
    );

    return {
      'x-api-key': this.apiKey,
      'x-timestamp': timestamp,
      'x-signature': signature,
    };
  }

  /**
   * 创建已签名的请求
   */
  async createSignedRequest(req: {
    method: string;
    url: string;
    body?: any;
    headers?: Record<string, string>;
  }): Promise<Request> {
    const signatureHeaders = await this.signRequest(req);

    return new Request(req.url, {
      method: req.method,
      headers: {
        ...req.headers,
        ...signatureHeaders,
        'Content-Type': 'application/json',
      },
      body: req.body ? JSON.stringify(req.body) : undefined,
    });
  }
}

/**
 * 辅助函数：验证API密钥格式
 */
export function validateAPIKeyFormat(key: string): boolean {
  return /^ak_\d+_[a-z0-9]+$/i.test(key);
}

/**
 * 辅助函数：验证API密钥格式
 */
export function validateAPISecretFormat(secret: string): boolean {
  return /^sk_\d+_[a-z0-9]+$/i.test(secret);
}

/**
 * 生成签名错误响应
 */
export function createSignatureErrorResponse(error: string, code: string): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code,
        message: error,
      },
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Next.js中间件辅助函数
 */
export async function withAPISignature(
  req: Request,
  verifier: APISignatureVerifier = signatureVerifier
): Promise<{
  valid: boolean;
  apiKey?: APIKey;
  error?: string;
  code?: string;
}> {
  return verifier.verifyRequest(req);
}
