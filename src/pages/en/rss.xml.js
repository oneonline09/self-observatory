import rss from '@astrojs/rss';
import { getNotes } from '../../lib/content';
import { SITE } from '../../consts.js';

export async function GET(context) {
  const notes = await getNotes('en');
  return rss({
    title: SITE.title,
    description: SITE.description.en,
    site: context.site,
    items: notes.map((n) => ({
      title: n.data.title,
      description: n.data.summary,
      pubDate: n.data.date,
      link: n.url,
    })),
  });
}
