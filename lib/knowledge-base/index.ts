/**
 * YYC³ KnowledgeBase 模块导出
 */

export {
  KnowledgeBase,
  type IKnowledgeBase,
  type KnowledgeBaseConfig,
  type KnowledgeSource,
  type IngestionResult,
  type RetrievalQuery,
  type RetrievalResult,
  type SearchResult,
  type ReasoningQuery,
  type ReasoningResult,
  type Hypothesis,
  type Feedback,
  type QualityMetrics,
  type VectorStoreConfig,
  type SearchEngineConfig,
  type ReasoningConfig,
  type LearningConfig
} from './KnowledgeBase';

import { KnowledgeBase as DefaultKnowledgeBase } from './KnowledgeBase';
export default DefaultKnowledgeBase;
