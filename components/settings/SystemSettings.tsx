/**
 * SystemSettings Component (重构版)
 * 系统设置主组件 - 轻量级入口
 */

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings, Save, Download, Upload, RefreshCw } from "lucide-react"
import { useSystemConfig, useConfigPersistence } from "./hooks"
import { BasicSettings } from "./BasicSettings"

export function SystemSettings({ showTitle = true }: { showTitle?: boolean }) {
  const { saveConfig, resetConfig, isSaving } = useSystemConfig();
  const { exportConfig, importConfig } = useConfigPersistence();

  const handleSave = async () => {
    const result = await saveConfig();
    if (result.success) {
      // Toast通知
      console.log('配置保存成功');
    }
  };

  const handleExport = () => {
    exportConfig();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const config = await importConfig(file);
        // 应用导入的配置
        console.log('配置导入成功', config);
      } catch (error) {
        console.error('配置导入失败:', error);
      }
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置所有配置吗？')) {
      resetConfig();
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">系统设置</h1>
              <p className="text-muted-foreground">
                管理系统配置和偏好设置
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-input')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              导入
            </Button>
            <input
              id="import-input"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              重置
            </Button>
            
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? '保存中...' : '保存配置'}
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="basic">基本设置</TabsTrigger>
          <TabsTrigger value="database">数据库</TabsTrigger>
          <TabsTrigger value="cache">缓存</TabsTrigger>
          <TabsTrigger value="security">安全</TabsTrigger>
          <TabsTrigger value="notification">通知</TabsTrigger>
          <TabsTrigger value="appearance">外观</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <BasicSettings />
        </TabsContent>

        <TabsContent value="database">
          <div className="p-4 text-center text-muted-foreground">
            数据库设置组件开发中...
          </div>
        </TabsContent>

        <TabsContent value="cache">
          <div className="p-4 text-center text-muted-foreground">
            缓存设置组件开发中...
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="p-4 text-center text-muted-foreground">
            安全设置组件开发中...
          </div>
        </TabsContent>

        <TabsContent value="notification">
          <div className="p-4 text-center text-muted-foreground">
            通知设置组件开发中...
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="p-4 text-center text-muted-foreground">
            外观设置组件开发中...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SystemSettings;
