/**
 * YYC³ 聊天界面组件
 * 
 * 提供完整的聊天界面功能，包括：
 * - 消息管理（发送、编辑、删除、历史记录）
 * - 会话管理（创建、切换、重命名）
 * - 交互功能（智能回复、翻译、总结、导出）
 * - 多模态支持（文件、语音、图片、屏幕共享）
 * - 实时功能（输入指示器、已读状态、未读计数）
 * - 界面控制（显示/隐藏、主题、布局）
 * 
 * @标准遵循 YYC³团队标准化规范 v1.1.0
 * @设计原则 五标五高五化
 */

import { EventEmitter } from 'events';
import type { LifecycleComponent } from '../ai-components/ComponentLifecycleManager';
import type { ComponentStatus, ComponentConfig } from '../ai-components/types';
import type { ComponentHealth } from './types';
import type {
  ChatConfig,
  ChatMessage,
  ChatSession,
  Attachment,
  HistoryOptions,
  SessionTemplate,
  ReplyContext,
  SuggestedReply,
  ExportFormat,
  ExportedConversation,
  MessageType,
  MessageStatus,
  ChatTheme,
  ChatLayout,
  PersistenceConfig,
  EncryptionConfig,
  UIConfig,
  AnalyticsConfig,
} from './types';

// ================================================
// 类型定义（已从 types.ts 导入）
// ================================================

// ================================================
// 内部服务类
// ================================================

class MessageStore {
  private messages: Map<string, ChatMessage> = new Map();
  private config: { persistence: PersistenceConfig; encryption: EncryptionConfig };

  constructor(config: { persistence: PersistenceConfig; encryption: EncryptionConfig }) {
    this.config = config;
    this.loadFromStorage();
  }

  async saveMessage(message: ChatMessage): Promise<void> {
    this.messages.set(message.id!, message);
    
    if (this.config.persistence.enabled) {
      await this.persistToStorage();
    }
  }

  getMessages(options?: HistoryOptions): ChatMessage[] {
    let messages = Array.from(this.messages.values());

    if (options?.dateRange?.start) {
      messages = messages.filter(m => m.createdAt >= (options.dateRange?.start || new Date()));
    }
    if (options?.dateRange?.end) {
      messages = messages.filter(m => m.createdAt <= (options.dateRange?.end || new Date()));
    }
    if (options?.messageTypes?.length) {
      messages = messages.filter(m => options.messageTypes?.includes(m.type));
    }
    if (options?.senderIds?.length) {
      messages = messages.filter(m => options.senderIds?.includes(m.senderId));
    }

    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const offset = options?.offset || 0;
    const limit = options?.limit || messages.length;
    return messages.slice(offset, offset + limit);
  }

  deleteMessage(messageId: string): void {
    this.messages.delete(messageId);
    this.persistToStorage();
  }

  clear(): void {
    this.messages.clear();
    this.persistToStorage();
  }

  private loadFromStorage(): void {
    if (!this.config.persistence.enabled) return;

    try {
      const stored = localStorage.getItem('chat_messages');
      if (stored) {
        const data = JSON.parse(stored);
        data.forEach((msg: ChatMessage) => {
          msg.createdAt = new Date(msg.createdAt!);
          this.messages.set(msg.id!, msg);
        });
      }
    } catch (error) {
      console.error('加载消息失败:', error);
    }
  }

  private async persistToStorage(): Promise<void> {
    if (!this.config.persistence.enabled) return;

    try {
      const data = Array.from(this.messages.values());
      localStorage.setItem('chat_messages', JSON.stringify(data));
    } catch (error) {
      console.error('持久化消息失败:', error);
    }
  }
}

class SessionManager {
  private sessions: Map<string, ChatSession> = new Map();
  private currentSessionId?: string;
  private config: { maxSessions: number; sessionTimeout: number };

  constructor(config: { maxSessions: number; sessionTimeout: number }) {
    this.config = config;
  }

  createSession(template?: SessionTemplate): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const session: ChatSession = {
      id: sessionId,
      title: template?.name || `会话 ${this.sessions.size + 1}`,
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
      participants: [],
      unreadCount: 0,
      status: 'active',
      type: 'single',
      messageCount: 0,
      metadata: template?.defaultSettings || {}
    };

    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;

    // 检查会话数量限制
    if (this.sessions.size > this.config.maxSessions) {
      this.cleanupOldSessions();
    }

