const got       = require('got'),
      cheerio   = require('cheerio'),
      qs        = require('querystring');

module.exports = {
    getPageNumbers: async (category_url) => {   
        let response =  await got(category_url);
        let $ = cheerio.load(response.body);
        let pages = parseInt($('ul.paginator .count').text().replace('of ', ''));
    
        let pagination = [];
        let type = qs.parse(category_url).order;
        for(let i = 1; i <= pages; i++){
            pagination.push({type: type, url: `${category_url}&page=${i}`})
        }
        return pagination;    
    },
    getPageItems: async (page)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await got(page.url, {
                    headers: {
                        'Cache-Control': 'max-age=0',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
                    }
                });
                let $ = cheerio.load(response.body);
                let items = [];
                $('.model_list .item a.link').each((index, link)=>{
                    items.push({type: page.type, url: $(link).attr('rev')})
                });
                return resolve(items);
            }catch (e) {
                reject(e);
            }
        })
    }
}



