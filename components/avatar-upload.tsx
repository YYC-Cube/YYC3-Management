/**
 * @fileoverview avatar-upload.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, X, Check, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange: (newAvatar: string) => void
  size?: "sm" | "md" | "lg"
  fallbackText?: string
}

export function AvatarUpload({ currentAvatar, onAvatarChange, size = "md", fallbackText = "头像" }: AvatarUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [cropSettings, setCropSettings] = useState({
    zoom: 1,
    rotation: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  }

  const buttonSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast({
        title: "文件类型错误",
        description: "请选择图片文件",
        variant: "destructive",
      })
      return
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "请选择小于5MB的图片",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setIsDialogOpen(true)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearInterval(progressInterval)
      setUploadProgress(100)

      // 创建新的头像URL (实际项目中这里会是服务器返回的URL)
      const newAvatarUrl = URL.createObjectURL(selectedFile)
      onAvatarChange(newAvatarUrl)

      toast({
        title: "上传成功",
        description: "头像已更新",
      })

      setTimeout(() => {
        setIsDialogOpen(false)
        resetState()
      }, 500)
    } catch (error) {
      toast({
        title: "上传失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetState = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setUploadProgress(0)
    setIsUploading(false)
    setCropSettings({ zoom: 1, rotation: 0 })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    resetState()
    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="relative inline-block">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={currentAvatar || "/placeholder.svg"} alt="头像" />
          <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-500 text-white">
            {fallbackText}
          </AvatarFallback>
        </Avatar>
        <Button
          size="sm"
          variant="outline"
          className={`absolute -bottom-1 -right-1 ${buttonSizeClasses[size]} rounded-full p-0 bg-white hover:bg-sky-50 border-sky-200`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="w-3 h-3 text-sky-600" />
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-sky-600" />
              上传头像
            </DialogTitle>
            <DialogDescription>调整您的头像图片，支持JPG、PNG格式，最大5MB</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {previewUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={previewUrl || "/placeholder.svg"}
                      alt="预览"
                      style={{
                        transform: `scale(${cropSettings.zoom}) rotate(${cropSettings.rotation}deg)`,
                      }}
                    />
                    <AvatarFallback>预览</AvatarFallback>
                  </Avatar>
                </div>

                {/* 调整控件 */}
                <div className="flex items-center space-x-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCropSettings((prev) => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.1) }))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 text-center text-sm text-slate-600">
                    缩放: {Math.round(cropSettings.zoom * 100)}%
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCropSettings((prev) => ({ ...prev, zoom: Math.min(2, prev.zoom + 0.1) }))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCropSettings((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {/* 上传进度 */}
                {isUploading && (
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">上传进度</span>
                      <span className="font-medium text-sky-600">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
                <X className="w-4 h-4 mr-2" />
                取消
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
              >
                {isUploading ? (
                  <>上传中...</>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    确认上传
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
