// 赛事记录 API - 含派生汇总统计
import tournaments from '../../../data/tournaments.json';

interface Tournament {
  id: string;
  date: string;
  year: number;
  month: number;
  location: string;
  name: string;
  category: string | null;
  team: string;
  result: string;
  place: number | null;
  status: 'completed' | 'upcoming';
  level: string;
  note?: string;
}

function buildSummary(list: Tournament[]) {
  const completed = list.filter(t => t.status === 'completed');
  const upcoming = list.filter(t => t.status === 'upcoming');

  const champions = completed.filter(t => t.place === 1);
  const runnerUps = completed.filter(t => t.place === 2);
  const thirdPlaces = completed.filter(t => t.place === 3);
  const top8 = completed.filter(t => t.place !== null && t.place <= 8);
  const groupStage = completed.filter(t => t.result === '小组赛');

  const byYear: Record<string, number> = {};
  const byTeam: Record<string, number> = {};
  const byLevel: Record<string, number> = {};
  const byLocation: Record<string, number> = {};

  completed.forEach(t => {
    byYear[t.year] = (byYear[t.year] || 0) + 1;
    byTeam[t.team] = (byTeam[t.team] || 0) + 1;
    byLevel[t.level] = (byLevel[t.level] || 0) + 1;
    byLocation[t.location] = (byLocation[t.location] || 0) + 1;
  });

  const dates = completed.map(t => t.date).sort();
  const dateRange = dates.length ? `${dates[0]} ~ ${dates[dates.length - 1]}` : '';

  return {
    total: list.length,
    completed: completed.length,
    upcoming: upcoming.length,
    results: {
      champion: champions.length,
      runnerUp: runnerUps.length,
      thirdPlace: thirdPlaces.length,
      top8: top8.length,
      groupStage: groupStage.length,
    },
    bestPlace: champions.length ? '冠军' : top8.length ? `第${Math.min(...top8.map(t => t.place!))}名` : null,
    byYear,
    byTeam,
    byLevel,
    byLocation,
    dateRange,
  };
}

export function GET() {
  const list = tournaments as Tournament[];

  // 按日期倒序（最新的在前），未完成的放最后
  const sorted = [...list].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'completed' ? -1 : 1;
    }
    return b.date.localeCompare(a.date);
  });

  return Response.json({
    code: 0,
    data: {
      summary: buildSummary(sorted),
      tournaments: sorted,
    },
  });
}