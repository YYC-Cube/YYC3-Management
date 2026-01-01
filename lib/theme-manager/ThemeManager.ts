/**
 * ThemeManager - 主题和样式管理系统
 * 
 * 提供统一的主题管理功能,支持:
 * - CSS变量管理
 * - 设计令牌(Design Tokens)
 * - 主题切换动画
 * - 系统主题检测
 * - 主题继承
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';

// ==================== 类型定义 ====================

/**
 * 主题类型
 */
export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
  CUSTOM = 'custom'
}

/**
 * 颜色值
 */
export interface ColorValue {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  alpha?: number;
}

/**
 * 设计令牌类型
 */
export enum TokenType {
  COLOR = 'color',
  SPACING = 'spacing',
  TYPOGRAPHY = 'typography',
  SHADOW = 'shadow',
  BORDER = 'border',
  ANIMATION = 'animation'
}

/**
 * 设计令牌
 */
export interface DesignToken {
  name: string;
  type: TokenType;
  value: any;
  description?: string;
  category?: string;
}

/**
 * 主题定义
 */
export interface ThemeDefinition {
  id: string;
  name: string;
  type: ThemeType;
  parent?: string;
  tokens: DesignToken[];
  cssVariables: Record<string, string>;
}

/**
 * 主题选项
 */
export interface ThemeOptions {
  /** 是否启用过渡动画 */
  enableTransition?: boolean;
  /** 过渡持续时间(毫秒) */
  transitionDuration?: number;
  /** 是否持久化主题选择 */
  persist?: boolean;
  /** 存储键名 */
  storageKey?: string;
}

/**
 * 管理器配置
 */
export interface ThemeManagerConfig {
  /** 默认主题ID */
  defaultTheme: string;
  /** 是否跟随系统主题 */
  followSystemTheme: boolean;
  /** 启用过渡动画 */
  enableTransition: boolean;
  /** 过渡持续时间 */
  transitionDuration: number;
  /** 持久化设置 */
  persist: boolean;
  /** 存储键名 */
  storageKey: string;
}

// ==================== 主类实现 ====================

/**
 * 主题管理器
 */
export class ThemeManager extends EventEmitter {
  private config: ThemeManagerConfig;
  private themes: Map<string, ThemeDefinition>;
  private currentThemeId: string | null;
  private systemThemeQuery: MediaQueryList | null;
  
  constructor(config: Partial<ThemeManagerConfig> = {}) {
    super();
    
    this.config = {
      defaultTheme: 'light',
      followSystemTheme: true,
      enableTransition: true,
      transitionDuration: 300,
      persist: true,
      storageKey: 'yyc3-theme',
      ...config
    };
    
    this.themes = new Map();
    this.currentThemeId = null;
    this.systemThemeQuery = null;
    
    this.setupSystemThemeDetection();
    this.loadPersistedTheme();
    this.registerBuiltinThemes();
  }

  // ==================== 公共API ====================

  /**
   * 注册主题
   */
  public registerTheme(theme: ThemeDefinition): void {
    // 验证主题
    if (!theme.id || !theme.name) {
      throw new Error('Theme must have id and name');
    }
    
    // 检查父主题是否存在
    if (theme.parent && !this.themes.has(theme.parent)) {
      throw new Error(`Parent theme "${theme.parent}" not found`);
    }
    
    // 编译主题(处理继承)
    const compiledTheme = this.compileTheme(theme);
    
    this.themes.set(theme.id, compiledTheme);
    this.emit('themeRegistered', { theme: compiledTheme });
  }

