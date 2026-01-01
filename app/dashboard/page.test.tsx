import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';

describe('DashboardPage', () => {
  it('should render the dashboard page correctly', () => {
    render(<DashboardPage />);
    
    // 测试页面标题
    expect(screen.getByText('仪表板')).toBeInTheDocument();
    expect(screen.getByText('欢迎回到企业管理系统')).toBeInTheDocument();
    
    // 测试页面按钮
    expect(screen.getByText('今天')).toBeInTheDocument();
    expect(screen.getByText('查看报告')).toBeInTheDocument();
  });

  it('should render all statistics cards', () => {
    render(<DashboardPage />);
    
    // 测试统计卡片标题
    expect(screen.getByText('总客户数')).toBeInTheDocument();
    expect(screen.getByText('月度收入')).toBeInTheDocument();
    expect(screen.getByText('活跃任务')).toBeInTheDocument();
    expect(screen.getByText('完成率')).toBeInTheDocument();
    
    // 测试统计卡片数值
    expect(screen.getByText('2,847')).toBeInTheDocument();
    expect(screen.getByText('¥45,231')).toBeInTheDocument();
    expect(screen.getByText('127')).toBeInTheDocument();
    expect(screen.getByText('89.2%')).toBeInTheDocument();
    
    // 测试统计卡片趋势
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    expect(screen.getByText('+8.2%')).toBeInTheDocument();
    expect(screen.getByText('-3.1%')).toBeInTheDocument();
    expect(screen.getByText('+2.4%')).toBeInTheDocument();
  });

  it('should render main content sections', () => {
    render(<DashboardPage />);
    
    // 测试收入趋势区域
    expect(screen.getByText('收入趋势')).toBeInTheDocument();
    expect(screen.getByText('过去12个月的收入变化')).toBeInTheDocument();
    
    // 测试项目进度区域
    expect(screen.getByText('项目进度')).toBeInTheDocument();
    expect(screen.getByText('当前进行中的项目状态')).toBeInTheDocument();
    expect(screen.getByText('客户管理系统升级')).toBeInTheDocument();
    expect(screen.getByText('移动应用开发')).toBeInTheDocument();
    expect(screen.getByText('数据分析平台')).toBeInTheDocument();
    
    // 测试最近活动区域
    expect(screen.getByText('最近活动')).toBeInTheDocument();
    expect(screen.getByText('系统中的最新动态')).toBeInTheDocument();
    expect(screen.getByText('新客户注册')).toBeInTheDocument();
    expect(screen.getByText('任务完成')).toBeInTheDocument();
    expect(screen.getByText('系统更新')).toBeInTheDocument();
    
    // 测试待办事项区域
    expect(screen.getByText('待办事项')).toBeInTheDocument();
    expect(screen.getByText('需要您关注的任务')).toBeInTheDocument();
    expect(screen.getByText('审核客户申请')).toBeInTheDocument();
    expect(screen.getByText('回复客户消息')).toBeInTheDocument();
    expect(screen.getByText('系统维护通知')).toBeInTheDocument();
    
    // 测试快速操作区域
    expect(screen.getByText('快速操作')).toBeInTheDocument();
    expect(screen.getByText('常用功能快捷入口')).toBeInTheDocument();
    expect(screen.getByText('添加新客户')).toBeInTheDocument();
    expect(screen.getByText('创建任务')).toBeInTheDocument();
    expect(screen.getByText('生成报告')).toBeInTheDocument();
  });

  it('should render progress bars with correct values', () => {
    render(<DashboardPage />);
    
    // 获取所有进度条
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(3);
    
    // 获取所有进度指示器元素
    const progressIndicators = document.querySelectorAll('.h-full.w-full.flex-1.bg-primary.transition-all');
    expect(progressIndicators).toHaveLength(3);
    
    // 验证进度条的transform样式
    expect(progressIndicators[0]).toHaveStyle('transform: translateX(-25%)'); // 75%完成
    expect(progressIndicators[1]).toHaveStyle('transform: translateX(-55%)'); // 45%完成
    expect(progressIndicators[2]).toHaveStyle('transform: translateX(-10%)'); // 90%完成
  });

  it('should render badges correctly', () => {
    render(<DashboardPage />);
    
    // 测试徽章
    expect(screen.getByText('紧急')).toBeInTheDocument();
    expect(screen.getByText('普通')).toBeInTheDocument();
    expect(screen.getByText('提醒')).toBeInTheDocument();
  });
});
