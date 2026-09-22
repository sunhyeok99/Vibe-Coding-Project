export const metadata = {
  title: '사주팔자 계산기',
  description: '생년월일시로 사주팔자를 계산합니다',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
