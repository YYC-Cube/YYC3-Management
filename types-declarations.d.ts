/**
 * @fileoverview 第三方测试库类型声明
 * @description 为测试相关库提供类型声明，避免TypeScript编译警告
 * @remarks 这些库用于测试环境，不影响生产代码
 */

// 测试框架和工具
declare module 'aria-query';
declare module 'benchmark';
declare module 'chai';
declare module 'deep-eql';
declare module 'estree';

// Babel相关
declare module 'babel__core';
declare module 'babel__generator';
declare module 'babel__template';
declare module 'babel__traverse';

// D3可视化库
declare module 'd3-array';
declare module 'd3-color';
declare module 'd3-ease';
declare module 'd3-interpolate';
declare module 'd3-path';
declare module 'd3-scale';
declare module 'd3-shape';
declare module 'd3-time';
declare module 'd3-timer';

// Istanbul代码覆盖率
declare module 'istanbul-lib-coverage';
declare module 'istanbul-lib-report';
declare module 'istanbul-reports';

// JSON处理
declare module 'json-schema';
declare module 'json5';

// Node.js (通常由@types/node提供，但为了兼容性声明)
declare module 'node';

// React相关 (通常由@types/react和@types/react-dom提供)
declare module 'react';
declare module 'react-dom';
declare module 'prop-types';
declare module 'use-sync-external-store';

// Testing Library
declare module 'testing-library__react';

// Yargs命令行工具
declare module 'yargs';
declare module 'yargs-parser';
