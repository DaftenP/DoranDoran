import { useTranslations } from 'next-intl';
import Bottom from '@/components/bottom/bottom';
import Top from '@/components/top/top';
import WeekTask from '@/app/[locale]/main/_components/week-task'
import Character from '@/app/[locale]/main/_components/character'

export default function Main() {
  const t = useTranslations('index');

  return (
    <div>
      <Top />
      <div style={{ marginTop: '6vh', marginBottom: '12vh' }}>
        <WeekTask />
        <Character />
      </div>
      <Bottom />
    </div>
  );
}
