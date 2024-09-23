import { useTranslations } from 'next-intl';
import Top from '@/components/top/top';
import Bottom from '@/components/bottom/bottom';
import WeekTask from '@/app/[locale]/main/_components/week-task'
import Character from '@/app/[locale]/main/_components/character'

export default function Main() {
  const t = useTranslations('index');

  return (
    <div>
      <Top />
      <div style={{ marginTop: '10vh', marginBottom: '12vh' }}>
        <WeekTask />
        <Character />
      </div>
      <Bottom />
    </div>
  );
}
