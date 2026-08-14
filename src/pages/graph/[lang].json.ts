import type { APIRoute } from 'astro';
import { buildGraph } from '../../lib/content';
import type { Lang } from '../../i18n/ui';

export function getStaticPaths() {
  return [{ params: { lang: 'vi' } }, { params: { lang: 'en' } }];
}

export const GET: APIRoute = async ({ params }) => {
  const lang: Lang = params.lang === 'en' ? 'en' : 'vi';
  const graph = await buildGraph(lang);
  return new Response(JSON.stringify(graph), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
