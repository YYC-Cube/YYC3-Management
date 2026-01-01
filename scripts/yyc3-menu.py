#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
YYC3-Menu项目文档架构一键创建脚本
功能：自动生成符合规范的全量文档目录及.md文件
遵循规范：01-YYC3-Menu-[文档类型]-[具体名称].md
核心依据：五高五标五化要求 + 七大阶段全链路闭环
返回说明：执行成功返回0，执行失败返回1（支持外部调用判断状态）
"""

import os
import sys  # 导入sys模块用于返回执行状态码

# 定义项目根目录（可根据实际需求修改，默认在脚本运行目录下创建docs文件夹）
ROOT_DIR = "docs"

# 定义全量文档结构：key为阶段名称，value为该阶段下的文档列表（分架构类、技巧类）
DOC_STRUCTURE = {
    "YYC3-Menu-需求规划": {
        "架构类": [
            "智能化应用业务架构说明书",
            "需求阶段架构可行性分析报告",
            "数据架构需求规划文档",
            "智能化能力需求规格说明书"
        ],
        "技巧类": [
            "需求文档标准化编写指南",
            "跨部门需求协同沟通技巧手册",
            "智能化需求优先级排序方法"
        ]
    },
    "YYC3-Menu-架构设计": {
        "架构类": [
            "总体架构设计文档",
            "微服务架构设计文档",
            "数据架构详细设计文档",
            "接口架构设计文档",
            "安全架构设计文档",
            "智能架构设计文档",
            "部署架构设计文档",
            "架构决策记录（ADR）集"
        ],
        "技巧类": [
            "架构设计绘图规范与工具指南",
            "微服务拆分避坑指南",
            "AI架构集成性能优化技巧",
            "架构评审 Checklist"
        ]
    },
    "YYC3-Menu-开发实施": {
        "架构类": [
            "代码架构实现说明书",
            "API接口实现文档",
            "数据访问层架构实现文档",
            "中间件集成架构文档",
            "AI模型开发与集成文档"
        ],
        "技巧类": [
            "编码规范手册",
            "版本控制最佳实践",
            "开发效率提升技巧集",
            "常见开发架构问题解决方案",
            "AI模型开发调优技巧"
        ]
    },
    "YYC3-Menu-测试验证": {
        "架构类": [
            "测试架构设计文档",
            "性能测试架构文档",
            "安全测试架构文档",
            "AI专项测试架构文档"
        ],
        "技巧类": [
            "测试用例设计技巧手册",
            "自动化测试脚本编写指南",
            "性能测试调优技巧",
            "测试缺陷管理规范与技巧",
            "AI测试数据准备与标注技巧"
        ]
    },
    "YYC3-Menu-部署发布": {
        "架构类": [
            "部署架构实施文档",
            "CI_CD流水线架构文档",
            "多环境部署架构差异文档",
            "灰度发布架构设计文档"
        ],
        "技巧类": [
            "Docker容器化部署技巧",
            "K8s部署运维技巧",
            "CI_CD流水线搭建与优化技巧",
            "部署问题排查指南",
            "灰度发布风险控制技巧"
        ]
    },
    "YYC3-Menu-运维运营": {
        "架构类": [
            "运维架构设计文档",
            "智能运维架构文档",
            "灾备架构运维文档",
            "系统扩容架构文档"
        ],
        "技巧类": [
            "运维手册",
            "监控告警配置技巧",
            "日志分析与问题定位技巧",
            "智能运维平台操作指南",
            "灾备演练与恢复技巧",
            "系统性能优化运维技巧"
        ]
    },
    "YYC3-Menu-归类迭代": {
        "架构类": [
            "项目文档归档架构说明",
            "系统迭代架构规划文档",
            "架构资产沉淀文档"
        ],
        "技巧类": [
            "文档归档规范与技巧",
            "架构评审与迭代规划技巧",
            "知识复用与沉淀技巧"
        ]
    }
}

def create_doc_structure():
    """
    创建文档架构目录及文件
    返回值：0-执行成功，1-执行失败
    """
    try:
        print("🚀 开始执行YYC3-Menu项目文档架构创建脚本...")
        # 1. 创建根目录
        if not os.path.exists(ROOT_DIR):
            os.makedirs(ROOT_DIR)
            print(f"✅ 成功创建根目录：{ROOT_DIR}")
        else:
            print(f"ℹ️  根目录 {ROOT_DIR} 已存在，跳过创建")
        
        # 2. 遍历每个阶段，创建阶段目录、文档类型目录、文档文件
        for stage_name, doc_types in DOC_STRUCTURE.items():
            # 创建阶段目录
            stage_dir = os.path.join(ROOT_DIR, stage_name)
            if not os.path.exists(stage_dir):
                os.makedirs(stage_dir)
                print(f"\n✅ 成功创建阶段目录：{stage_dir}")
            
            # 遍历该阶段下的文档类型（架构类、技巧类）
            for doc_type, doc_names in doc_types.items():
                # 创建文档类型目录
                doc_type_dir = os.path.join(stage_dir, doc_type)
                if not os.path.exists(doc_type_dir):
                    os.makedirs(doc_type_dir)
                    print(f"✅ 成功创建文档类型目录：{doc_type_dir}")
                
                # 遍历该类型下的所有文档，按序号创建.md文件
                for idx, doc_name in enumerate(doc_names, start=1):
                    # 生成文件名：01-YYC3-Menu-[文档类型]-[具体名称].md
                    file_name = f"{idx:02d}-YYC3-Menu-{doc_type}-{doc_name}.md"
                    file_path = os.path.join(doc_type_dir, file_name)
                    
                    # 创建文件（若不存在则创建空文件）
                    if not os.path.exists(file_path):
                        with open(file_path, "w", encoding="utf-8") as f:
                            # 写入文件头部说明（可选，便于后续编写）
                            f.write(f"# {doc_name}\n")
                            f.write(f"## 文档信息\n")
                            f.write(f"- 文档类型：{doc_type}\n")
                            f.write(f"- 所属阶段：{stage_name}\n")
                            f.write(f"- 遵循规范：五高五标五化要求\n")
                            f.write(f"- 版本号：V1.0\n")
                            f.write(f"\n## 核心内容\n")
                        print(f"✅ 成功创建文档：{file_path}")
                    else:
                        print(f"ℹ️  文档 {file_path} 已存在，跳过创建")
        
        print("\n🎉 全量文档架构创建完成！")
        print(f"📁 文档根目录：{os.path.abspath(ROOT_DIR)}")
        print("💡 后续可直接在对应.md文件中填充具体内容，所有文件已预设基础格式")
        return 0  # 执行成功，返回0
    
    except PermissionError:
        print(f"\n❌ 执行失败：权限不足！无法创建目录/文件，请检查当前用户对脚本运行目录的读写权限。")
        return 1  # 权限错误，返回1
    except FileNotFoundError as e:
        print(f"\n❌ 执行失败：文件路径不存在！错误信息：{str(e)}")
        return 1  # 路径错误，返回1
    except Exception as e:
        print(f"\n❌ 执行失败：未知错误！错误信息：{str(e)}")
        return 1  # 其他错误，返回1

if __name__ == "__main__":
    # 执行创建函数并获取返回码
    exit_code = create_doc_structure()
    # 退出程序并返回状态码（供外部调用判断结果）
    sys.exit(exit_code)