    return sessionId;
  }

  switchSession(sessionId: string): void {
    if (!this.sessions.has(sessionId)) {
      throw new Error(`会话 ${sessionId} 不存在`);
    }
    this.currentSessionId = sessionId;
  }

  getCurrentSession(): ChatSession | undefined {
    return this.currentSessionId ? this.sessions.get(this.currentSessionId) : undefined;
  }

  listSessions(): ChatSession[] {
    return Array.from(this.sessions.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  renameSession(sessionId: string, newName: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = newName;
      session.updatedAt = new Date();
    }
  }

  private cleanupOldSessions(): void {
    const sessions = this.listSessions();
    const cutoffTime = Date.now() - this.config.sessionTimeout;

    for (const session of sessions) {
      if (session.updatedAt.getTime() < cutoffTime && this.sessions.size > this.config.maxSessions) {
        this.sessions.delete(session.id);
      }
    }
  }
}

class RealtimeService extends EventEmitter {
  private config: { endpoint: string; reconnectAttempts: number };
  private ws?: WebSocket;
  private reconnectCount = 0;

  constructor(config: { endpoint: string; reconnectAttempts: number }) {
    super();
    this.config = config;
    this.connect();
  }

  private connect(): void {
    try {
      this.ws = new WebSocket(this.config.endpoint);
      
      this.ws.onopen = () => {
        this.reconnectCount = 0;
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.emit(data.type, data.payload);
      };

      this.ws.onerror = (error) => {
        this.emit('error', error);
      };

      this.ws.onclose = () => {
        this.emit('disconnected');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('WebSocket连接失败:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectCount < this.config.reconnectAttempts) {
      this.reconnectCount++;
      setTimeout(() => this.connect(), 1000 * Math.pow(2, this.reconnectCount));
    }
  }

  async sendMessage(message: ChatMessage): Promise<{ messageId: string }> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket未连接'));
        return;
      }

      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.ws.send(JSON.stringify({
        type: 'message',
        payload: { ...message, id: messageId }
      }));

      resolve({ messageId });
    });
  }
}

class MediaProcessor {
  private config: { maxFileSize: number; allowedFormats: string[] };

  constructor(config: { maxFileSize: number; allowedFormats: string[] }) {
    this.config = config;
  }

