// JSON API for WeChat Mini Program
// 微信小程序数据接口
import profile from '../../../data/profile.json';
import games from '../../../data/games.json';
import stats from '../../../data/stats.json';
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
      stats: {
        career: stats.career,
        currentSeason: stats.season2026,
        monthlyTrend: stats.monthlyTrend,
        note: stats._meta?.note,
      },
      lastUpdated: stats._meta?.lastUpdated || '2026-09-02',
      apiVersion: '1.1.0',
    },
  });
}