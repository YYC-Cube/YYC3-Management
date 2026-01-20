# 🌟 AI智能客服系统 - 顶层自治单元设计

## 📋 新增模块：AI智能客服系统

### 模块定位与架构

```yaml
模块定位:
  ✅ 系统顶层应用: 全局可访问的智能助手
  ✅ 多模态交互: 文本+语音+图像+情感识别
  ✅ 自治运行: 独立微服务架构
  ✅ 权限分离: 客服板块 + 运维板块

技术特性:
  🔹 浮动可拖拽: 基于Web Components的独立窗口
  🔹 智能预测: 用户意图预测和主动服务
  🔹 情感同步: 情感识别与响应适配
  🔹 自主学习: 对话历史学习和知识更新
  🔹 一键跳转: 深度链接系统功能
```text

---

## 🏗️ 系统架构设计

### 总体架构

┌─────────────────────────────────────────────────────────────┐
│                    AI智能客服系统 (顶层)                      │
├─────────────────────────────────────────────────────────────┤
│ 前端层:                                                       │
│   ✅ 浮动窗口组件 (Web Components)                           │
│   ✅ 多模态交互界面 (Vue 3 + 语音/图像)                       │
│   ✅ 实时通信 (WebSocket + SSE)                              │
├─────────────────────────────────────────────────────────────┤
│ 服务层:                                                       │
│   🔹 对话管理服务 (Dialogue Management)                      │
│   🔹 意图识别服务 (Intent Recognition)                      │
│   🔹 情感分析服务 (Sentiment Analysis)                      │
│   🔹 知识检索服务 (Knowledge Retrieval)                     │
│   🔹 自主学习引擎 (Self-Learning Engine)                    │
├─────────────────────────────────────────────────────────────┤
│ AI引擎层:                                                     │
│   🔸 大语言模型集成 (LLM Integration)                        │
│   🔸 多模态理解 (Multimodal Understanding)                  │
│   🔸 预测分析引擎 (Predictive Analytics)                    │
│   🔸 推荐算法 (Recommendation Algorithms)                   │
├─────────────────────────────────────────────────────────────┤
│ 数据层:                                                       │
│   🎯 对话知识库 (Conversation Knowledge Base)               │
│   🎯 用户行为库 (User Behavior Repository)                  │
│   🎯 情感模型库 (Sentiment Model Library)                   │
│   🎯 学习轨迹库 (Learning Trajectory DB)                    │
└─────────────────────────────────────────────────────────────┘

### 微服务架构扩展

```yaml
新增微服务:
  ai-customer-service: 智能客服核心服务
  ai-dialogue-service: 对话管理服务
  ai-sentiment-service: 情感分析服务
  ai-learning-service: 自主学习服务
  ai-prediction-service: 预测分析服务

服务依赖:
  ✅ 用户服务: 获取用户信息和权限
  ✅ 菜单服务: 菜品信息和推荐
  ✅ 订单服务: 订单查询和操作
  ✅ 库存服务: 库存状态查询
  ✅ 成本服务: 成本数据查询
  ✅ 报表服务: 分析报告生成
```text

---

## 🎨 前端组件设计

### 浮动式智能客服窗口

