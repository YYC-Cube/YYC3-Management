/**
 * ChatInterface 组件类型定义
 * 
 * 提供完整的聊天界面类型系统，包括消息、会话、用户、附件等
 * 
 * @module ChatInterface/Types
 */

/**
 * 组件健康状态
 */
export interface ComponentHealth {
  /** 组件ID */
  componentId: string;
  /** 组件状态 */
  status: string;
  /** 是否健康 */
  healthy: boolean;
  /** 指标数据 */
  metrics: Record<string, any>;
  /** 最后检查时间 */
  lastChecked: Date;
}

// ============================================================================
// 核心类型
// ============================================================================

/**
 * 消息类型
 */
export type MessageType = 
  | 'text'           // 文本消息
  | 'image'          // 图片消息
  | 'audio'          // 音频消息
  | 'video'          // 视频消息
  | 'file'           // 文件消息
  | 'code'           // 代码消息
  | 'system'         // 系统消息
  | 'rich';          // 富文本消息

/**
 * 消息状态
 */
export type MessageStatus = 
  | 'sending'        // 发送中
  | 'sent'           // 已发送
  | 'delivered'      // 已送达
  | 'read'           // 已读
  | 'failed'         // 发送失败
  | 'deleted';       // 已删除

/**
 * 消息发送者角色
 */
export type SenderRole = 
  | 'user'           // 用户
  | 'assistant'      // AI助手
  | 'system'         // 系统
  | 'bot';           // 机器人

// ============================================================================
// 消息相关接口
// ============================================================================

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  /** 消息唯一标识 */
  id: string;
  
  /** 消息类型 */
  type: MessageType;
  
  /** 消息内容 */
  content: string;
  
  /** 发送者ID */
  senderId: string;
  
  /** 发送者角色 */
  senderRole: SenderRole;
  
  /** 发送者名称 */
  senderName?: string;
  
  /** 发送者头像 */
  senderAvatar?: string;
  
  /** 会话ID */
  sessionId: string;
  
  /** 消息状态 */
  status: MessageStatus;
  
  /** 创建时间 */
  createdAt: Date;
  
  /** 更新时间 */
  updatedAt?: Date;
  
  /** 附件列表 */
  attachments?: Attachment[];
  
  /** 回复的消息ID */
  replyToId?: string;
  
  /** 消息元数据 */
  metadata?: Record<string, any>;
  
  /** 是否已编辑 */
  isEdited?: boolean;
  
  /** 编辑历史 */
  editHistory?: MessageEdit[];
  
  /** 反应列表（点赞、表情等） */
  reactions?: Reaction[];
}

/**
 * 消息编辑记录
 */
export interface MessageEdit {
  /** 编辑时间 */
  timestamp: Date;
  
  /** 旧内容 */
  oldContent: string;
  
  /** 新内容 */
  newContent: string;
  
  /** 编辑原因 */
  reason?: string;
}

/**
 * 消息反应
 */
export interface Reaction {
  /** 反应类型（emoji或预定义类型） */
  type: string;
  
  /** 反应用户ID列表 */
  userIds: string[];
  
  /** 反应数量 */
  count: number;
}

/**
 * 附件接口
 */
export interface Attachment {
  /** 附件ID */
  id: string;
  
  /** 文件名 */
  fileName: string;
  
  /** 文件大小（字节） */
  fileSize: number;
  
  /** MIME类型 */
  mimeType: string;
  
  /** 文件URL */
  url: string;
  
  /** 缩略图URL */
  thumbnailUrl?: string;
  
  /** 上传时间 */
  uploadedAt: Date;
  
  /** 上传进度（0-100） */
  uploadProgress?: number;
  
  /** 上传状态 */
  uploadStatus?: 'pending' | 'uploading' | 'completed' | 'failed';
  
  /** 元数据 */
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    [key: string]: any;
  };
}

// ============================================================================
// 会话相关接口
// ============================================================================

/**
 * 聊天会话接口
 */
export interface ChatSession {
  /** 会话ID */
  id: string;
  
  /** 会话标题 */
  title: string;
  
  /** 会话描述 */
  description?: string;
  
  /** 创建时间 */
  createdAt: Date;
  
  /** 更新时间 */
  updatedAt: Date;
  
  /** 最后活跃时间 */
  lastActiveAt: Date;
  
  /** 参与者列表 */
  participants: Participant[];
  
  /** 消息数量 */
  messageCount: number;
  
  /** 未读消息数 */
  unreadCount: number;
  
