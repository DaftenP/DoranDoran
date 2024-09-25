import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Link from 'next/link';
import Quiz from '@/app/[locale]/study/_components/quiz'

export default function DailyQuiz() {
  const locale = useLocale()
  const t = useTranslations('index');
  
  return (
    <div>
      <Quiz />
    </div>
  );
}