```vue
<template>
  <!-- 主浮动窗口 -->
  <div 
    class="ai-assistant-floating"
    :class="{
      'minimized': isMinimized,
      'dragging': isDragging,
      'customer-mode': currentMode === 'customer',
      'ops-mode': currentMode === 'operations'
    }"
    :style="windowStyle"
    @mousedown="startDrag"
  >
    <!-- 窗口头部 -->
    <div class="assistant-header" @dblclick="toggleMinimize">
      <div class="header-left">
        <i class="assistant-avatar" :class="getAvatarClass"></i>
        <span class="assistant-name">{{ assistantName }}</span>
        <el-tag 
          size="small" 
          :type="currentMode === 'customer' ? 'success' : 'warning'"
        >
          {{ currentMode === 'customer' ? '客服模式' : '运维模式' }}
        </el-tag>
      </div>
      <div class="header-actions">
        <el-tooltip content="最小化">
          <i class="el-icon-minus" @click="toggleMinimize"></i>
        </el-tooltip>
        <el-tooltip content="切换模式">
          <i class="el-icon-refresh" @click="toggleMode"></i>
        </el-tooltip>
        <el-tooltip content="设置">
          <i class="el-icon-setting" @click="showSettings"></i>
        </el-tooltip>
        <el-tooltip content="关闭">
          <i class="el-icon-close" @click="closeAssistant"></i>
        </el-tooltip>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div v-show="!isMinimized" class="assistant-content">
      <!-- 对话区域 -->
      <div class="chat-container">
        <div class="message-list" ref="messageList">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="message-item"
            :class="{
              'user-message': message.role === 'user',
              'assistant-message': message.role === 'assistant',
              'system-message': message.role === 'system'
            }"
          >
            <div class="message-avatar">
              <i :class="getMessageAvatar(message.role)"></i>
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(message.content)"></div>
              <div class="message-actions" v-if="message.actions">
                <el-button 
                  v-for="action in message.actions"
                  :key="action.label"
                  size="mini"
                  :type="action.type || 'primary'"
                  @click="handleAction(action)"
                >
                  {{ action.label }}
                </el-button>
              </div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-container">
        <!-- 多模态输入 -->
        <div class="input-toolbar">
          <el-tooltip content="语音输入">
            <i 
              class="el-icon-microphone" 
              :class="{ 'recording': isRecording }"
              @click="toggleVoiceInput"
            ></i>
          </el-tooltip>
          <el-tooltip content="图片识别">
            <i class="el-icon-picture" @click="triggerImageInput"></i>
          </el-tooltip>
          <el-tooltip content="文件上传">
            <i class="el-icon-upload" @click="triggerFileUpload"></i>
          </el-tooltip>
          <el-tooltip content="情感分析">
            <i 
              class="el-icon-star-off"
              :class="{ 'active': sentimentAnalysisEnabled }"
              @click="toggleSentimentAnalysis"
            ></i>
          </el-tooltip>
        </div>

        <!-- 文本输入 -->
        <div class="text-input-area">
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="2"
            :maxlength="500"
            placeholder="请输入您的问题..."
            @keydown.enter.exact.prevent="sendMessage"
            resize="none"
          ></el-input>
          <el-button 
            type="primary" 
            :loading="isLoading"
            @click="sendMessage"
            class="send-button"
          >
            <i class="el-icon-s-promotion"></i>
          </el-button>
        </div>

        <!-- 快捷操作 -->
        <div class="quick-actions" v-if="showQuickActions">
          <div class="quick-action-item" 
               v-for="action in quickActions" 
               :key="action.label"
               @click="handleQuickAction(action)">
            <i :class="action.icon"></i>
            <span>{{ action.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 最小化状态 -->
    <div v-show="isMinimized" class="minimized-state" @dblclick="toggleMinimize">
      <i class="el-icon-chat-dot-round"></i>
      <el-badge :value="unreadCount" v-if="unreadCount > 0"></el-badge>
    </div>

    <!-- 设置面板 -->
    <el-drawer
      title="AI助手设置"
      :visible.sync="settingsVisible"
      direction="rtl"
      size="300px"
    >
      <assistant-settings 
        :current-mode="currentMode"
        @mode-change="handleModeChange"
        @settings-update="handleSettingsUpdate"
      />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAIAssistant } from '@/composables/useAIAssistant'
import AssistantSettings from './AssistantSettings.vue'

// 响应式数据
const isMinimized = ref(false)
const isDragging = ref(false)
const currentMode = ref<'customer' | 'operations'>('customer')
const inputText = ref('')
const isLoading = ref(false)
const isRecording = ref(false)
const sentimentAnalysisEnabled = ref(true)
const settingsVisible = ref(false)
const unreadCount = ref(0)
const messageList = ref<HTMLElement>()

// 拖拽相关状态
const dragState = ref({
  startX: 0,
  startY: 0,
  startLeft: 0,
  startTop: 0
})

// 组合式API
const { 
  messages, 
  sendMessage: sendAIMessage, 
  quickActions,
  showQuickActions
} = useAIAssistant()

// 计算属性
const assistantName = computed(() => {
  return currentMode.value === 'customer' ? '智能客服小助手' : '运维智能助手'
})

const getAvatarClass = computed(() => {
  return currentMode.value === 'customer' 
    ? 'el-icon-user-solid' 
    : 'el-icon-monitor'
})

const windowStyle = computed(() => ({
  left: dragState.value.startLeft + 'px',
  top: dragState.value.startTop + 'px',
  zIndex: 9999
}))

// 方法
const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  dragState.value.startX = event.clientX
  dragState.value.startY = event.clientY
  dragState.value.startLeft = parseInt(windowStyle.value.left)
  dragState.value.startTop = parseInt(windowStyle.value.top)
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  const deltaX = event.clientX - dragState.value.startX
  const deltaY = event.clientY - dragState.value.startY
  
  dragState.value.startLeft += deltaX
  dragState.value.startTop += deltaY
  
  dragState.value.startX = event.clientX
  dragState.value.startY = event.clientY
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
}

const toggleMode = () => {
  currentMode.value = currentMode.value === 'customer' ? 'operations' : 'customer'
}

const sendMessage = async () => {
  if (!inputText.value.trim()) return
  
  isLoading.value = true
  try {
    await sendAIMessage(inputText.value, currentMode.value)
    inputText.value = ''
    scrollToBottom()
  } catch (error) {
    console.error('发送消息失败:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleVoiceInput = () => {
  isRecording.value = !isRecording.value
  // 语音识别逻辑
}

const toggleSentimentAnalysis = () => {
  sentimentAnalysisEnabled.value = !sentimentAnalysisEnabled.value
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
}

const getMessageAvatar = (role: string) => {
  switch (role) {
    case 'user': return 'el-icon-user'
    case 'assistant': 
      return currentMode.value === 'customer' 
        ? 'el-icon-user-solid' 
        : 'el-icon-monitor'
    case 'system': return 'el-icon-info'
    default: return 'el-icon-question'
  }
}

const formatMessage = (content: string) => {
  // 格式化消息内容，支持Markdown等
  return content.replace(/\n/g, '<br>')
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString()
}

const handleAction = (action: any) => {
  // 处理消息动作
  console.log('执行动作:', action)
}

const handleQuickAction = (action: any) => {
  inputText.value = action.prompt
  sendMessage()
}

const showSettings = () => {
  settingsVisible.value = true
}

const closeAssistant = () => {
  // 关闭助手逻辑
}

const handleModeChange = (mode: 'customer' | 'operations') => {
  currentMode.value = mode
}

const handleSettingsUpdate = (settings: any) => {
  // 更新设置
}

// 生命周期
onMounted(() => {
  // 初始化位置
  dragState.value.startLeft = window.innerWidth - 400
  dragState.value.startTop = window.innerHeight - 600
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.ai-assistant-floating {
  position: fixed;
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  user-select: none;
}

.ai-assistant-floating.customer-mode {
  border-top: 4px solid #67c23a;
}

.ai-assistant-floating.ops-mode {
  border-top: 4px solid #e6a23c;
}

.ai-assistant-floating.minimized {
  height: 60px;
  width: 200px;
}

.ai-assistant-floating.dragging {
  cursor: grabbing;
  opacity: 0.9;
}

.assistant-header {
  height: 50px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e4e7ed;
  cursor: move;
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.assistant-avatar {
  font-size: 18px;
  color: #409eff;
}

.assistant-name {
  font-weight: 600;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions i {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.header-actions i:hover {
  background-color: #e4e7ed;
}

.assistant-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  gap: 8px;
}

.message-item.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
  background: #f0f2f5;
  padding: 8px 12px;
  border-radius: 12px;
  position: relative;
}

.user-message .message-content {
  background: #409eff;
  color: white;
}

.message-text {
  word-wrap: break-word;
  line-height: 1.4;
}

.message-actions {
  margin-top: 8px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  text-align: right;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.input-container {
  border-top: 1px solid #e4e7ed;
  padding: 12px;
}

.input-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.input-toolbar i {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.input-toolbar i:hover {
  background-color: #f0f2f5;
}

.input-toolbar i.recording {
  color: #f56c6c;
  animation: pulse 1s infinite;
}

.input-toolbar i.active {
  color: #e6a23c;
}

.text-input-area {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.send-button {
  flex-shrink: 0;
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f0f2f5;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quick-action-item:hover {
  background: #e4e7ed;
}

.minimized-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: #409eff;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>
```text

