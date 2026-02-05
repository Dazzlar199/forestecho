/**
 * Production-safe Logger Utility
 * Prevents console logs in production while maintaining debugging in development
 * Integrates with Sentry for production error tracking
 */

import * as Sentry from '@sentry/nextjs'

const isDevelopment = process.env.NODE_ENV !== 'production'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args)
    } else {
      // Production: Send to Sentry
      const error = args[0]
      if (error instanceof Error) {
        Sentry.captureException(error, {
          extra: args.slice(1).reduce((acc, arg, index) => {
            acc[`arg${index + 1}`] = arg
            return acc
          }, {} as Record<string, any>),
        })
      } else {
        Sentry.captureMessage(String(error), {
          level: 'error',
          extra: args.slice(1).reduce((acc, arg, index) => {
            acc[`arg${index + 1}`] = arg
            return acc
          }, {} as Record<string, any>),
        })
      }
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  }
}