  /**
   * 设置当前主题
   */
  public async setTheme(themeId: string, options: ThemeOptions = {}): Promise<void> {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme "${themeId}" not found`);
    }
    
    const oldThemeId = this.currentThemeId;
    
    // 启用过渡
    const enableTransition = options.enableTransition ?? this.config.enableTransition;
    if (enableTransition) {
      this.enableThemeTransition(options.transitionDuration || this.config.transitionDuration);
    }
    
    // 应用主题
    this.applyTheme(theme);
    this.currentThemeId = themeId;
    
    // 持久化
    if (options.persist ?? this.config.persist) {
      this.persistTheme(themeId);
    }
    
    // 等待过渡完成
    if (enableTransition) {
      await this.waitForTransition(options.transitionDuration || this.config.transitionDuration);
      this.disableThemeTransition();
    }
    
    // 触发事件
    this.emit('themeChanged', { oldThemeId, newThemeId: themeId, theme });
  }

  /**
   * 获取当前主题
   */
  public getCurrentTheme(): ThemeDefinition | null {
    return this.currentThemeId ? this.themes.get(this.currentThemeId) || null : null;
  }

  /**
   * 获取所有主题
   */
  public getAllThemes(): ThemeDefinition[] {
    return Array.from(this.themes.values());
  }

  /**
   * 切换主题(在light和dark之间)
   */
  public async toggleTheme(): Promise<void> {
    const current = this.getCurrentTheme();
    if (!current) return;
    
    const newThemeId = current.type === ThemeType.LIGHT ? 'dark' : 'light';
    if (this.themes.has(newThemeId)) {
      await this.setTheme(newThemeId);
    }
  }

  /**
   * 跟随系统主题
   */
  public followSystemTheme(): void {
    if (!this.systemThemeQuery) return;
    
    const themeId = this.systemThemeQuery.matches ? 'dark' : 'light';
    this.setTheme(themeId);
  }

  /**
   * 获取CSS变量值
   */
  public getCSSVariable(name: string): string {
    const rootStyle = getComputedStyle(document.documentElement);
    return rootStyle.getPropertyValue(name).trim();
  }

  /**
   * 设置CSS变量值
   */
  public setCSSVariable(name: string, value: string): void {
    document.documentElement.style.setProperty(name, value);
    this.emit('cssVariableChanged', { name, value });
  }

  /**
   * 获取设计令牌
   */
  public getToken(name: string): DesignToken | null {
    const theme = this.getCurrentTheme();
    if (!theme) return null;
    
    return theme.tokens.find(t => t.name === name) || null;
  }

  /**
   * 按类型获取令牌
   */
  public getTokensByType(type: TokenType): DesignToken[] {
    const theme = this.getCurrentTheme();
    if (!theme) return [];
    
    return theme.tokens.filter(t => t.type === type);
  }

  /**
   * 按分类获取令牌
   */
  public getTokensByCategory(category: string): DesignToken[] {
    const theme = this.getCurrentTheme();
    if (!theme) return [];
    
    return theme.tokens.filter(t => t.category === category);
  }

  // ==================== 私有方法 ====================

  /**
   * 编译主题(处理继承)
   */
  private compileTheme(theme: ThemeDefinition): ThemeDefinition {
    if (!theme.parent) {
      return theme;
    }
    
    const parentTheme = this.themes.get(theme.parent);
    if (!parentTheme) {
      return theme;
    }
    
    // 合并令牌
    const mergedTokens = [...parentTheme.tokens];
    for (const token of theme.tokens) {
      const index = mergedTokens.findIndex(t => t.name === token.name);
      if (index >= 0) {
        mergedTokens[index] = token;
      } else {
        mergedTokens.push(token);
      }
    }
    
    // 合并CSS变量
    const mergedCSSVariables = {
      ...parentTheme.cssVariables,
      ...theme.cssVariables
    };
    
    return {
      ...theme,
      tokens: mergedTokens,
      cssVariables: mergedCSSVariables
    };
  }

  /**
   * 应用主题
   */
  private applyTheme(theme: ThemeDefinition): void {
    // 应用CSS变量
    for (const [name, value] of Object.entries(theme.cssVariables)) {
      this.setCSSVariable(name, value);
    }
    
    // 设置data属性
    document.documentElement.setAttribute('data-theme', theme.id);
    document.documentElement.setAttribute('data-theme-type', theme.type);
  }

  /**
   * 启用主题过渡
   */
  private enableThemeTransition(duration: number): void {
    document.documentElement.style.setProperty(
      '--theme-transition-duration',
      `${duration}ms`
    );
    document.documentElement.classList.add('theme-transitioning');
  }

  /**
   * 禁用主题过渡
   */
  private disableThemeTransition(): void {
    document.documentElement.classList.remove('theme-transitioning');
  }

  /**
   * 等待过渡完成
   */
  private waitForTransition(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  /**
   * 持久化主题
   */
  private persistTheme(themeId: string): void {
    try {
      localStorage.setItem(this.config.storageKey, themeId);
    } catch (error) {
      console.error('Failed to persist theme:', error);
    }
  }

  /**
   * 加载持久化的主题
   */
  private loadPersistedTheme(): void {
    if (!this.config.persist) return;
    
    try {
      const themeId = localStorage.getItem(this.config.storageKey);
      if (themeId) {
        this.currentThemeId = themeId;
      }
    } catch (error) {
      console.error('Failed to load persisted theme:', error);
    }
  }

  /**
   * 设置系统主题检测
   */
  private setupSystemThemeDetection(): void {
    if (!this.config.followSystemTheme) return;
    
    if (window.matchMedia) {
      this.systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // 监听系统主题变化
      this.systemThemeQuery.addEventListener('change', (e) => {
        const themeId = e.matches ? 'dark' : 'light';
        this.setTheme(themeId);
        this.emit('systemThemeChanged', { themeId });
      });
    }
  }

  /**
   * 注册内置主题
   */
  private registerBuiltinThemes(): void {
    // 亮色主题
    this.registerTheme({
      id: 'light',
      name: '亮色主题',
      type: ThemeType.LIGHT,
      tokens: [
        { name: 'color-primary', type: TokenType.COLOR, value: '#0066cc', category: 'colors' },
        { name: 'color-background', type: TokenType.COLOR, value: '#ffffff', category: 'colors' },
        { name: 'color-text', type: TokenType.COLOR, value: '#333333', category: 'colors' },
        { name: 'color-border', type: TokenType.COLOR, value: '#e0e0e0', category: 'colors' },
        { name: 'spacing-xs', type: TokenType.SPACING, value: '4px', category: 'spacing' },
        { name: 'spacing-sm', type: TokenType.SPACING, value: '8px', category: 'spacing' },
        { name: 'spacing-md', type: TokenType.SPACING, value: '16px', category: 'spacing' },
        { name: 'spacing-lg', type: TokenType.SPACING, value: '24px', category: 'spacing' },
        { name: 'spacing-xl', type: TokenType.SPACING, value: '32px', category: 'spacing' }
      ],
      cssVariables: {
        '--color-primary': '#0066cc',
        '--color-primary-hover': '#0052a3',
        '--color-background': '#ffffff',
        '--color-surface': '#f5f5f5',
        '--color-text': '#333333',
        '--color-text-secondary': '#666666',
        '--color-border': '#e0e0e0',
        '--color-shadow': 'rgba(0, 0, 0, 0.1)',
        '--spacing-xs': '4px',
        '--spacing-sm': '8px',
        '--spacing-md': '16px',
        '--spacing-lg': '24px',
        '--spacing-xl': '32px',
        '--border-radius': '4px',
        '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '--font-size-sm': '12px',
        '--font-size-md': '14px',
        '--font-size-lg': '16px',
        '--shadow-sm': '0 1px 2px var(--color-shadow)',
        '--shadow-md': '0 2px 4px var(--color-shadow)',
        '--shadow-lg': '0 4px 8px var(--color-shadow)'
      }
    });
    
    // 暗色主题
    this.registerTheme({
      id: 'dark',
      name: '暗色主题',
      type: ThemeType.DARK,
      tokens: [
        { name: 'color-primary', type: TokenType.COLOR, value: '#4d9fff', category: 'colors' },
        { name: 'color-background', type: TokenType.COLOR, value: '#1a1a1a', category: 'colors' },
        { name: 'color-text', type: TokenType.COLOR, value: '#e0e0e0', category: 'colors' },
        { name: 'color-border', type: TokenType.COLOR, value: '#333333', category: 'colors' },
        { name: 'spacing-xs', type: TokenType.SPACING, value: '4px', category: 'spacing' },
        { name: 'spacing-sm', type: TokenType.SPACING, value: '8px', category: 'spacing' },
        { name: 'spacing-md', type: TokenType.SPACING, value: '16px', category: 'spacing' },
        { name: 'spacing-lg', type: TokenType.SPACING, value: '24px', category: 'spacing' },
        { name: 'spacing-xl', type: TokenType.SPACING, value: '32px', category: 'spacing' }
      ],
      cssVariables: {
        '--color-primary': '#4d9fff',
        '--color-primary-hover': '#6bb0ff',
        '--color-background': '#1a1a1a',
        '--color-surface': '#2a2a2a',
        '--color-text': '#e0e0e0',
        '--color-text-secondary': '#a0a0a0',
        '--color-border': '#333333',
        '--color-shadow': 'rgba(0, 0, 0, 0.3)',
        '--spacing-xs': '4px',
        '--spacing-sm': '8px',
        '--spacing-md': '16px',
        '--spacing-lg': '24px',
        '--spacing-xl': '32px',
        '--border-radius': '4px',
        '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '--font-size-sm': '12px',
        '--font-size-md': '14px',
        '--font-size-lg': '16px',
        '--shadow-sm': '0 1px 2px var(--color-shadow)',
        '--shadow-md': '0 2px 4px var(--color-shadow)',
        '--shadow-lg': '0 4px 8px var(--color-shadow)'
      }
    });
    
    // 应用默认主题或持久化的主题
    const themeToApply = this.currentThemeId || this.config.defaultTheme;
    if (this.themes.has(themeToApply)) {
      this.setTheme(themeToApply, { enableTransition: false });
    }
  }

  /**
   * 清理
   */
  public destroy(): void {
    // 移除系统主题监听
    if (this.systemThemeQuery) {
      this.systemThemeQuery.removeEventListener('change', () => {});
    }
    
    // 移除所有监听器
    this.removeAllListeners();
  }
}