---

## 🔧 后端服务设计

### 新增微服务：AI智能客服服务

#### 服务配置

```yaml
# application-ai-customer.yml
spring:
  application:
    name: ai-customer-service
  datasource:
    url: jdbc:postgresql://localhost:5432/ai_customer_db
    username: ai_customer_user
    password: ai_customer_pass
  
  redis:
    host: localhost
    port: 6379
    database: 5

ai:
  openai:
    api-key: ${OPENAI_API_KEY}
    base-url: https://api.openai.com/v1
    model: gpt-4
    max-tokens: 2000
    temperature: 0.7
  
  sentiment:
    enabled: true
    model-path: classpath:models/sentiment-model.bin
  
  learning:
    enabled: true
    knowledge-base-path: /data/ai-knowledge
    update-interval: 3600

server:
  port: 8086

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```text

#### 核心服务类

```java
@Service
@Slf4j
public class AICustomerService {
    
    @Autowired
    private DialogueManager dialogueManager;
    
    @Autowired
    private IntentRecognizer intentRecognizer;
    
    @Autowired
    private SentimentAnalyzer sentimentAnalyzer;
    
    @Autowired
    private KnowledgeRetriever knowledgeRetriever;
    
    @Autowired
    private SelfLearningEngine learningEngine;
    
    @Autowired
    private PredictionEngine predictionEngine;
    
    /**
     * 处理用户消息
     */
    public AssistantResponse processMessage(UserMessageRequest request) {
        try {
            // 1. 情感分析
            SentimentAnalysis sentiment = sentimentAnalyzer.analyze(request.getMessage());
            
            // 2. 意图识别
            IntentResult intent = intentRecognizer.recognize(request.getMessage(), request.getContext());
            
            // 3. 知识检索
            List<KnowledgeItem> knowledge = knowledgeRetriever.retrieve(intent, request.getMode());
            
            // 4. 对话管理
            DialogueResponse dialogueResponse = dialogueManager.process(
                request, intent, sentiment, knowledge);
            
            // 5. 预测分析
            PredictionResult prediction = predictionEngine.predictNextActions(request, intent);
            
            // 6. 学习更新
            learningEngine.learnFromInteraction(request, dialogueResponse);
            
            return buildAssistantResponse(dialogueResponse, prediction, sentiment);
            
        } catch (Exception e) {
            log.error("处理AI客服消息失败", e);
            return buildErrorResponse(e);
        }
    }
    
    /**
     * 获取快捷操作
     */
    public List<QuickAction> getQuickActions(String mode, UserContext context) {
        return predictionEngine.predictQuickActions(mode, context);
    }
    
    /**
     * 切换客服模式
     */
    public void switchMode(String userId, String mode) {
        // 更新用户模式偏好
        learningEngine.updateUserPreference(userId, "mode", mode);
    }
    
    /**
     * 获取学习报告
     */
    public LearningReport getLearningReport(String mode) {
        return learningEngine.generateReport(mode);
    }
}

/**
 * 对话管理服务
 */
@Service
public class DialogueManager {
    
    @Autowired
    private LLMIntegrationService llmService;
    
    @Autowired
    private DialogueHistoryService historyService;
    
    @Autowired
    private ActionExecutor actionExecutor;
    
    public DialogueResponse process(UserMessageRequest request, 
                                   IntentResult intent, 
                                   SentimentAnalysis sentiment,
                                   List<KnowledgeItem> knowledge) {
        
        // 构建对话上下文
        DialogueContext context = buildContext(request, intent, sentiment, knowledge);
        
        // 调用大语言模型
        LLMResponse llmResponse = llmService.generateResponse(context);
        
        // 执行相关动作
        List<ActionResult> actionResults = executeActions(llmResponse.getActions());
        
        // 保存对话历史
        historyService.saveInteraction(request, llmResponse, actionResults);
        
        return buildDialogueResponse(llmResponse, actionResults);
    }
    
    private DialogueContext buildContext(UserMessageRequest request, 
                                       IntentResult intent,
                                       SentimentAnalysis sentiment,
                                       List<KnowledgeItem> knowledge) {
        
        DialogueContext context = new DialogueContext();
        context.setUserMessage(request.getMessage());
        context.setUserContext(request.getContext());
        context.setMode(request.getMode());
        context.setIntent(intent);
        context.setSentiment(sentiment);
        context.setKnowledge(knowledge);
        context.setDialogueHistory(historyService.getRecentHistory(request.getUserId()));
        context.setSystemTime(LocalDateTime.now());
        
        return context;
    }
    
    private List<ActionResult> executeActions(List<Action> actions) {
        return actions.stream()
            .map(actionExecutor::execute)
            .collect(Collectors.toList());
    }
}

/**
 * 情感分析服务
 */
@Service
public class SentimentAnalyzer {
    
    @Autowired
    private SentimentModel sentimentModel;
    
    @Autowired
    private EmotionDetector emotionDetector;
    
    public SentimentAnalysis analyze(String message) {
        SentimentAnalysis analysis = new SentimentAnalysis();
        
        // 文本情感分析
        TextSentiment textSentiment = sentimentModel.analyzeText(message);
        analysis.setTextSentiment(textSentiment);
        
        // 情感强度计算
        analysis.setIntensity(calculateIntensity(textSentiment));
        
        // 情感标签
        analysis.setEmotionTags(extractEmotionTags(message));
        
        // 响应建议
        analysis.setResponseSuggestions(generateResponseSuggestions(textSentiment));
        
        return analysis;
    }
    
    public SentimentAnalysis analyzeWithVoice(String audioData) {
        // 语音情感分析
        VoiceEmotion voiceEmotion = emotionDetector.detectFromAudio(audioData);
        // 结合文本和语音情感
        return combineSentiments(voiceEmotion);
    }
}

/**
 * 自主学习引擎
 */
@Service
public class SelfLearningEngine {
    
    @Autowired
    private KnowledgeBaseService knowledgeBase;
    
    @Autowired
    private BehaviorAnalyzer behaviorAnalyzer;
    
    @Autowired
    private ModelUpdater modelUpdater;
    
    public void learnFromInteraction(UserMessageRequest request, 
                                   DialogueResponse response) {
        // 1. 更新用户行为模型
        behaviorAnalyzer.recordInteraction(request, response);
        
        // 2. 知识库更新
        updateKnowledgeBase(request, response);
        
        // 3. 模型参数调整
        modelUpdater.updateBasedOnFeedback(request, response);
        
        // 4. 模式识别
        detectPatterns(request, response);
    }
    
    public LearningReport generateReport(String mode) {
        LearningReport report = new LearningReport();
        report.setMode(mode);
        report.setLearningStats(getLearningStatistics(mode));
        report.setKnowledgeGrowth(getKnowledgeGrowth(mode));
        report.setPerformanceMetrics(getPerformanceMetrics(mode));
        report.setImprovementSuggestions(getImprovementSuggestions(mode));
        
        return report;
    }
    
    private void updateKnowledgeBase(UserMessageRequest request, 
                                   DialogueResponse response) {
        // 提取新知识
        List<NewKnowledge> newKnowledge = extractNewKnowledge(request, response);
        
        // 验证知识质量
        List<NewKnowledge> validatedKnowledge = validateKnowledge(newKnowledge);
        
        // 更新知识库
        knowledgeBase.addKnowledge(validatedKnowledge);
    }
}

/**
 * 预测分析引擎
 */
@Service
public class PredictionEngine {
    
    @Autowired
    private UserBehaviorRepository behaviorRepository;
    
    @Autowired
    private PatternRecognizer patternRecognizer;
    
    @Autowired
    private RecommendationEngine recommendationEngine;
    
    public PredictionResult predictNextActions(UserMessageRequest request, 
                                             IntentResult intent) {
        
        PredictionResult prediction = new PredictionResult();
        
        // 用户行为预测
        List<PredictedAction> predictedActions = predictUserActions(request, intent);
        prediction.setPredictedActions(predictedActions);
        
        // 问题预测
        List<PredictedQuestion> predictedQuestions = predictUserQuestions(request);
        prediction.setPredictedQuestions(predictedQuestions);
        
        // 需求预测
        List<PredictedNeed> predictedNeeds = predictUserNeeds(request);
        prediction.setPredictedNeeds(predictedNeeds);
        
        return prediction;
    }
    
    public List<QuickAction> predictQuickActions(String mode, UserContext context) {
        List<QuickAction> quickActions = new ArrayList<>();
        
        // 基于模式的快捷操作
        quickActions.addAll(getModeSpecificActions(mode));
        
        // 基于用户行为的快捷操作
        quickActions.addAll(getBehaviorBasedActions(context));
        
        // 基于情境的快捷操作
        quickActions.addAll(getContextBasedActions(context));
        
        return quickActions.stream()
            .distinct()
            .limit(6) // 限制数量
            .collect(Collectors.toList());
    }
    
    private List<QuickAction> getModeSpecificActions(String mode) {
        if ("customer".equals(mode)) {
            return Arrays.asList(
                new QuickAction("查询订单", "el-icon-tickets", "我想查询我的订单"),
                new QuickAction("菜品推荐", "el-icon-star-on", "推荐一些热门菜品"),
                new QuickAction("投诉建议", "el-icon-chat-line-round", "我要提出建议"),
                new QuickAction("会员服务", "el-icon-user", "会员权益咨询")
            );
        } else {
            return Arrays.asList(
                new QuickAction("系统状态", "el-icon-monitor", "查看系统运行状态"),
                new QuickAction("性能监控", "el-icon-data-analysis", "系统性能报告"),
                new QuickAction("异常告警", "el-icon-warning", "查看系统告警"),
                new QuickAction("运维日志", "el-icon-document", "查看运维日志")
            );
        }
    }
}
```text

