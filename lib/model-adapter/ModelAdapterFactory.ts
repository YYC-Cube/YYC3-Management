/**
 * @fileoverview 模型适配器工厂
 * @description 统一管理和创建各类AI模型适配器
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import {
  type IModelAdapter,
  type ModelConfig
} from './ModelAdapter';
import {
  ModelProvider,
  ModelAdapterError
} from './types';
import { ZhipuAdapter } from './ZhipuAdapter';
import { LocalModelAdapter } from './LocalModelAdapter';

/**
 * 模型适配器工厂类
 */
export class ModelAdapterFactory {
  private static adapters = new Map<string, IModelAdapter>();
  
  /**
   * 创建模型适配器
   */
  static createAdapter(config: ModelConfig): IModelAdapter {
    const key = `${config.provider}-${config.modelName}`;

    // 检查缓存
    if (this.adapters.has(key)) {
      return this.adapters.get(key)!;
    }

    // 创建新适配器
    let adapter: IModelAdapter;

    switch (config.provider) {
      case 'Zhipu':
        adapter = new ZhipuAdapter(config);
        break;

      case 'Local':
        adapter = new LocalModelAdapter(config);
        break;

      case 'OpenAI':
        // TODO: 实现OpenAI兼容适配器
        throw new ModelAdapterError(
          'OpenAI adapter not implemented yet',
          ModelProvider.OPENAI,
          'NOT_IMPLEMENTED'
        );

      default:
        throw new ModelAdapterError(
          `Unsupported provider: ${config.provider}`,
          ModelProvider.CUSTOM,
          'UNSUPPORTED_PROVIDER'
        );
    }

    // 缓存适配器
    this.adapters.set(key, adapter);
    return adapter;
  }

  /**
   * 获取已创建的适配器
   */
  static getAdapter(provider: ModelProvider, modelId: string): IModelAdapter | undefined {
    const key = `${provider}-${modelId}`;
    return this.adapters.get(key);
  }

  /**
   * 清除适配器缓存
   */
  static clearCache(): void {
    this.adapters.clear();
  }

  /**
   * 清除特定适配器
   */
  static removeAdapter(provider: ModelProvider, modelId: string): boolean {
    const key = `${provider}-${modelId}`;
    return this.adapters.delete(key);
  }

  /**
   * 获取所有已缓存的适配器
   */
  static getAllAdapters(): IModelAdapter[] {
    return Array.from(this.adapters.values());
  }
}

export default ModelAdapterFactory;