  /** 会话状态 */
  status: 'active' | 'archived' | 'deleted';
  
  /** 会话类型 */
  type: 'single' | 'group' | 'channel';
  
  /** 会话设置 */
  settings?: SessionSettings;
  
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 会话参与者
 */
export interface Participant {
  /** 用户ID */
  userId: string;
  
  /** 用户名称 */
  userName: string;
  
  /** 用户头像 */
  userAvatar?: string;
  
  /** 角色 */
  role: 'owner' | 'admin' | 'member';
  
  /** 加入时间 */
  joinedAt: Date;
  
  /** 最后阅读消息ID */
  lastReadMessageId?: string;
  
  /** 最后阅读时间 */
  lastReadAt?: Date;
  
  /** 是否在线 */
  isOnline?: boolean;
  
  /** 最后在线时间 */
  lastOnlineAt?: Date;
}

/**
 * 会话设置
 */
export interface SessionSettings {
  /** 是否静音 */
  muted?: boolean;
  
  /** 是否置顶 */
  pinned?: boolean;
  
  /** 是否启用通知 */
  notificationsEnabled?: boolean;
  
  /** 消息保留时间（天） */
  messageRetentionDays?: number;
  
  /** 自定义背景 */
  customBackground?: string;
  
  /** 主题色 */
  themeColor?: string;
}

/**
 * 会话模板
 */
export interface SessionTemplate {
  /** 模板名称 */
  name: string;
  
  /** 模板描述 */
  description?: string;
  
  /** 初始消息列表 */
  initialMessages?: Partial<ChatMessage>[];
  
  /** 默认设置 */
  defaultSettings?: SessionSettings;
  
  /** 预设参与者 */
  defaultParticipants?: string[];
}

// ============================================================================
// 功能配置接口
// ============================================================================

/**
 * 聊天配置
 */
export interface ChatConfig {
  /** API端点 */
  apiEndpoint?: string;
  
  /** WebSocket端点 */
  wsEndpoint?: string;
  
  /** 实时服务端点 */
  realtimeEndpoint?: string;
  
  /** 最大重连次数 */
  reconnectAttempts?: number;
  
  /** 重连间隔（毫秒） */
  reconnectInterval?: number;
  
  /** 最大会话数 */
  maxSessions?: number;
  
  /** 会话超时时间（毫秒） */
  sessionTimeout?: number;
  
  /** 最大文件大小（字节） */
  maxFileSize?: number;
  
  /** 允许的文件格式 */
  allowedFormats?: string[];
  
  /** 消息持久化配置 */
  persistence?: PersistenceConfig;
  
  /** 加密配置 */
  encryption?: EncryptionConfig;
  
  /** UI配置 */
  ui?: UIConfig;
  
  /** 分析配置 */
  analytics?: AnalyticsConfig;
  
  /** 功能开关 */
  features?: FeatureFlags;
}

/**
 * 持久化配置
 */
export interface PersistenceConfig {
  /** 是否启用持久化 */
  enabled: boolean;
  
  /** 存储类型 */
  storageType: 'localStorage' | 'indexedDB' | 'memory';
  
  /** 存储键前缀 */
  keyPrefix?: string;
  
  /** 最大存储条目数 */
  maxEntries?: number;
  
  /** 过期时间（毫秒） */
  expirationTime?: number;
}

/**
 * 加密配置
 */
export interface EncryptionConfig {
  /** 是否启用加密 */
  enabled: boolean;
  
  /** 加密算法 */
  algorithm?: 'AES-GCM' | 'AES-CBC';
  
  /** 密钥长度 */
  keyLength?: 128 | 192 | 256;
}

/**
 * UI配置
 */
export interface UIConfig {
  /** 主题 */
  theme?: 'light' | 'dark' | 'auto';
  
  /** 布局模式 */
  layout?: 'compact' | 'comfortable' | 'spacious';
  
  /** 字体大小 */
  fontSize?: 'small' | 'medium' | 'large';
  
  /** 是否显示头像 */
  showAvatars?: boolean;
  
  /** 是否显示时间戳 */
  showTimestamps?: boolean;
  
  /** 是否启用动画 */
  enableAnimations?: boolean;
  
  /** 消息分组时间阈值（分钟） */
  messageGroupingThreshold?: number;
}

/**
 * 分析配置
 */
export interface AnalyticsConfig {
  /** 是否启用分析 */
  enabled: boolean;
  
  /** 分析服务端点 */
  endpoint?: string;
  
