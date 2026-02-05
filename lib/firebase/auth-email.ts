/**
 * Firebase 이메일/비밀번호 인증
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth'
import { auth } from './config'
import { logger } from '@/lib/utils/logger'

export interface SignUpData {
  email: string
  password: string
  displayName?: string
}

export interface SignInData {
  email: string
  password: string
}

/**
 * 이메일로 회원가입
 */
export async function signUpWithEmail(data: SignUpData): Promise<User> {
  try {
    // 계정 생성
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    const user = userCredential.user

    // 표시 이름 설정
    if (data.displayName) {
      await updateProfile(user, {
        displayName: data.displayName,
      })
    }

    // 이메일 인증 발송
    await sendEmailVerification(user)

    logger.info('User signed up with email:', user.uid)

    return user
  } catch (error: any) {
    logger.error('Email sign up error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * 이메일로 로그인
 */
export async function signInWithEmail(data: SignInData): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    logger.info('User signed in with email:', userCredential.user.uid)

    return userCredential.user
  } catch (error: any) {
    logger.error('Email sign in error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * 비밀번호 재설정 이메일 발송
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/`,
      handleCodeInApp: false,
    })

    logger.info('Password reset email sent to:', email)
  } catch (error: any) {
    logger.error('Password reset error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * 이메일 인증 재발송
 */
export async function resendVerificationEmail(user: User): Promise<void> {
  try {
    await sendEmailVerification(user)
    logger.info('Verification email resent to:', user.email)
  } catch (error: any) {
    logger.error('Resend verification error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Firebase 에러 메시지 한글화
 */
function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/invalid-email': '올바른 이메일 형식이 아닙니다.',
    'auth/operation-not-allowed': '이메일/비밀번호 로그인이 비활성화되어 있습니다.',
    'auth/weak-password': '비밀번호는 최소 6자 이상이어야 합니다.',
    'auth/user-disabled': '비활성화된 계정입니다.',
    'auth/user-not-found': '존재하지 않는 계정입니다.',
    'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
    'auth/too-many-requests': '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.',
    'auth/network-request-failed': '네트워크 연결을 확인해주세요.',
    'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
  }

  return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.'
}

/**
 * 비밀번호 강도 검사
 */
export function validatePassword(password: string): {
  isValid: boolean
  message: string
} {
  if (password.length < 8) {
    return {
      isValid: false,
      message: '비밀번호는 최소 8자 이상이어야 합니다.',
    }
  }

  if (!/[A-Z]/.test(password) && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: '비밀번호에 영문자가 포함되어야 합니다.',
    }
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: '비밀번호에 숫자가 포함되어야 합니다.',
    }
  }

  return {
    isValid: true,
    message: '안전한 비밀번호입니다.',
  }
}

/**
 * 이메일 형식 검사
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
