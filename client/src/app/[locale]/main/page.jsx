import { useTranslations } from 'next-intl';
import Bottom from '@/components/bottom/bottom';
import Top from '@/components/top/top';

export default function Main() {
  const t = useTranslations('index');

  return (
    <div>
      <Top />
      <div style={{ marginTop: '6vh', marginBottom: '12vh' }}>
        <div style={{ fontSize: '50px' }}>{t('title')}</div>
        <div style={{ fontSize: '50px' }}>{t('discuss-a-recent-movie-or-tv-show-you-watched')}</div>
      </div>
      <Bottom />
    </div>
  );
}
