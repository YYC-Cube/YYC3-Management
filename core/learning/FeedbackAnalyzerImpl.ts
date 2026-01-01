import {
  UserFeedback,
  FeedbackAnalysis,
  UserPreferences
} from './types';

export class FeedbackAnalyzerImpl {
  async analyze(feedback: UserFeedback): Promise<FeedbackAnalysis> {
    const improvements: string[] = [];
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let preferenceUpdates: UserPreferences | undefined;

    if (feedback.rating >= 4) {
      sentiment = 'positive';
    } else if (feedback.rating <= 2) {
      sentiment = 'negative';
      improvements.push('回答质量需要提升');
      improvements.push('建议提供更详细的信息');
    }

    if (feedback.comment) {
      const comment = feedback.comment.toLowerCase();
      if (comment.includes('太长') || comment.includes('冗长')) {
        improvements.push('建议缩短回答长度');
        preferenceUpdates = {
          communicationStyle: 'casual',
          responseLength: 'short',
          topics: [],
          avoidTopics: []
        };
      } else if (comment.includes('太短') || comment.includes('不够详细')) {
        improvements.push('建议提供更详细的回答');
        preferenceUpdates = {
          communicationStyle: 'technical',
          responseLength: 'long',
          topics: [],
          avoidTopics: []
        };
      }
    }

    return {
      suggestedImprovements: improvements,
      preferenceUpdates,
      sentiment
    };
  }
}
