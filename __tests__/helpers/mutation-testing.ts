// 变异测试工具 - 验证测试用例的有效性
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,变异测试,质量保证

export interface Mutation {
  id: string;
  type: string;
  description: string;
  originalCode: string;
  mutatedCode: string;
  lineNumber: number;
  killed: boolean;
  survived: boolean;
  timeout: boolean;
}

export interface MutationTestResult {
  fileName: string;
  totalMutations: number;
  killedMutations: number;
  survivedMutations: number;
  timeoutMutations: number;
  mutationScore: number;
  mutations: Mutation[];
}

export interface MutationTestReport {
  timestamp: string;
  results: MutationTestResult[];
  summary: {
    totalMutations: number;
    totalKilled: number;
    totalSurvived: number;
    totalTimeout: number;
    overallScore: number;
  };
}

export class MutationTester {
  private mutations: Mutation[] = [];
  private results: MutationTestResult[] = [];

  public mutateCode(code: string, fileName: string): MutationTestResult {
    const mutations: Mutation[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineMutations = this.generateMutations(line, index + 1, fileName);
      mutations.push(...lineMutations);
    });

    const result: MutationTestResult = {
      fileName,
      totalMutations: mutations.length,
      killedMutations: 0,
      survivedMutations: 0,
      timeoutMutations: 0,
      mutationScore: 0,
      mutations,
    };

