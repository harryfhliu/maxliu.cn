// 统计数据 API
import stats from '../../../data/stats.json';

export function GET() {
  return Response.json({
    code: 0,
    data: stats,
  });
}
