const _         = require('lodash'),
      path      = require('path'),
      fs        = require('fs'),
      os = require("os");

const categories        = require('./categories');
const {getPageNumbers, getPageItems}    = require('./utils/utils');


switch (process.argv[2]) {
    case '--pages':
        /* Get Page Numbers */
        _.each(categories, (data, category_name)=>{
            getPageNumbers(data.free_url)
                .then((free_pagination)=>{
                    getPageNumbers(data.pro_url).then((pro_pagination)=>{
                        let pages = free_pagination.concat(pro_pagination)
                        fs.createWriteStream(data.file).write(JSON.stringify(pages));
                    });
                }).catch((error)=>{
                console.log(error);
            });
        });
        break;
    case '--links':
        /* Get Page Links */
        _.each(categories, (data, category_name)=>{
            let links = JSON.parse(fs.readFileSync(data.file).toString());
            let dir_path = path.resolve(`links/${category_name}`);

            if(!fs.existsSync(dir_path)){
                fs.mkdirSync(dir_path, { recursive: true });
            }

            _.each(links, (link, index)=>{
                generate(link, index, category_name).next();
            });
        });

        break;
    default:
        console.error("You don't specified argument!");
        break;
}


function * generate(link, index, category_name) {
    yield setTimeout(async ()=>{
         await getPageItems(link)
            .then((image_links)=>{
                let urls = _.map(image_links, (el)=>{
                    return el.url;
                });
                let fstream = fs.createWriteStream(path.resolve(`links/${category_name}/${link.type}.txt`), {flags:'a'})
                fstream.write(urls.join(os.EOL) + os.EOL);
            });
    }, 250);
}