---

## 🗄️ 数据库设计扩展

### 新增数据表

```sql
-- AI客服对话记录表
CREATE TABLE ai_conversations (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_id BIGINT NOT NULL,
    mode VARCHAR(20) NOT NULL, -- 'customer' or 'operations'
    user_message TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    intent VARCHAR(100),
    sentiment_score DECIMAL(3,2),
    emotion_tags JSONB,
    context_data JSONB,
    actions_executed JSONB,
    response_time_ms INTEGER,
    user_rating INTEGER, -- 用户评分 1-5
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_ai_conversations_session ON ai_conversations(session_id);
CREATE INDEX idx_ai_conversations_user_mode ON ai_conversations(user_id, mode);
CREATE INDEX idx_ai_conversations_created ON ai_conversations(created_at);

-- AI知识库表
CREATE TABLE ai_knowledge_base (
    id BIGSERIAL PRIMARY KEY,
    question_pattern TEXT NOT NULL,
    answer_template TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags JSONB,
    confidence_score DECIMAL(3,2) DEFAULT 1.0,
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(4,3) DEFAULT 1.0,
    mode VARCHAR(20) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户行为分析表
CREATE TABLE ai_user_behavior (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    behavior_type VARCHAR(50) NOT NULL,
    behavior_data JSONB NOT NULL,
    mode VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 情感分析记录表
CREATE TABLE ai_sentiment_analysis (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT REFERENCES ai_conversations(id),
    text_sentiment VARCHAR(20),
    voice_sentiment VARCHAR(20),
    combined_sentiment VARCHAR(20),
    intensity_score DECIMAL(3,2),
    emotion_tags JSONB,
    analysis_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学习轨迹表
CREATE TABLE ai_learning_trajectory (
    id BIGSERIAL PRIMARY KEY,
    model_version VARCHAR(50) NOT NULL,
    learning_type VARCHAR(50) NOT NULL,
    before_metrics JSONB,
    after_metrics JSONB,
    improvement_score DECIMAL(4,3),
    learning_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 预测分析表
CREATE TABLE ai_predictions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    prediction_type VARCHAR(50) NOT NULL,
    predicted_actions JSONB,
    confidence_scores JSONB,
    context_data JSONB,
    actual_outcome JSONB,
    accuracy_score DECIMAL(4,3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```text

