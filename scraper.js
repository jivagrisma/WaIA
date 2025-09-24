const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://wasap.market/';

async function scrapeData() {
    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(html);
        let botsData = null;

        const scriptTags = $('script').toArray().reverse(); // Iterar en orden inverso

        for (const script of scriptTags) {
            const scriptContent = $(script).html();
            if (scriptContent && scriptContent.includes('"bots":')) {
                const match = scriptContent.match(/"bots":(\[.*?\])/);
                if (match && match[1]) {
                    try {
                        botsData = JSON.parse(match[1]);
                        break; // Salir del bucle una vez encontrados los datos
                    } catch (e) {
                        console.error('Found "bots" but failed to parse JSON:', e);
                    }
                }
            }
        }

        if (botsData) {
            const formattedAgents = botsData.map(bot => ({
                name: bot.name,
                provider: bot.provider,
                description: bot.description ? bot.description.es : '',
                tags: bot.tags || [],
                whatsappLink: `https://wa.me/${bot.phone}${bot.text ? `?text=${encodeURIComponent(bot.text)}` : ''}`,
                icon: bot.icon
            }));

            fs.writeFile('agents.json', JSON.stringify(formattedAgents, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    console.log('Successfully scraped and saved agent data to agents.json');
                }
            });
        } else {
            console.log('Could not find agent data in any of the script tags.');
        }

    } catch (error) {
        console.error('An error occurred during the scraping process:', error);
    }
}

scrapeData();