  /** 采样率（0-1） */
  samplingRate?: number;
  
  /** 批量发送大小 */
  batchSize?: number;
  
  /** 发送间隔（毫秒） */
  flushInterval?: number;
}

/**
 * 可访问性配置
 */
export interface AccessibilityConfig {
  /** 是否启用高对比度模式 */
  highContrast?: boolean;
  
  /** 字体大小调整 */
  fontSize?: 'small' | 'medium' | 'large' | 'extra-large';
  
  /** 是否启用屏幕阅读器支持 */
  screenReaderSupport?: boolean;
  
  /** 是否启用键盘导航增强 */
  keyboardNavigation?: boolean;
  
  /** 是否启用文本到语音功能 */
  textToSpeech?: boolean;
  
  /** 是否启用语音识别输入 */
  speechRecognition?: boolean;
  
  /** 颜色方案偏好 */
  colorScheme?: 'light' | 'dark' | 'system';
  
  /** 动画设置 */
  animations?: 'enabled' | 'reduced' | 'disabled';
}

/**
 * 功能开关
 */
export interface FeatureFlags {
  /** 是否启用消息编辑 */
  enableMessageEdit?: boolean;
  
  /** 是否启用消息删除 */
  enableMessageDelete?: boolean;
  
  /** 是否启用附件 */
  enableAttachments?: boolean;
  
  /** 是否启用语音消息 */
  enableVoiceMessages?: boolean;
  
  /** 是否启用视频消息 */
  enableVideoMessages?: boolean;
  
  /** 是否启用表情反应 */
  enableReactions?: boolean;
  
  /** 是否启用消息搜索 */
  enableSearch?: boolean;
  
  /** 是否启用翻译 */
  enableTranslation?: boolean;
  
  /** 是否启用智能回复建议 */
  enableSmartReplies?: boolean;
  
  /** 是否启用打字指示器 */
  enableTypingIndicator?: boolean;
  
  /** 是否启用已读回执 */
  enableReadReceipts?: boolean;
}

// ============================================================================
// 查询和过滤接口
// ============================================================================

/**
 * 历史消息查询选项
 */
export interface HistoryOptions {
  /** 会话ID */
  sessionId?: string;
  
  /** 起始消息ID（用于分页） */
  startMessageId?: string;
  
  /** 结束消息ID */
  endMessageId?: string;
  
  /** 最大返回数量 */
  limit?: number;
  
  /** 偏移量 */
  offset?: number;
  
  /** 排序方向 */
  order?: 'asc' | 'desc';
  
  /** 消息类型过滤 */
  messageTypes?: MessageType[];
  
  /** 发送者过滤 */
  senderIds?: string[];
  
  /** 时间范围 */
  dateRange?: {
    start: Date;
    end: Date;
  };
  
  /** 搜索关键词 */
  searchQuery?: string;
  
  /** 是否包含附件 */
  includeAttachments?: boolean;
}

/**
 * 回复建议上下文
 */
export interface ReplyContext {
  /** 当前用户ID */
  userId: string;
  
  /** 会话ID */
  sessionId: string;
  
  /** 最近消息列表 */
  recentMessages: ChatMessage[];
  
  /** 当前消息（如果有） */
  currentMessage?: ChatMessage;
  
  /** 用户偏好 */
  userPreferences?: Record<string, any>;
}

/**
 * 智能回复建议
 */
export interface SuggestedReply {
  /** 建议文本 */
  text: string;
  
  /** 建议类型 */
  type: 'quick' | 'smart' | 'template';
  
  /** 置信度（0-1） */
  confidence: number;
  
  /** 分类标签 */
  category?: string;
  
  /** 图标 */
  icon?: string;
  
  /** 元数据 */
  metadata?: Record<string, any>;
}

// ============================================================================
// 导出格式接口
// ============================================================================

/**
 * 导出格式
 */
export type ExportFormat = 'json' | 'csv' | 'txt' | 'html' | 'pdf';

/**
 * 导出的对话数据
 */
export interface ExportedConversation {
  /** 会话信息 */
  session: ChatSession;
  
  /** 消息列表 */
  messages: ChatMessage[];
  
  /** 导出格式 */
  format: ExportFormat;
  
  /** 导出时间 */
  exportedAt: Date;
  
  /** 文件名 */
  fileName: string;
  
  /** 文件内容（Base64编码） */
  fileContent: string;
  
