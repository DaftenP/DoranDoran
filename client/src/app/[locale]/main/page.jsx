import { useTranslations } from 'next-intl';
import Bottom from '@/components/bottom/bottom'


export default function Login() {
  const t = useTranslations('index');

  return (
    <div>
      <div style={{fontSize: '50px'}}>{t('title')}</div>
      <div style={{fontSize: '50px'}}>{t('discuss-a-recent-movie-or-tv-show-you-watched')}</div>
      <Bottom />
    </div>
  );
}