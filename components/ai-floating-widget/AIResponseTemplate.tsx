'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, Code, List, Grid3x3, ExternalLink, Copy, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface AIResponseTemplate {
  type: 'text' | 'code' | 'list' | 'table' | 'action' | 'card' | 'timeline' | 'status' | 'tool_call';
  content: string;
  data?: any;
  actions?: ResponseAction[];
  metadata?: {
    confidence?: number;
    timestamp?: Date;
    model?: string;
  };
}

export interface ResponseAction {
  label: string;
  type: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning';
  icon?: React.ReactNode;
  action: () => void;
}

interface AIResponseTemplateProps {
  template: AIResponseTemplate;
}

export const AIResponseTemplateRenderer: React.FC<AIResponseTemplateProps> = ({ template }) => {
  switch (template.type) {
    case 'code':
      return <CodeResponse template={template} />;
    case 'list':
      return <ListResponse template={template} />;
    case 'table':
      return <TableResponse template={template} />;
    case 'action':
      return <ActionResponse template={template} />;
    case 'card':
      return <CardResponse template={template} />;
    case 'timeline':
      return <TimelineResponse template={template} />;
    case 'status':
      return <StatusResponse template={template} />;
    case 'tool_call':
      return <ToolCallResponse template={template} />;
    default:
      return <TextResponse template={template} />;
  }
};

const TextResponse: React.FC<{ template: AIResponseTemplate }> = ({ template }) => (
  <div className="space-y-2">
    <p className="text-sm whitespace-pre-wrap leading-relaxed">{template.content}</p>
    {template.metadata?.confidence && (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>置信度: {(template.metadata.confidence * 100).toFixed(1)}%</span>
        {template.metadata.model && <Badge variant="outline">{template.metadata.model}</Badge>}
      </div>
    )}
  </div>
);

const CodeResponse: React.FC<{ template: AIResponseTemplate }> = ({ template }) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(template.content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: template.content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', language: match[1] || 'plaintext', content: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < template.content.length) {
    parts.push({ type: 'text', content: template.content.slice(lastIndex) });
  }

  return (
    <div className="space-y-2">
      {parts.map((part, index) => (
        <div key={index}>
          {part.type === 'text' ? (
            <p className="text-sm whitespace-pre-wrap">{part.content}</p>
          ) : (
            <div className="relative group">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => navigator.clipboard.writeText(part.content)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="bg-muted rounded-lg p-3 overflow-x-auto text-xs font-mono">
                <code className={part.language}>{part.content}</code>
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ListResponse: React.FC<{ template: AIResponseTemplate }> = ({ template }) => {
  const items = template.data?.items || [];
  const listType = template.data?.listType || 'bullet';

  return (
    <div className="space-y-2">
      {template.content && <p className="text-sm">{template.content}</p>}
      <div className={listType === 'bullet' ? 'list-disc pl-4 space-y-1' : 'list-decimal pl-4 space-y-1'}>
        {items.map((item: any, index: number) => (
          <li key={index} className="text-sm">
            {typeof item === 'string' ? item : (
              <div className="flex items-start gap-2">
                {item.icon && <span className="text-primary">{item.icon}</span>}
                <span>{item.text}</span>
                {item.badge && <Badge variant="secondary" className="ml-2">{item.badge}</Badge>}
              </div>
            )}
          </li>
        ))}
      </div>
    </div>
  );
};

const TableResponse: React.FC<{ template: AIResponseTemplate }> = ({ template }) => {
  const { headers, rows } = template.data || {};

  return (
    <div className="space-y-2">
      {template.content && <p className="text-sm">{template.content}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              {headers?.map((header: string, index: number) => (
                <th key={index} className="text-left py-2 px-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.map((row: any[], rowIndex: number) => (
              <tr key={rowIndex} className="border-b last:border-0">
                {row.map((cell: any, cellIndex: number) => (
                  <td key={cellIndex} className="py-2 px-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ActionResponse: React.FC<{ template: AIResponseTemplate }> = ({ template }) => {
  const actions = template.actions || [];

  return (
    <div className="space-y-3">
      {template.content && <p className="text-sm">{template.content}</p>}
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.type}
            size="sm"
            onClick={action.action}
            className="flex items-center gap-2"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

const CardResponse: React.FC<{ template: AIResponseTemplate }> = ({ template }) => {
  const cards = template.data?.cards || [];

  return (
    <div className="space-y-2">
      {template.content && <p className="text-sm">{template.content}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map((card: any, index: number) => (
          <div key={index} className="border rounded-lg p-3 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{card.title}</h4>
              {card.icon && <span className="text-primary">{card.icon}</span>}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{card.description}</p>
            {card.metadata && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(card.metadata).map(([key, value]: [string, any]) => (
                  <Badge key={key} variant="outline" className="text-xs">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TimelineResponse: React.FC<{ template: AIResponseTemplate }> = ({ template }) => {
  const events = template.data?.events || [];

  return (
    <div className="space-y-2">
      {template.content && <p className="text-sm">{template.content}</p>}
      <div className="relative pl-4 border-l-2 border-primary/20">
        {events.map((event: any, index: number) => (
          <div key={index} className="relative pb-4 last:pb-0">
            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ${
              event.status === 'completed' ? 'bg-green-500' :
              event.status === 'pending' ? 'bg-yellow-500' :
              event.status === 'error' ? 'bg-red-500' : 'bg-primary'
            }`} />
            <div className="ml-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{event.title}</span>
                {event.badge && <Badge variant="outline" className="text-xs">{event.badge}</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{event.description}</p>
              {event.timestamp && (
                <span className="text-xs text-muted-foreground mt-1 block">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusResponse: React.FC<{ template: AIResponseTemplate }> = ({ template }) => {
  const status = template.data?.status || 'info';
  const statusConfig = {
    success: { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    warning: { icon: AlertCircle, color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
    error: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
    info: { icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.info;
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${config.bgColor}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.color}`} />
      <div className="flex-1 space-y-1">
        {template.data?.title && (
          <h4 className="font-medium text-sm">{template.data.title}</h4>
        )}
        <p className="text-sm text-muted-foreground">{template.content}</p>
        {template.data?.details && (
          <div className="text-xs text-muted-foreground mt-2">
            {template.data.details}
          </div>
        )}
      </div>
    </div>
  );
};

const ToolCallResponse: React.FC<{ template: AIResponseTemplate }> = ({ template }) => {
  const toolCalls = template.data?.toolCalls || [];

  return (
    <div className="space-y-2">
      {template.content && <p className="text-sm">{template.content}</p>}
      <div className="space-y-2">
        {toolCalls.map((toolCall: any, index: number) => (
          <div key={index} className="border rounded-lg p-3 bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{toolCall.name}</span>
              {toolCall.status && (
                <Badge variant={toolCall.status === 'success' ? 'default' : toolCall.status === 'error' ? 'destructive' : 'outline'} className="text-xs">
                  {toolCall.status}
                </Badge>
              )}
            </div>
            {toolCall.arguments && (
              <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
                {typeof toolCall.arguments === 'string' ? toolCall.arguments : JSON.stringify(toolCall.arguments, null, 2)}
              </pre>
            )}
            {toolCall.result && (
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">结果: </span>
                <pre className="text-xs bg-background p-2 rounded overflow-x-auto mt-1">
                  {typeof toolCall.result === 'string' ? toolCall.result : JSON.stringify(toolCall.result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIResponseTemplateRenderer;