---

## 🔗 API接口设计

### AI客服API

```java
@RestController
@RequestMapping("/api/v1/ai-assistant")
@Validated
@Api(tags = "AI智能客服")
public class AICustomerController {
    
    @Autowired
    private AICustomerService aiCustomerService;
    
    @PostMapping("/chat")
    @ApiOperation("发送消息给AI助手")
    public ApiResponse<AssistantResponse> chat(
            @RequestBody @Valid UserMessageRequest request) {
        
        AssistantResponse response = aiCustomerService.processMessage(request);
        return ApiResponse.success(response);
    }
    
    @GetMapping("/quick-actions")
    @ApiOperation("获取快捷操作")
    public ApiResponse<List<QuickAction>> getQuickActions(
            @RequestParam String mode,
            @RequestParam(required = false) String context) {
        
        UserContext userContext = parseContext(context);
        List<QuickAction> actions = aiCustomerService.getQuickActions(mode, userContext);
        return ApiResponse.success(actions);
    }
    
    @PostMapping("/switch-mode")
    @ApiOperation("切换客服模式")
    public ApiResponse<Boolean> switchMode(
            @RequestParam String userId,
            @RequestParam String mode) {
        
        aiCustomerService.switchMode(userId, mode);
        return ApiResponse.success(true);
    }
    
    @GetMapping("/learning-report")
    @ApiOperation("获取学习报告")
    public ApiResponse<LearningReport> getLearningReport(
            @RequestParam String mode) {
        
        LearningReport report = aiCustomerService.getLearningReport(mode);
        return ApiResponse.success(report);
    }
    
    @PostMapping("/feedback")
    @ApiOperation("提交反馈")
    public ApiResponse<Boolean> submitFeedback(
            @RequestBody @Valid FeedbackRequest request) {
        
        aiCustomerService.processFeedback(request);
        return ApiResponse.success(true);
    }
}

// DTO定义
@Data
@ApiModel("用户消息请求")
public class UserMessageRequest {
    @ApiModelProperty(value = "用户ID", required = true)
    @NotBlank
    private String userId;
    
    @ApiModelProperty(value = "消息内容", required = true)
    @NotBlank
    private String message;
    
    @ApiModelProperty(value = "客服模式", required = true)
    @Pattern(regexp = "customer|operations")
    private String mode;
    
    @ApiModelProperty("上下文信息")
    private Map<String, Object> context;
    
    @ApiModelProperty("语音数据")
    private String audioData;
    
    @ApiModelProperty("图像数据")
    private String imageData;
}

@Data
@ApiModel("助手响应")
public class AssistantResponse {
    @ApiModelProperty("回复内容")
    private String response;
    
    @ApiModelProperty("情感分析结果")
    private SentimentAnalysis sentiment;
    
    @ApiModelProperty("意图识别结果")
    private IntentResult intent;
    
    @ApiModelProperty("执行的动作")
    private List<ActionResult> actions;
    
    @ApiModelProperty("预测结果")
    private PredictionResult predictions;
    
    @ApiModelProperty("快捷操作")
    private List<QuickAction> quickActions;
    
    @ApiModelProperty("响应时间")
    private Long responseTime;
}

@Data
@ApiModel("快捷操作")
public class QuickAction {
    @ApiModelProperty("操作标签")
    private String label;
    
    @ApiModelProperty("图标")
    private String icon;
    
    @ApiModelProperty("提示文本")
    private String prompt;
    
    @ApiModelProperty("动作类型")
    private String actionType;
    
    @ApiModelProperty("目标URL")
    private String targetUrl;
}

@Data
@ApiModel("学习报告")
public class LearningReport {
    @ApiModelProperty("报告模式")
    private String mode;
    
    @ApiModelProperty("学习统计")
    private LearningStats learningStats;
    
    @ApiModelProperty("知识增长")
    private KnowledgeGrowth knowledgeGrowth;
    
    @ApiModelProperty("性能指标")
    private PerformanceMetrics performanceMetrics;
    
    @ApiModelProperty("改进建议")
    private List<ImprovementSuggestion> improvementSuggestions;
}
```text