    this.results.push(result);
    return result;
  }

  private generateMutations(line: string, lineNumber: number, fileName: string): Mutation[] {
    const mutations: Mutation[] = [];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
      return mutations;
    }

    if (trimmedLine.includes('return ')) {
      const returnMutation = this.createReturnMutation(line, lineNumber, fileName);
      if (returnMutation) mutations.push(returnMutation);
    }

    if (trimmedLine.includes('if (')) {
      const ifMutation = this.createIfMutation(line, lineNumber, fileName);
      if (ifMutation) mutations.push(ifMutation);
    }

    if (trimmedLine.includes('&&')) {
      const andMutation = this.createAndMutation(line, lineNumber, fileName);
      if (andMutation) mutations.push(andMutation);
    }

    if (trimmedLine.includes('||')) {
      const orMutation = this.createOrMutation(line, lineNumber, fileName);
      if (orMutation) mutations.push(orMutation);
    }

    if (trimmedLine.includes('===') || trimmedLine.includes('!==')) {
      const eqMutation = this.createEqualityMutation(line, lineNumber, fileName);
      if (eqMutation) mutations.push(eqMutation);
    }

    if (trimmedLine.includes('<') || trimmedLine.includes('>')) {
      const compMutation = this.createComparisonMutation(line, lineNumber, fileName);
      if (compMutation) mutations.push(compMutation);
    }

    if (trimmedLine.includes('!') && !trimmedLine.includes('!==')) {
      const notMutation = this.createNotMutation(line, lineNumber, fileName);
      if (notMutation) mutations.push(notMutation);
    }

    if (trimmedLine.includes('+')) {
      const addMutation = this.createArithmeticMutation(line, lineNumber, fileName, '+', '-');
      if (addMutation) mutations.push(addMutation);
    }

    if (trimmedLine.includes('-')) {
      const subMutation = this.createArithmeticMutation(line, lineNumber, fileName, '-', '+');
      if (subMutation) mutations.push(subMutation);
    }

    if (trimmedLine.includes('*')) {
      const mulMutation = this.createArithmeticMutation(line, lineNumber, fileName, '*', '/');
      if (mulMutation) mutations.push(mulMutation);
    }

    if (trimmedLine.includes('/')) {
      const divMutation = this.createArithmeticMutation(line, lineNumber, fileName, '/', '*');
      if (divMutation) mutations.push(divMutation);
    }

    return mutations;
  }

  private createReturnMutation(line: string, lineNumber: number, fileName: string): Mutation | null {
    const match = line.match(/return\s+(.+?);/);
    if (!match) return null;

    const returnValue = match[1].trim();
    let mutatedValue: string;

    if (returnValue === 'true') {
      mutatedValue = 'false';
    } else if (returnValue === 'false') {
      mutatedValue = 'true';
    } else if (returnValue === 'null') {
      mutatedValue = 'undefined';
    } else if (returnValue === 'undefined') {
      mutatedValue = 'null';
    } else if (!isNaN(Number(returnValue))) {
      mutatedValue = String(Number(returnValue) + 1);
    } else if (returnValue.startsWith('"') || returnValue.startsWith("'")) {
      mutatedValue = '""';
    } else {
      mutatedValue = 'null';
    }

    return {
      id: `${fileName}-${lineNumber}-return`,
      type: 'return',
      description: `Change return value from "${returnValue}" to "${mutatedValue}"`,
      originalCode: line,
      mutatedCode: line.replace(returnValue, mutatedValue),
      lineNumber,
      killed: false,
      survived: false,
      timeout: false,
    };
  }

  private createIfMutation(line: string, lineNumber: number, fileName: string): Mutation | null {
    const match = line.match(/if\s*\((.+)\)/);
    if (!match) return null;

    const condition = match[1].trim();
    const negatedCondition = `!(${condition})`;

    return {
      id: `${fileName}-${lineNumber}-if`,
      type: 'if',
      description: `Negate if condition from "${condition}" to "${negatedCondition}"`,
      originalCode: line,
      mutatedCode: line.replace(condition, negatedCondition),
      lineNumber,
      killed: false,
      survived: false,
      timeout: false,
    };
  }

  private createAndMutation(line: string, lineNumber: number, fileName: string): Mutation | null {
    if (!line.includes('&&')) return null;

    return {
      id: `${fileName}-${lineNumber}-and`,
      type: 'and',
      description: 'Replace && with ||',
      originalCode: line,
      mutatedCode: line.replace(/&&/g, '||'),
      lineNumber,
      killed: false,
      survived: false,
      timeout: false,
    };
  }

  private createOrMutation(line: string, lineNumber: number, fileName: string): Mutation | null {
    if (!line.includes('||')) return null;

    return {
      id: `${fileName}-${lineNumber}-or`,
      type: 'or',
      description: 'Replace || with &&',
      originalCode: line,
      mutatedCode: line.replace(/\|\|/g, '&&'),
      lineNumber,
      killed: false,
      survived: false,
      timeout: false,
    };
  }

  private createEqualityMutation(line: string, lineNumber: number, fileName: string): Mutation | null {
    let mutatedLine: string | null = null;

    if (line.includes('===')) {
      mutatedLine = line.replace(/===/g, '!==');
    } else if (line.includes('!==')) {
      mutatedLine = line.replace(/!==/g, '===');
    }

    if (!mutatedLine) return null;

    return {
      id: `${fileName}-${lineNumber}-equality`,
      type: 'equality',
      description: 'Invert equality operator',
      originalCode: line,
      mutatedCode: mutatedLine,
      lineNumber,
      killed: false,
      survived: false,
      timeout: false,
    };
  }

  private createComparisonMutation(line: string, lineNumber: number, fileName: string): Mutation | null {
    let mutatedLine: string | null = null;
    let description: string | null = null;

    if (line.includes('<=')) {
      mutatedLine = line.replace(/<=/g, '>=');
      description = 'Replace <= with >=';
    } else if (line.includes('>=')) {
      mutatedLine = line.replace(/>=/g, '<=');
      description = 'Replace >= with <=';
    } else if (line.includes('<')) {
      mutatedLine = line.replace(/</g, '>');
      description = 'Replace < with >';
    } else if (line.includes('>')) {
      mutatedLine = line.replace(/>/g, '<');
      description = 'Replace > with <';
    }

    if (!mutatedLine || !description) return null;

    return {
      id: `${fileName}-${lineNumber}-comparison`,
      type: 'comparison',
      description,
      originalCode: line,
      mutatedCode: mutatedLine,
      lineNumber,
      killed: false,
      survived: false,
      timeout: false,
    };
  }

  private createNotMutation(line: string, lineNumber: number, fileName: string): Mutation | null {
    if (!line.includes('!')) return null;

    return {
      id: `${fileName}-${lineNumber}-not`,
      type: 'not',
      description: 'Remove ! operator',
      originalCode: line,
      mutatedCode: line.replace(/!/g, ''),
      lineNumber,
      killed: false,
      survived: false,
      timeout: false,
    };
  }

  private createArithmeticMutation(
    line: string,
    lineNumber: number,
    fileName: string,
    operator: string,
    replacement: string
  ): Mutation | null {
    if (!line.includes(operator)) return null;

    return {
      id: `${fileName}-${lineNumber}-arithmetic`,
      type: 'arithmetic',
      description: `Replace ${operator} with ${replacement}`,
      originalCode: line,
      mutatedCode: line.replace(new RegExp(`\\${operator}`, 'g'), replacement),
      lineNumber,
      killed: false,
      survived: false,
      timeout: false,
    };
  }

  public markMutationKilled(mutationId: string): void {
    for (const result of this.results) {
      const mutation = result.mutations.find(m => m.id === mutationId);
      if (mutation) {
        mutation.killed = true;
        result.killedMutations++;
        this.calculateMutationScore(result);
        return;
      }
    }
  }

  public markMutationSurvived(mutationId: string): void {
    for (const result of this.results) {
      const mutation = result.mutations.find(m => m.id === mutationId);
      if (mutation) {
        mutation.survived = true;
        result.survivedMutations++;
        this.calculateMutationScore(result);
        return;
      }
    }
  }

  public markMutationTimeout(mutationId: string): void {
    for (const result of this.results) {
      const mutation = result.mutations.find(m => m.id === mutationId);
      if (mutation) {
        mutation.timeout = true;
        result.timeoutMutations++;
        this.calculateMutationScore(result);
        return;
      }
    }
  }

  private calculateMutationScore(result: MutationTestResult): void {
    if (result.totalMutations === 0) {
      result.mutationScore = 100;
      return;
    }
    result.mutationScore = Math.round((result.killedMutations / result.totalMutations) * 100);
  }

  public generateReport(): MutationTestReport {
    const totalMutations = this.results.reduce((sum, r) => sum + r.totalMutations, 0);
    const totalKilled = this.results.reduce((sum, r) => sum + r.killedMutations, 0);
    const totalSurvived = this.results.reduce((sum, r) => sum + r.survivedMutations, 0);
    const totalTimeout = this.results.reduce((sum, r) => sum + r.timeoutMutations, 0);
    const overallScore = totalMutations > 0 ? Math.round((totalKilled / totalMutations) * 100) : 100;

    return {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        totalMutations,
        totalKilled,
        totalSurvived,
        totalTimeout,
        overallScore,
      },
    };
  }

  public printReport(): void {
    const report = this.generateReport();

    console.log('\n' + '='.repeat(80));
    console.log('🧬 变异测试报告');
    console.log('='.repeat(80) + '\n');

    console.log(`📊 总变异数: ${report.summary.totalMutations}`);
    console.log(`✅ 被杀死: ${report.summary.totalKilled}`);
    console.log(`❌ 存活: ${report.summary.totalSurvived}`);
    console.log(`⏱️  超时: ${report.summary.totalTimeout}`);
    console.log(`🎯 变异得分: ${report.summary.overallScore}%\n`);

    console.log('-'.repeat(80));
    console.log('📋 文件详情:');
    console.log('-'.repeat(80) + '\n');

    report.results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.fileName}`);
      console.log(`   🧬 变异数: ${result.totalMutations}`);
      console.log(`   ✅ 被杀死: ${result.killedMutations}`);
      console.log(`   ❌ 存活: ${result.survivedMutations}`);
      console.log(`   ⏱️  超时: ${result.timeoutMutations}`);
      console.log(`   🎯 变异得分: ${result.mutationScore}%\n`);

      if (result.survivedMutations > 0) {
        console.log(`   ⚠️ 存活的变异:`);
        result.mutations
          .filter(m => m.survived)
          .forEach(mutation => {
            console.log(`     - Line ${mutation.lineNumber}: ${mutation.description}`);
          });
        console.log('');
      }
    });

    if (report.summary.totalSurvived > 0) {
      console.log('-'.repeat(80));
      console.log('💡 建议:');
      console.log('-'.repeat(80));
      console.log(`发现 ${report.summary.totalSurvived} 个存活的变异，建议增加测试用例以覆盖这些场景。\n`);
    }

    console.log('='.repeat(80) + '\n');
  }

  public clear(): void {
    this.mutations = [];
    this.results = [];
  }
}

export function createMutationTester(): MutationTester {
  return new MutationTester();
}
