import * as fs from 'fs';
import * as cheerio from 'cheerio';

function extract() {
    const html = fs.readFileSync('virtues.html', 'utf8');
    const $ = cheerio.load(html);
    
    const links = [];
    $('a').each((i, el) => {
        const title = $(el).text().trim();
        const href = $(el).attr('href');
        if (title && href && href.includes('христианские-добродетели')) {
            links.push({ title, href });
        }
    });

    console.log(JSON.stringify(links, null, 2));
}
extract();