---

## 🎯 权限控制系统

### 权限设计

```java
@Service
public class AIPermissionService {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private RoleService roleService;
    
    /**
     * 检查AI助手权限
     */
    public boolean checkAIAccessPermission(String userId, String mode) {
        User user = userService.getUserById(userId);
        
        if ("operations".equals(mode)) {
            // 运维模式需要特殊权限
            return hasOperationsPermission(user);
        }
        
        // 客服模式对所有用户开放
        return true;
    }
    
    /**
     * 检查功能访问权限
     */
    public boolean checkFeaturePermission(String userId, String feature) {
        User user = userService.getUserById(userId);
        Set<String> userPermissions = roleService.getUserPermissions(user.getId());
        
        // AI助手功能权限映射
        Map<String, String> featurePermissionMap = getFeaturePermissionMap();
        String requiredPermission = featurePermissionMap.get(feature);
        
        return requiredPermission == null || userPermissions.contains(requiredPermission);
    }
    
    /**
     * 获取用户可用的AI功能
     */
    public List<AIFeature> getAvailableFeatures(String userId) {
        User user = userService.getUserById(userId);
        Set<String> userPermissions = roleService.getUserPermissions(user.getId());
        
        return getAllAIFeatures().stream()
            .filter(feature -> hasPermissionForFeature(feature, userPermissions))
            .collect(Collectors.toList());
    }
    
    private boolean hasOperationsPermission(User user) {
        return user.getRoles().stream()
            .anyMatch(role -> role.getCode().startsWith("OPS_"));
    }
    
    private Map<String, String> getFeaturePermissionMap() {
        Map<String, String> map = new HashMap<>();
        map.put("system_monitoring", "OPS_MONITORING");
        map.put("performance_analysis", "OPS_ANALYSIS");
        map.put("log_viewing", "OPS_LOGS");
        map.put("user_management", "ADMIN_USER");
        // ... 更多权限映射
        return map;
    }
}
```text

