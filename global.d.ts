/**
 * @fileoverview 全局类型声明
 * @description 为Next.js和核心库提供类型声明
 * @remarks 使用三重斜杠指令引用核心类型定义
 */

/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

// Next.js 编译输出模块声明
declare module '../../../../app/advanced-bi/page.js' {
  const value: any;
  export default value;
}

declare module '../../../../app/about/page.js' {
  const value: any;
  export default value;
}

declare module '../../../../app/admin/page.js' {
  const value: any;
  export default value;
}

declare module '../../../../app/ai-consultant/page.js' {
  const value: any;
  export default value;
}

declare module '../../../../app/analytics/page.js' {
  const value: any;
  export default value;
}

// 通用模式声明
declare module '../../../../app/*/*.js' {
  const value: any;
  export default value;
}

declare module '../../../../app/**/**.js' {
  const value: any;
  export default value;
}
