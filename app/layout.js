import { Noto_Serif_KR } from 'next/font/google';
import './globals.css';

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: '사주팔자 계산기',
  description: '생년월일시로 사주팔자를 계산합니다',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={notoSerifKr.className}>{children}</body>
    </html>
  );
}
