"use client"

import { useState } from "react"
import { ArrowLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface FloatingNavButtonsProps {
  className?: string
}

export function FloatingNavButtons({ className }: FloatingNavButtonsProps) {
  const router = useRouter()
  const [isBackHovered, setIsBackHovered] = useState(false)
  const [isHomeHovered, setIsHomeHovered] = useState(false)

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <div className={`fixed bottom-6 right-6 flex flex-col gap-3 z-50 ${className}`}>
      {/* 返回按钮 */}
      <button
        onClick={handleBack}
        onMouseEnter={() => setIsBackHovered(true)}
        onMouseLeave={() => setIsBackHovered(false)}
        className={`
          group relative w-14 h-14 rounded-full
          bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600
          shadow-lg hover:shadow-xl
          border-2 border-slate-300
          transition-all duration-300 ease-out
          ${isBackHovered ? "scale-110 -translate-y-1" : "scale-100"}
          before:absolute before:inset-0 before:rounded-full
          before:bg-gradient-to-br before:from-white/20 before:to-transparent
          before:opacity-0 hover:before:opacity-100 before:transition-opacity
          active:scale-95 active:shadow-md
        `}
        title="返回上一页"
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 shadow-inner">
          <div className="flex items-center justify-center w-full h-full">
            <ArrowLeft
              className={`w-6 h-6 text-white transition-all duration-300 ${isBackHovered ? "scale-110" : "scale-100"}`}
            />
          </div>
        </div>
        {/* 光晕效果 */}
        <div
          className={`
          absolute inset-0 rounded-full bg-slate-400/30 blur-md
          transition-all duration-300
          ${isBackHovered ? "scale-150 opacity-60" : "scale-100 opacity-0"}
        `}
        />
      </button>

      {/* 主页按钮 */}
      <button
        onClick={handleHome}
        onMouseEnter={() => setIsHomeHovered(true)}
        onMouseLeave={() => setIsHomeHovered(false)}
        className={`
          group relative w-14 h-14 rounded-full
          bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600
          shadow-lg hover:shadow-xl
          border-2 border-sky-300
          transition-all duration-300 ease-out
          ${isHomeHovered ? "scale-110 -translate-y-1" : "scale-100"}
          before:absolute before:inset-0 before:rounded-full
          before:bg-gradient-to-br before:from-white/20 before:to-transparent
          before:opacity-0 hover:before:opacity-100 before:transition-opacity
          active:scale-95 active:shadow-md
        `}
        title="回到首页"
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-sky-300 to-blue-500 shadow-inner">
          <div className="flex items-center justify-center w-full h-full">
            <Home
              className={`w-6 h-6 text-white transition-all duration-300 ${isHomeHovered ? "scale-110" : "scale-100"}`}
            />
          </div>
        </div>
        {/* 光晕效果 */}
        <div
          className={`
          absolute inset-0 rounded-full bg-blue-400/30 blur-md
          transition-all duration-300
          ${isHomeHovered ? "scale-150 opacity-60" : "scale-100 opacity-0"}
        `}
        />
      </button>
    </div>
  )
}
