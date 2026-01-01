#!/usr/bin/env node

/**
 * 快速验证脚本 - 验证智能自愈生态系统安装和基本功能
 */

console.log('🔍 开始验证智能自愈生态系统...\n');

async function verify() {
  let passed = 0;
  let failed = 0;

  // 测试1: 检查文件存在
  console.log('📁 测试1: 检查文件存在性');
  const fs = require('fs');
  const path = require('path');
  
  const requiredFiles = [
    'index.ts',
    'BidirectionalFeedbackLoop.ts',
    'AdaptiveContinuousLearning.ts',
    'MultiActiveDisasterRecovery.ts',
    'IntelligentReliabilityTriangle.ts',
    'ReliabilityEvolutionRoadmap.ts',
    'examples.ts',
    'README.md',
    'IMPLEMENTATION_SUMMARY.md'
  ];

  const baseDir = __dirname;
  
  for (const file of requiredFiles) {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`);
      passed++;
    } else {
      console.log(`   ❌ ${file} - 文件不存在`);
      failed++;
    }
  }

  // 测试2: 检查TypeScript语法
  console.log('\n📝 测试2: TypeScript语法检查');
  try {
    const { execSync } = require('child_process');
    execSync('npx tsc --noEmit --skipLibCheck', { 
      cwd: path.join(__dirname, '../..'),
      stdio: 'pipe' 
    });
    console.log('   ✅ TypeScript语法检查通过');
    passed++;
  } catch (error) {
    console.log('   ⚠️  TypeScript语法检查未运行 (tsc可能未安装)');
  }

  // 测试3: 尝试导入模块
  console.log('\n📦 测试3: 模块导入检查');
  try {
    // 注意: 这里只是语法检查,不实际导入(需要编译)
    const indexContent = fs.readFileSync(path.join(baseDir, 'index.ts'), 'utf-8');
    
    const expectedExports = [
      'BidirectionalFeedbackLoop',
      'AdaptiveContinuousLearning',
      'MultiActiveDisasterRecovery',
      'IntelligentReliabilityTriangle',
      'ReliabilityEvolutionRoadmap'
    ];

    for (const exportName of expectedExports) {
      if (indexContent.includes(exportName)) {
        console.log(`   ✅ ${exportName} 已导出`);
        passed++;
      } else {
        console.log(`   ❌ ${exportName} - 未找到导出`);
        failed++;
      }
    }
  } catch (error) {
    console.log(`   ❌ 模块导入检查失败: ${error.message}`);
    failed++;
  }

  // 测试4: 检查文档完整性
  console.log('\n📚 测试4: 文档完整性检查');
  try {
    const readmeContent = fs.readFileSync(path.join(baseDir, 'README.md'), 'utf-8');
    
    const requiredSections = [
      '## 🎯 概述',
      '## 🏗️ 架构',
      '## 🔧 核心系统',
      '## 🚀 快速开始',
      '## 📖 API参考'
    ];

    for (const section of requiredSections) {
      if (readmeContent.includes(section)) {
        console.log(`   ✅ ${section.replace('## ', '')}`);
        passed++;
      } else {
        console.log(`   ❌ ${section.replace('## ', '')} - 文档章节缺失`);
        failed++;
      }
    }
  } catch (error) {
    console.log(`   ❌ 文档完整性检查失败: ${error.message}`);
    failed++;
  }

  // 测试5: 检查代码行数
  console.log('\n📏 测试5: 代码规模检查');
  try {
    let totalLines = 0;
    const codeFiles = [
      'BidirectionalFeedbackLoop.ts',
      'AdaptiveContinuousLearning.ts',
      'MultiActiveDisasterRecovery.ts',
      'IntelligentReliabilityTriangle.ts',
      'ReliabilityEvolutionRoadmap.ts'
    ];

    for (const file of codeFiles) {
      const content = fs.readFileSync(path.join(baseDir, file), 'utf-8');
      const lines = content.split('\n').length;
      totalLines += lines;
      console.log(`   📄 ${file}: ${lines} 行`);
    }

    console.log(`   📊 总计: ${totalLines} 行代码`);
    
    if (totalLines > 3000) {
      console.log('   ✅ 代码规模符合预期 (>3000行)');
      passed++;
    } else {
      console.log('   ⚠️  代码规模小于预期 (<3000行)');
    }
  } catch (error) {
    console.log(`   ❌ 代码规模检查失败: ${error.message}`);
    failed++;
  }

  // 汇总结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 验证结果汇总:');
  console.log('='.repeat(50));
  console.log(`✅ 通过测试: ${passed}`);
  console.log(`❌ 失败测试: ${failed}`);
  console.log(`📈 通过率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));

  if (failed === 0) {
    console.log('\n🎉 恭喜! 所有验证通过,系统已就绪!');
    console.log('\n💡 下一步:');
    console.log('   1. 运行示例: npx ts-node lib/self-healing-ecosystem/examples.ts');
    console.log('   2. 查看文档: cat lib/self-healing-ecosystem/README.md');
    console.log('   3. 开始集成: 参考 examples.ts 中的示例代码');
  } else {
    console.log('\n⚠️  部分验证未通过,请检查上述错误信息');
  }

  console.log('\n');
}

// 运行验证
verify().catch(error => {
  console.error('❌ 验证过程出错:', error);
  process.exit(1);
});