---

## 🔧 配置与部署

### Docker配置

```yaml
# docker-compose-ai.yml
version: '3.8'

services:
  # AI客服服务
  ai-customer-service:
    build:
      context: ./ai-customer-service
      dockerfile: Dockerfile
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_HOST=redis
      - POSTGRES_HOST=postgres
    ports:
      - "8086:8086"
    depends_on:
      - redis
      - postgres
    volumes:
      - ai_models:/app/models
      - ai_knowledge:/app/knowledge
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8086/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # 情感分析服务
  ai-sentiment-service:
    build:
      context: ./ai-sentiment-service
      dockerfile: Dockerfile
    environment:
      - MODEL_PATH=/app/models/sentiment
    volumes:
      - ai_models:/app/models

volumes:
  ai_models:
  ai_knowledge:
```text

### Kubernetes配置

```yaml
# ai-customer-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-customer-service
  labels:
    app: ai-customer-service
    version: v1.0.0
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ai-customer-service
  template:
    metadata:
      labels:
        app: ai-customer-service
        version: v1.0.0
    spec:
      containers:
      - name: ai-customer-service
        image: registry.example.com/smart-restaurant/ai-customer-service:v1.0.0
        ports:
        - containerPort: 8086
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: ai-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        volumeMounts:
        - name: ai-models
          mountPath: /app/models
        - name: ai-knowledge
          mountPath: /app/knowledge
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8086
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8086
          initialDelaySeconds: 30
          periodSeconds: 5
      volumes:
      - name: ai-models
        persistentVolumeClaim:
          claimName: ai-models-pvc
      - name: ai-knowledge
        persistentVolumeClaim:
          claimName: ai-knowledge-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: ai-customer-service
spec:
  selector:
    app: ai-customer-service
  ports:
  - port: 8086
    targetPort: 8086
  type: ClusterIP
```text

---

## 📊 监控与指标

### 自定义指标

