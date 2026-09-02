// 比赛记录 API
// 说明：本站部署在 GitHub Pages（纯静态托管），服务端无法解析 URL query 分页参数。
// 因此本接口返回完整列表（含 total），分页逻辑由调用方（微信小程序）在前端自行处理，
// 例如：games.slice(offset, offset + limit)。
import games from '../../../data/games.json';

export function GET() {
  const sorted = [...games].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return Response.json({
    code: 0,
    data: {
      total: sorted.length,
      games: sorted,
    },
  });
}