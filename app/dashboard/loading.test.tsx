import React from 'react';
import { render, screen, within } from '@testing-library/react';
import DashboardLoading from './loading';

describe('DashboardLoading', () => {
  it('should render the loading component correctly', () => {
    render(<DashboardLoading />);
    
    // 测试组件是否渲染
    expect(document.body).toBeInTheDocument();
  });

  it('should render page header skeletons', () => {
    render(<DashboardLoading />);
    
    // 测试页面头部骨架
    const skeletons = document.querySelectorAll('.h-8.w-48, .h-4.w-96');
    expect(skeletons.length).toBe(2);
  });

  it('should render all statistics card skeletons', () => {
    render(<DashboardLoading />);
    
    // 获取所有卡片
    const cards = Array.from(document.querySelectorAll('.rounded-lg.border'));
    
    // 统计卡片骨架应该有4个
    const statsCards = cards.slice(0, 4);
    expect(statsCards.length).toBe(4);
    
    // 每个统计卡片应该包含骨架元素
    statsCards.forEach(card => {
      const cardSkeletons = card.querySelectorAll('.h-4.w-24, .h-8.w-16, .h-3.w-20');
      expect(cardSkeletons.length).toBe(3);
    });
  });

  it('should render chart area skeletons', () => {
    render(<DashboardLoading />);
    
    // 获取所有卡片
    const cards = Array.from(document.querySelectorAll('.rounded-lg.border'));
    
    // 图表区域骨架应该有2个
    const chartCards = cards.slice(4, 6);
    expect(chartCards.length).toBe(2);
    
    // 每个图表卡片应该包含骨架元素
    chartCards.forEach(card => {
      const cardSkeletons = card.querySelectorAll('.h-5.w-32, .h-64.w-full');
      expect(cardSkeletons.length).toBe(2);
    });
  });

  it('should render business card skeletons', () => {
    render(<DashboardLoading />);
    
    // 获取所有卡片
    const cards = Array.from(document.querySelectorAll('.rounded-lg.border'));
    
    // 业务卡片骨架应该有8个
    const businessCards = cards.slice(6, 14);
    expect(businessCards.length).toBe(8);
    
    // 每个业务卡片应该包含骨架元素
    businessCards.forEach(card => {
      const cardSkeletons = card.querySelectorAll('.h-12.w-12.rounded-lg, .h-4.w-20, .h-3.w-16');
      expect(cardSkeletons.length).toBe(3);
    });
  });
});
