// JSON API for WeChat Mini Program
// 微信小程序数据接口
import profile from '../../../data/profile.json';
import games from '../../../data/games.json';
import stats from '../../../data/stats.json';
import tournaments from '../../../data/tournaments.json';
import trainings from '../../../data/trainings.json';

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
}

interface Training {
  start: string;
  end: string;
  title: string;
  type: 'camp' | 'self' | 'gameDay' | 'daily';
  gain: string;
}

const list = tournaments as Tournament[];
const completed = list.filter(t => t.status === 'completed');
const champions = completed.filter(t => t.place === 1);
const thirdPlaces = completed.filter(t => t.place === 3);

// 取最近 3 场已完成 + 1 场即将开始
const recentCompleted = [...completed]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3);
const upcoming = list.filter(t => t.status === 'upcoming');

// 训练日志（日期格式 YYYY.M.D）
const trainingList = trainings as Training[];
const parseTrainingDate = (d: string) => {
  const [y, m, day] = d.split('.').map(Number);
  return new Date(y, m - 1, day).getTime();
};
const sortedTrainings = [...trainingList].sort(
  (a, b) => parseTrainingDate(b.start) - parseTrainingDate(a.start)
);
const trainingHours = sortedTrainings.reduce((sum, t) => {
  // end 为日期区间（集训）时按时长不适用
  if (t.end.includes('.')) return sum;
  const m = t.end.match(/^(\d+(?:\.\d+)?)/);
  return sum + (m ? Number(m[1]) : 0);
}, 0);
const trainingCamps = sortedTrainings.filter(t => t.type === 'camp' || t.type === 'self').length;
const trainingVenues = new Set(sortedTrainings.map(t => t.title)).size;

// 全站数据最新日期
const toIsoDate = (d: string) =>
  d
    .replace(/\./g, '-')
    .split('-')
    .map((part, i) => (i === 0 ? part : part.padStart(2, '0')))
    .join('-');
const latestDate = [
  ...sortedTrainings.map(t => toIsoDate(t.start)),
  ...(games as Array<{ date: string }>).map(g => g.date),
  ...list.map(t => t.date),
]
  .sort()
  .pop();

export function GET() {
  return Response.json({
    code: 0,
    message: 'success',
    data: {
      profile,
      tournamentSummary: {
        total: list.length,
        completed: completed.length,
        upcoming: upcoming.length,
        champions: champions.length,
        runnerUps: completed.filter(t => t.place === 2).length,
        thirdPlaces: thirdPlaces.length,
        bestResult: champions.length ? '冠军' : '季军',
      },
      recentTournaments: recentCompleted,
      upcomingTournaments: upcoming,
      games: games.slice(0, 10),
      trainingSummary: {
        total: sortedTrainings.length,
        hours: trainingHours,
        camps: trainingCamps,
        venues: trainingVenues,
      },
      recentTrainings: sortedTrainings.slice(0, 10),
      stats: {
        career: stats.career,
        currentSeason: stats.season2026,
        monthlyTrend: stats.monthlyTrend,
        note: stats._meta?.note,
      },
      lastUpdated: latestDate || stats._meta?.lastUpdated || '2026-09-02',
      apiVersion: '1.2.0',
    },
  });
}