```java
@Component
public class AIMetrics {
    
    private final MeterRegistry meterRegistry;
    
    // 对话相关指标
    private final Counter totalConversations;
    private final Counter failedConversations;
    private final Timer responseTimeTimer;
    private final Gauge sentimentScoreGauge;
    
    // 学习相关指标
    private final Counter learningUpdates;
    private final Gauge knowledgeBaseSize;
    private final Gauge modelAccuracy;
    
    public AIMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        
        this.totalConversations = Counter.builder("ai.conversations.total")
            .description("总对话数量")
            .register(meterRegistry);
            
        this.failedConversations = Counter.builder("ai.conversations.failed")
            .description("失败对话数量")
            .register(meterRegistry);
            
        this.responseTimeTimer = Timer.builder("ai.response.time")
            .description("响应时间分布")
            .register(meterRegistry);
            
        this.sentimentScoreGauge = Gauge.builder("ai.sentiment.score")
            .description("情感分析得分")
            .register(meterRegistry);
            
        this.learningUpdates = Counter.builder("ai.learning.updates")
            .description("学习更新次数")
            .register(meterRegistry);
            
        this.knowledgeBaseSize = Gauge.builder("ai.knowledge.size")
            .description("知识库大小")
            .register(meterRegistry);
            
        this.modelAccuracy = Gauge.builder("ai.model.accuracy")
            .description("模型准确率")
            .register(meterRegistry);
    }
    
    public void recordConversation(boolean success, long responseTime, double sentimentScore) {
        totalConversations.increment();
        if (!success) {
            failedConversations.increment();
        }
        responseTimeTimer.record(responseTime, TimeUnit.MILLISECONDS);
        sentimentScoreGauge.set(sentimentScore);
    }
    
    public void recordLearningUpdate(int newKnowledgeItems) {
        learningUpdates.increment();
        knowledgeBaseSize.set(knowledgeBaseSize.value() + newKnowledgeItems);
    }
}
```text

---

## 🚀 集成与使用

### 前端集成

```typescript
// main.ts - 全局注册AI助手
import { createApp } from 'vue'
import AIAssistant from '@/components/AIAssistant/AIAssistant.vue'

const app = createApp(App)

// 全局注册AI助手组件
app.component('AIAssistant', AIAssistant)

app.mount('#app')
```text

```vue
<!-- App.vue - 全局使用 -->
<template>
  <div id="app">
    <router-view />
    <!-- 全局AI助手 -->
    <AIAssistant />
  </div>
</template>
```text

### 使用示例

```typescript
// 在任意组件中与AI助手交互
const openAIAssistant = (mode: 'customer' | 'operations' = 'customer') => {
  const assistant = document.querySelector('ai-assistant') as any
  if (assistant) {
    assistant.setMode(mode)
    assistant.show()
  }
}

// 一键跳转功能
const jumpToFeature = (feature: string, params?: any) => {
  const assistant = document.querySelector('ai-assistant') as any
  if (assistant) {
    assistant.executeAction({
      type: 'navigate',
      target: feature,
      params: params
    })
  }
}
```text

---

## 📈 价值与成效

### 业务价值

```yaml
客户服务提升:
  ✅ 24/7智能客服: 全天候客户服务支持
  ✅ 个性化体验: 基于用户历史的个性化服务
  ✅ 多模态交互: 文本、语音、图像全方位服务
  ✅ 情感智能: 情感识别和适应性响应

运维效率提升:
  🔹 智能运维助手: 运维问题智能诊断和解决
  🔹 预测性维护: 系统问题预测和预防
  🔹 知识积累: 运维经验自动学习和传承
  🔹 效率提升: 减少人工运维工作量

技术价值:
  🔸 AI技术集成: 先进的AI技术落地应用
  🔸 自主学习: 系统持续进化和改进
  🔸 可扩展架构: 支持未来功能扩展
  🔸 标准化接口: 统一的AI服务接口
```text

### 成效指标

```python
success_metrics = {
    'customer_satisfaction': {
        'target': '提升25%',
        'measure': '用户满意度调查'
    },
    'response_time': {
        'target': '<3秒',
        'measure': '平均响应时间'
    },
    'issue_resolution_rate': {
        'target': '提升40%',
        'measure': '问题一次性解决率'
    },
    'operational_efficiency': {
        'target': '提升35%',
        'measure': '运维工作效率'
    },
    'knowledge_growth': {
        'target': '每月增长15%',
        'measure': '知识库增长速率'
    }
}
```text

---

## 🎯 总结

这个AI智能客服系统作为顶层自治单元，为智能餐饮系统提供了：

### 🌟 核心特性

- **浮动可拖拽**: 独立的Web组件，全局可访问
- **多模态交互**: 支持文本、语音、图像等多种交互方式
- **情感智能**: 情感识别和适应性响应
- **自主学习**: 持续从对话中学习和改进
- **智能预测**: 用户意图和行为预测
- **权限分离**: 客服模式和运维模式分离

### 🏗️ 技术实现

- **微服务架构**: 独立的AI客服服务集群
- **大模型集成**: 集成先进的AI大语言模型
- **实时通信**: WebSocket和SSE实时交互
- **知识管理**: 完整的知识学习和检索系统
- **监控运维**: 完整的监控和运维支持

### 📊 业务价值

- **客户服务升级**: 提供智能化的客户服务体验
- **运维效率提升**: 智能化的运维支持和问题解决
- **知识积累**: 系统化的知识管理和传承
- **持续进化**: 基于学习的持续改进和优化

这个AI智能客服系统将成为整个智能餐饮系统的智能交互入口，为用户和运维人员提供全方位的智能支持服务。

**立即集成这个强大的AI智能客服系统，提升您的餐饮智能化水平！** 🚀