  async uploadFile(file: File): Promise<Attachment> {
    if (file.size > this.config.maxFileSize) {
      throw new Error(`文件大小超过限制: ${this.config.maxFileSize / 1024 / 1024}MB`);
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !this.config.allowedFormats.includes(ext)) {
      throw new Error(`不支持的文件格式: ${ext}`);
    }

    // 模拟上传
    return {
      id: `att_${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date()
    };
  }
}

class UIManager {
  private config: UIConfig;
  private typingIndicators: Set<string> = new Set();

  constructor(config: UIConfig) {
    this.config = config;
  }

  addMessage(message: ChatMessage): void {
    console.log('添加消息到UI:', message);
  }

  updateMessageStatus(messageId: string, status: MessageStatus, newId?: string): void {
    console.log('更新消息状态:', messageId, status, newId);
  }

  showTypingIndicator(userId: string, userName: string): void {
    this.typingIndicators.add(userId);
    console.log(`${userName} 正在输入...`);
  }

  hideTypingIndicator(userId: string): void {
    this.typingIndicators.delete(userId);
  }

  markAsRead(messageId: string, userId: string): void {
    console.log('标记已读:', messageId, userId);
  }

  setupScreenReader(): void {
    console.log('设置屏幕阅读器支持');
  }
}

class ChatAnalytics {
  private config: AnalyticsConfig;

  constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  trackMessageSent(message: ChatMessage): void {
    if (!this.config.enabled) return;
    console.log('跟踪消息发送:', message.type);
  }

  trackError(type: string, error: any): void {
    if (!this.config.enabled) return;
    console.error('跟踪错误:', type, error);
  }
}

// ================================================
// 主要接口
// ================================================

export interface IChatInterface {
  // 消息管理
  sendMessage(message: ChatMessage): Promise<string>;
  editMessage(messageId: string, newContent: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
  getMessageHistory(options?: HistoryOptions): ChatMessage[];
  clearHistory(): Promise<void>;
  
  // 会话管理
  createNewSession(template?: SessionTemplate): string;
  switchSession(sessionId: string): Promise<void>;
  getCurrentSession(): ChatSession | undefined;
  listSessions(): ChatSession[];
  renameSession(sessionId: string, newName: string): void;
  
  // 交互功能
  suggestReplies(context: ReplyContext): Promise<SuggestedReply[]>;
  translateMessage(messageId: string, targetLanguage: string): Promise<string>;
  summarizeConversation(): Promise<string>;
  exportConversation(format: ExportFormat): Promise<ExportedConversation>;
  
  // 多模态支持
  uploadAttachment(file: File): Promise<Attachment>;
  
  // 实时功能
  startTypingIndicator(): void;
  stopTypingIndicator(): void;
  markMessageAsRead(messageId: string): void;
  getUnreadCount(): number;
  
  // 界面控制
  show(): void;
  hide(): void;
  minimize(): void;
  maximize(): void;
  setTheme(theme: ChatTheme): void;
  setLayout(layout: ChatLayout): void;
  
  // 生命周期
  getStatus(): ComponentStatus;
}

// ================================================
// 主类实现
// ================================================

export class ChatInterface extends EventEmitter implements IChatInterface, LifecycleComponent {
  readonly id = 'chat-interface';
  readonly name = 'ChatInterface';
  readonly version = '1.0.0';
  readonly dependencies: string[] = ['context-manager', 'ai-actions-manager'];
  
  private messageStore!: MessageStore;
  private sessionManager!: SessionManager;
  private realtimeService!: RealtimeService;
  private mediaProcessor!: MediaProcessor;
  private uiManager!: UIManager;
  private analytics!: ChatAnalytics;
  private unreadCount = 0;
  private componentStatus: ComponentStatus = 'idle';
  private lastError?: Error;
  private status = { healthy: true, lastError: undefined as Error | undefined };
  private componentConfig: ComponentConfig;
  private chatConfig: ChatConfig;

  constructor(config: Partial<ChatConfig> = {}) {
    super();
    this.chatConfig = {
      persistence: config.persistence || { enabled: true, storageType: 'localStorage' },
      encryption: config.encryption || { enabled: false },
      maxSessions: config.maxSessions || 10,
      sessionTimeout: config.sessionTimeout || 30 * 60 * 1000,
      realtimeEndpoint: config.realtimeEndpoint,
      reconnectAttempts: config.reconnectAttempts || 5,
      reconnectInterval: config.reconnectInterval || 1000,
      maxFileSize: config.maxFileSize || 10 * 1024 * 1024,
      allowedFormats: config.allowedFormats || [],
      ui: config.ui || { theme: 'auto', layout: 'comfortable', fontSize: 'medium', showAvatars: true, showTimestamps: true, enableAnimations: true },
      analytics: config.analytics || { enabled: false },
      ...config
    };
    
    // 初始化ComponentConfig
    this.componentConfig = {
      id: this.id,
      name: this.name,
      enabled: true,
      autoStart: false,
      dependencies: this.dependencies,
      priority: 10,
      timeout: 30000,
      retryPolicy: { maxAttempts: 3, backoffMultiplier: 2, initialDelay: 1000, maxDelay: 10000 },
      metrics: { enabled: true, interval: 60000, retention: 1000 }
    };
  }
  
  // 实现LifecycleComponent接口的config属性
  get config(): ComponentConfig {
    return this.componentConfig;
  }

  // 实现LifecycleComponent接口的getStatus方法
  getStatus(): ComponentStatus {
    return this.componentStatus;
  }

  async initialize(config: ComponentConfig): Promise<void> {
    if (this.componentStatus !== 'idle') {
      throw new Error('Component already initialized');
    }
    
    try {
      this.componentStatus = 'initializing';
      
      // 合并传入的配置与构造函数配置
      const mergedConfig = { ...this.chatConfig, ...(config as Partial<ChatConfig>) };
      
      this.messageStore = new MessageStore({
        persistence: mergedConfig.persistence || { enabled: true, storageType: 'localStorage' },
        encryption: mergedConfig.encryption || { enabled: false }
      });
      
      this.sessionManager = new SessionManager({
        maxSessions: mergedConfig.maxSessions || 10,
        sessionTimeout: mergedConfig.sessionTimeout || 30 * 60 * 1000
      });
      
      this.realtimeService = new RealtimeService({
        endpoint: mergedConfig.realtimeEndpoint || '',
        reconnectAttempts: mergedConfig.reconnectAttempts || 5
      });
      
      this.mediaProcessor = new MediaProcessor({
        maxFileSize: mergedConfig.maxFileSize || 10 * 1024 * 1024,
        allowedFormats: mergedConfig.allowedFormats || []
      });
      
      this.uiManager = new UIManager(mergedConfig.ui || { theme: 'auto', layout: 'comfortable', fontSize: 'medium', showAvatars: true, showTimestamps: true, enableAnimations: true });
      this.analytics = new ChatAnalytics(mergedConfig.analytics || { enabled: false });
      
      this.setupEventHandlers();
      this.componentStatus = 'ready';
      this.emit('lifecycle:initialized');
    } catch (error) {
      this.componentStatus = 'error';
      this.emit('lifecycle:error', error);
      throw error;
    }
  }

  async start(): Promise<void> {
    if (this.componentStatus !== 'ready') {
      throw new Error('Component not ready to start');
    }
    
    this.componentStatus = 'running';
    this.emit('lifecycle:started');
  }

  async stop(): Promise<void> {
    if (this.componentStatus !== 'running') {
      return;
    }
    
    this.componentStatus = 'paused';
    this.emit('lifecycle:paused');
  }

  async destroy(): Promise<void> {
    await this.stop();
    this.removeAllListeners();
    this.componentStatus = 'destroyed';
    this.emit('lifecycle:destroyed');
  }

  private setupEventHandlers(): void {
    this.realtimeService.on('message', (incoming: ChatMessage) => {
      this.handleIncomingMessage(incoming);
    });

    this.realtimeService.on('typing', (data: { userId: string; userName: string }) => {
      this.uiManager.showTypingIndicator(data.userId, data.userName);
    });

    this.realtimeService.on('error', (error: Error) => {
      this.status.healthy = false;
      this.status.lastError = error;
    });
  }

  private handleIncomingMessage(message: ChatMessage): void {
    this.unreadCount++;
    this.messageStore.saveMessage(message);
    this.uiManager.addMessage(message);
    this.emit('message:received', message);
  }

  // ============ 消息管理 ============

  async sendMessage(message: ChatMessage): Promise<string> {
    const startTime = Date.now();
    
    try {
      // 验证和预处理
      const validated = this.validateMessage(message);
      const processed = await this.preprocessMessage(validated);
      
      // 生成临时ID
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 乐观更新UI
      this.uiManager.addMessage({
        ...processed,
        id: tempId,
        status: 'sending'
      });
      
      // 发送消息
      const response = await this.realtimeService.sendMessage(processed);
      
      // 更新状态
      this.uiManager.updateMessageStatus(tempId, 'sent', response.messageId);
      
      // 存储
      await this.messageStore.saveMessage({
        ...processed,
        id: response.messageId,
        createdAt: new Date(),
        status: 'sent'
      });
      
      // 分析
      this.analytics.trackMessageSent(processed);
      this.emit('message:sent', processed);
      
      return response.messageId;
      
    } catch (error) {
      this.analytics.trackError('send_message', error);
      throw error;
    }
  }

  async editMessage(messageId: string, newContent: string): Promise<void> {
    const messages = this.messageStore.getMessages();
    const message = messages.find(m => m.id === messageId);
    
    if (!message) {
      throw new Error('消息不存在');
    }

    message.content = newContent;
    message.metadata = { ...message.metadata, edited: true, editedAt: new Date() };
    await this.messageStore.saveMessage(message);
    
    this.emit('message:edited', message);
  }

  async deleteMessage(messageId: string): Promise<void> {
    this.messageStore.deleteMessage(messageId);
    this.emit('message:deleted', messageId);
  }

  getMessageHistory(options?: HistoryOptions): ChatMessage[] {
    return this.messageStore.getMessages(options);
  }

  async clearHistory(): Promise<void> {
    this.messageStore.clear();
    this.emit('history:cleared');
  }

  // ============ 会话管理 ============

  createNewSession(template?: SessionTemplate): string {
    return this.sessionManager.createSession(template);
  }

  async switchSession(sessionId: string): Promise<void> {
    this.sessionManager.switchSession(sessionId);
    this.emit('session:switched', sessionId);
  }

  getCurrentSession(): ChatSession | undefined {
    return this.sessionManager.getCurrentSession();
  }

  listSessions(): ChatSession[] {
    return this.sessionManager.listSessions();
  }

  renameSession(sessionId: string, newName: string): void {
    this.sessionManager.renameSession(sessionId, newName);
    this.emit('session:renamed', { sessionId, newName });
  }

  // ============ 交互功能 ============

  async suggestReplies(context: ReplyContext): Promise<SuggestedReply[]> {
    // 模拟智能回复生成
    return [
      { text: '好的，我明白了', type: 'quick', confidence: 0.9, icon: '👍' },
      { text: '需要更多信息', type: 'smart', confidence: 0.7, icon: '❓' },
      { text: '让我考虑一下', type: 'smart', confidence: 0.6, icon: '🤔' }
    ];
  }

  async translateMessage(messageId: string, targetLanguage: string): Promise<string> {
    const messages = this.messageStore.getMessages();
    const message = messages.find(m => m.id === messageId);
    
    if (!message) {
      throw new Error('消息不存在');
    }

    // 模拟翻译
    return `[${targetLanguage}] ${message.content}`;
  }

  async summarizeConversation(): Promise<string> {
    const messages = this.getMessageHistory({ limit: 100 });
    
    if (messages.length === 0) {
      return '暂无对话记录';
    }

    return `本次对话共${messages.length}条消息，主要讨论了...`;
  }

  async exportConversation(format: ExportFormat): Promise<ExportedConversation> {
    const messages = this.getMessageHistory();
    const session = this.getCurrentSession();
    
    let fileContent: string;
    switch (format) {
      case 'json':
        fileContent = JSON.stringify(messages, null, 2);
        break;
      case 'html':
        fileContent = messages.map(m => `<p><strong>${m.senderName || 'Unknown'}</strong> (${m.createdAt})<br/>${m.content}</p>`).join('\n');
        break;
      case 'csv':
        fileContent = messages.map(m => `"${m.senderName || 'Unknown'}","${m.createdAt}","${m.content.replace(/"/g, '""')}"`).join('\n');
        break;
      default:
        fileContent = messages.map(m => `${m.senderName || 'Unknown'}: ${m.content}`).join('\n');
    }

    return {
      session: session || { id: 'unknown', title: 'Unknown', createdAt: new Date(), updatedAt: new Date(), lastActiveAt: new Date(), participants: [], messageCount: messages.length, unreadCount: 0, status: 'active', type: 'single' },
      messages,
      format,
      exportedAt: new Date(),
      fileName: `conversation_${session?.id || 'unknown'}_${Date.now()}.${format}`,
      fileContent: Buffer.from(fileContent).toString('base64'),
      metadata: {
        sessionId: session?.id || 'unknown',
        exportedAt: new Date(),
        messageCount: messages.length
      }
    };
  }

  // ============ 多模态支持 ============

  async uploadAttachment(file: File): Promise<Attachment> {
    return await this.mediaProcessor.uploadFile(file);
  }

  // ============ 实时功能 ============

  startTypingIndicator(): void {
    this.realtimeService.emit('typing', { started: true });
  }

  stopTypingIndicator(): void {
    this.realtimeService.emit('typing', { started: false });
  }

  markMessageAsRead(messageId: string): void {
    this.unreadCount = Math.max(0, this.unreadCount - 1);
    this.uiManager.markAsRead(messageId, 'current-user');
  }

  getUnreadCount(): number {
    return this.unreadCount;
  }

  // ============ 界面控制 ============

  show(): void {
    this.emit('ui:show');
  }

  hide(): void {
    this.emit('ui:hide');
  }

  minimize(): void {
    this.emit('ui:minimize');
  }

  maximize(): void {
    this.emit('ui:maximize');
  }

  setTheme(theme: ChatTheme): void {
    this.chatConfig.ui = { ...this.chatConfig.ui, theme: theme.name as 'light' | 'dark' | 'auto' };
    this.emit('ui:theme-changed', theme);
  }

  setLayout(layout: ChatLayout): void {
    this.chatConfig.ui = { ...this.chatConfig.ui, layout: layout.type as 'compact' | 'comfortable' | 'spacious' };
    this.emit('ui:layout-changed', layout);
  }

  // ============ 工具方法 ============

  private validateMessage(message: ChatMessage): ChatMessage {
    if (!message.content || message.content.trim().length === 0) {
      throw new Error('消息内容不能为空');
    }
    return message;
  }

  private async preprocessMessage(message: ChatMessage): Promise<ChatMessage> {
    // 标准化内容
    const normalized = {
      ...message,
      content: message.content.trim(),
      createdAt: message.createdAt || new Date()
    };

    return normalized;
  }

  // 保留原有的健康状态检查方法，使用不同的名称
  getHealthStatus(): ComponentHealth {
    const isHealthy = this.componentStatus === 'running' || this.componentStatus === 'ready';
    
    return {
      componentId: this.id,
      status: this.componentStatus,
      healthy: isHealthy,
      metrics: {
        unreadCount: this.unreadCount,
        sessionCount: this.sessionManager?.listSessions().length || 0,
        messageCount: this.messageStore?.getMessages().length || 0,
      },
      lastChecked: new Date(),
    };
  }
}

export default ChatInterface;