  /** 元数据 */
  metadata?: Record<string, any>;
}

// ============================================================================
// 实时功能接口
// ============================================================================

/**
 * 打字指示器数据
 */
export interface TypingData {
  /** 用户ID */
  userId: string;
  
  /** 用户名称 */
  userName: string;
  
  /** 会话ID */
  sessionId: string;
  
  /** 是否正在打字 */
  isTyping: boolean;
  
  /** 开始时间 */
  startedAt?: Date;
}

/**
 * 已读回执
 */
export interface ReadReceipt {
  /** 消息ID */
  messageId: string;
  
  /** 用户ID */
  userId: string;
  
  /** 阅读时间 */
  readAt: Date;
  
  /** 会话ID */
  sessionId: string;
}

/**
 * 实时消息
 */
export interface IncomingMessage extends ChatMessage {
  /** 消息来源 */
  source: 'user' | 'system' | 'sync';
  
  /** 是否需要通知 */
  shouldNotify?: boolean;
  
  /** 优先级 */
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

// ============================================================================
// 多媒体接口
// ============================================================================

/**
 * 音频Blob
 */
export interface AudioBlob {
  /** Blob数据 */
  blob: Blob;
  
  /** 时长（秒） */
  duration: number;
  
  /** 采样率 */
  sampleRate?: number;
  
  /** 声道数 */
  channels?: number;
  
  /** 格式 */
  format?: string;
}

/**
 * 图片Blob
 */
export interface ImageBlob {
  /** Blob数据 */
  blob: Blob;
  
  /** 宽度 */
  width: number;
  
  /** 高度 */
  height: number;
  
  /** 格式 */
  format?: string;
  
  /** 文件大小 */
  size?: number;
}

/**
 * 屏幕共享流
 */
export interface ScreenShareStream {
  /** MediaStream对象 */
  stream: MediaStream;
  
  /** 流ID */
  streamId: string;
  
  /** 开始时间 */
  startedAt: Date;
  
  /** 视频轨道 */
  videoTrack?: MediaStreamTrack;
  
  /** 音频轨道 */
  audioTrack?: MediaStreamTrack;
}

// ============================================================================
// 主题和布局接口
// ============================================================================

/**
 * 聊天主题
 */
export interface ChatTheme {
  /** 主题名称 */
  name: string;
  
  /** 主色调 */
  primaryColor: string;
  
  /** 辅助色 */
  secondaryColor?: string;
  
  /** 背景色 */
  backgroundColor?: string;
  
  /** 文本色 */
  textColor?: string;
  
  /** 自定义CSS变量 */
  cssVariables?: Record<string, string>;
}

/**
 * 聊天布局
 */
export interface ChatLayout {
  /** 布局类型 */
  type: 'default' | 'compact' | 'wide' | 'custom';
  
  /** 消息列表位置 */
  messagesPosition?: 'top' | 'center' | 'bottom';
  
  /** 输入框位置 */
  inputPosition?: 'bottom' | 'top' | 'floating';
  
  /** 侧边栏位置 */
  sidebarPosition?: 'left' | 'right' | 'none';
  
  /** 自定义样式 */
  customStyles?: Record<string, any>;
}

// ============================================================================
// 错误和结果接口
// ============================================================================

/**
 * 操作结果
 */
export interface OperationResult<T = any> {
  /** 是否成功 */
  success: boolean;
  
  /** 结果数据 */
  data?: T;
  
  /** 错误信息 */
  error?: string;
  
  /** 错误代码 */
  errorCode?: string;
  
  /** 时间戳 */
  timestamp: Date;
  
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 工具注册结果
 */
export interface ToolRegistrationResult extends OperationResult {
  /** 工具ID */
  toolId?: string;
  
  /** 版本 */
  version?: string;
}

/**
 * 保存结果
 */
export interface SaveResult extends OperationResult {
  /** 保存的项目数 */
  itemCount?: number;
  
  /** 文件大小 */
  fileSize?: number;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean;
  
  /** 错误列表 */
  errors?: ValidationError[];
  
  /** 警告列表 */
  warnings?: ValidationWarning[];
}

/**
 * 验证错误
 */
export interface ValidationError {
  /** 错误字段 */
  field: string;
  
  /** 错误消息 */
  message: string;
  
  /** 错误代码 */
  code?: string;
}

/**
 * 验证警告
 */
export interface ValidationWarning {
  /** 警告字段 */
  field: string;
  
  /** 警告消息 */
  message: string;
  
  /** 警告代码 */
  code?: string;
}
