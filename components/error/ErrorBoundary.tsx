'use client'
import { logger } from '@/lib/utils/logger'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * React Error Boundary
 * 컴포넌트 트리의 에러를 캐치하고 폴백 UI를 표시
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 정보를 콘솔에 로그
    logger.error('ErrorBoundary caught an error:', error, errorInfo)

    // 상태 업데이트
    this.setState({
      error,
      errorInfo,
    })

    // 커스텀 에러 핸들러 호출 (Sentry 등으로 전송 가능)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백이 제공된 경우
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* 아이콘 */}
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>

              {/* 제목 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  문제가 발생했습니다
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                </p>
              </div>

              {/* 개발 환경에서만 에러 상세 정보 표시 */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                  <p className="text-xs font-mono text-red-800 dark:text-red-300 break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-red-700 dark:text-red-400">
                        스택 트레이스
                      </summary>
                      <pre className="text-xs mt-2 text-red-800 dark:text-red-300 overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  다시 시도
                </button>
                <a
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-medium transition-colors"
                >
                  <Home className="w-4 h-4" />
                  홈으로
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

/**
 * 작은 컴포넌트를 위한 간단한 에러 바운더리
 */
export function SimpleErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-300">
              이 영역을 표시하는 중 오류가 발생했습니다.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
