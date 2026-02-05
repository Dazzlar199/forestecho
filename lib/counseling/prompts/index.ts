/**
 * Unified Counseling Prompts
 * 모든 AI Provider에서 공통으로 사용하는 프롬프트
 */

export * from './advanced'
export * from './free-tier'
export * from './enhanced'
export * from './base'

// Legacy compatibility - explicit exports
export { ADVANCED_COUNSELOR_PROMPT } from './advanced'
export { FREE_TIER_COUNSELOR_PROMPT } from './free-tier'
export { ENHANCED_COUNSELOR_PROMPT } from './enhanced'
export { COUNSELOR_SYSTEM_PROMPT, PREMIUM_ANALYSIS_PROMPT, FIRST_MESSAGE } from './base'
