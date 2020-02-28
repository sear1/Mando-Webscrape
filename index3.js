
//required modules
const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');

///targeted URL's
const URLS = [
    { 
        url: 'https://www.imdb.com/title/tt8111088/', 
        id: 'the_mandolorian'
    },
    { 
        url: 'https://www.imdb.com/title/tt9095424/?ref_=ttep_ep1', 
        id: 'episode_1_mandolorian'
    }
];

(async () => {
    let mandoData = [];

    for(let mando of URLS) {
        const response = await requestPromise({
                uri: mando.url,
                headers: {
                    ///grabbed from inspected headers
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9',
                    'cache-control': 'max-age=0',
                    'connection': 'keep-alive',
                    'host': 'www.imdb.com',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36'
                },
                ///compression algorythm from accept-encoding header
                gzip: true
            }
        );

        ///https://www.w3schools.com/jquery/jquery_ref_selectors.asp
        let $ = cheerio.load(response);
        ///target title tag within (>) h1 child tag. Added trim to remove whitespace.
        let title = $('div[class="title_wrapper"] > h1').text().trim();
        ///target rating tag, broaden tag search to look from div tag to the child of strong and span
        let rating = $('div[class="ratingValue"] > strong > span').text();
        ///grabs from a title tags with specifically See more release dates.
        let releaseDate = $('a[title="See more release dates"]').text().trim();
        ///var grabs source img from console within a tag with img from attribute source
        let poster = $('div[class="poster"] > a > img').attr('src');
        ///$('div[class="title_wrapper"] a[href^="/search/title?genres"').text()
        ///grabs the text for the genres and needs to be in an array with index and elements
        let genres = [];
        $('div[class="title_wrapper"] a[href^="/search/title?genres"]').each((i, elm) => {
            let genre = $(elm).text();

            genres.push(genre);
        });


        mandoData.push({
            title,
            rating,
            genres,
            releaseDate,
            poster
        });
        //saves file from the varible with the associated file extention
        let file = fs.createWriteStream(`${mando.id}.jpg`)

        let stream = request({
            uri: poster,
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'max-age=0',
                'connection': 'keep-alive',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36'
            },
            gzip: true
        })
        //piped to a file variable above
        .pipe(file);
        //fs.writeFileSync('./data.json', JSON.stringify(mandoData), 'utf-8');
        //console.log(mandoData);
    }

})()