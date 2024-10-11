import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Link from 'next/link';
import QuizDaily from '@/app/[locale]/study/_components/quiz-daily'

export default function DailyQuiz() {
  const locale = useLocale()
  const t = useTranslations('index');
  
  return (
    <div>
      <QuizDaily type={'daily'}/>
    </div>
  );
}