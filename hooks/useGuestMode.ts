import { useState, useEffect } from 'react';

const GUEST_MESSAGE_LIMIT = 3;
const GUEST_COUNT_KEY = 'forestecho_guest_messages';

export function useGuestMode() {
  const [guestMessageCount, setGuestMessageCount] = useState(0);
  const [isGuestLimitReached, setIsGuestLimitReached] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;

    const savedCount = localStorage.getItem(GUEST_COUNT_KEY);
    const count = savedCount ? parseInt(savedCount, 10) : 0;
    setGuestMessageCount(count);
    setIsGuestLimitReached(count >= GUEST_MESSAGE_LIMIT);
  }, []);

  const incrementGuestCount = () => {
    const newCount = guestMessageCount + 1;
    setGuestMessageCount(newCount);
    localStorage.setItem(GUEST_COUNT_KEY, newCount.toString());

    if (newCount >= GUEST_MESSAGE_LIMIT) {
      setIsGuestLimitReached(true);
    }
  };

  const resetGuestCount = () => {
    setGuestMessageCount(0);
    setIsGuestLimitReached(false);
    localStorage.removeItem(GUEST_COUNT_KEY);
  };

  const remainingMessages = Math.max(0, GUEST_MESSAGE_LIMIT - guestMessageCount);

  return {
    guestMessageCount,
    isGuestLimitReached,
    remainingMessages,
    incrementGuestCount,
    resetGuestCount,
  };
}
