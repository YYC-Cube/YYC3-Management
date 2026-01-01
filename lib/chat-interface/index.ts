/**
 * YYC³ ChatInterface 模块导出
 */

// 导出类和接口
import { ChatInterface, IChatInterface } from './ChatInterface';
export { ChatInterface };
export type { IChatInterface };

export default ChatInterface;

// 导出类型定义
import type {
  ChatConfig,
  ChatMessage,
  ChatSession,
  MessageType,
  MessageStatus,
  SenderRole,
  Attachment,
  HistoryOptions,
  SessionTemplate,
  ReplyContext,
  SuggestedReply,
  ExportFormat,
  ExportedConversation,
  ChatTheme,
  ChatLayout,
  PersistenceConfig,
  EncryptionConfig,
  UIConfig,
  AccessibilityConfig,
  AnalyticsConfig
} from './types';

export type {
  ChatConfig,
  ChatMessage,
  ChatSession,
  MessageType,
  MessageStatus,
  SenderRole,
  Attachment,
  HistoryOptions,
  SessionTemplate,
  ReplyContext,
  SuggestedReply,
  ExportFormat,
  ExportedConversation,
  ChatTheme,
  ChatLayout,
  PersistenceConfig,
  EncryptionConfig,
  UIConfig,
  AccessibilityConfig,
  AnalyticsConfig
};

