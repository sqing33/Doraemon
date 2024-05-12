const axios = require('axios');
const cheerio = require('cheerio');
const {mysqlDb} = require("../db");

async function fetchTitle(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const links = $('[data-uuid="go6vtmioqb"] tr td a').map((i, el) => {
            return {
                id: i + 1, // 假设id从1开始
                text: $(el).text(),
                href: 'https://baike.baidu.com' + $(el).attr('href')
            };
        }).get();

        const contents = [];

        const requests = links.map(({id, href}) =>
            axios.get(href)
                .then(response => {
                    const $ = cheerio.load(response.data);
                    const title = $('h1.lemmaTitle_Fk7UW ').text();

                    contents.push({
                        id: id,
                        title: title,
                    });

                    return $;
                })
                .catch(error => {
                    console.error(`Error fetching ${href}: ${error}`);
                })
        );

        await Promise.all(requests);

        // 根据id排序
        return contents.sort((a, b) => a.id - b.id);

    } catch (error) {
        console.error(`Error fetching or parsing data: ${error}`);
        throw error;
    }
}


const url = 'https://baike.baidu.com/item/%E5%93%86%E5%95%A6A%E6%A2%A6%E7%94%B5%E5%BD%B1%E4%BD%9C%E5%93%81?fromtitle=%E5%93%86%E5%95%A6A%E6%A2%A6%E5%89%A7%E5%9C%BA%E7%89%88&fromid=10118391&fromModule=lemma_search-box';


fetchTitle(url).then(contents => {
    console.log(contents);

    contents.forEach(content => {
        mysqlDb.query('INSERT INTO movie SET ?', content, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Insert successful');
            }
        });
    });
});