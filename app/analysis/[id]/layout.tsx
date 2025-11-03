// Static export를 위한 generateStaticParams 추가
export async function generateStaticParams() {
  // 빈 배열 반환 - 동적 페이지는 클라이언트에서 처리
  return []
}

export const dynamicParams = true // 동적 params 허용

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
