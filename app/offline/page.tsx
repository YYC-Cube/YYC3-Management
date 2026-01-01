"use client"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <img src="/yyc3-logo-blue.png" alt="YYC³" className="w-12 h-12 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-4">离线模式</h1>

        <p className="text-slate-600 mb-6">
          当前网络连接不可用，您正在使用离线版本。部分功能可能受限，请检查网络连接后重试。
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
            <span className="text-sm text-slate-700">缓存数据</span>
            <span className="text-sm font-medium text-emerald-600">可用</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
            <span className="text-sm text-slate-700">基本功能</span>
            <span className="text-sm font-medium text-emerald-600">可用</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="text-sm text-slate-700">实时同步</span>
            <span className="text-sm font-medium text-orange-600">不可用</span>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full mt-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-colors"
        >
          重新连接
        </button>
      </div>
    </div>
  )
}
