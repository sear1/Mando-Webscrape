
//required modules
const request = require('request-promise');
const cheerio = require('cheerio');
///targeted URL
const URL = 'https://www.imdb.com/title/tt8111088/';

(async () => {

    const response = await request({
            uri: URL,
            headers: {
                ///grabbed from inspected headers
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'max-age=0',
                ///'cookie': 'uu=BCYp03vpj7XPgizBpgOLMguU54Vvw_o6ONY-H3H3lQlqtN1Z4j02JjdniMpR1dpS36HIXr1AFYx5%0D%0Agk6bAKr-JN2Ll9832arq0JEBBNONfiA8h6oUgPBv7Blcw2QGNtDtO_sQUAASdojt1DvYEtTMe34X%0D%0AAQ%0D%0A; session-id=135-2734910-2352319; session-id-time=2189743978; ubid-main=133-5575269-1307739; adblk=adblk_yes; session-token=pi19jyzIYYIG0qpZQAyZd0P8I5sg3RsIELHC+FJu/Nz5+sywXl0h5fg4RD460mKPkyZehfWEmpaJCGE95AQBEgISe5rcYvr4y1E9VQIab7Zlz5Z7XvrRdqM9195kQgb6JuN/5+zRfdaVGS3XFgh+OUxov2tMltXXzg6gfKQE2S2Y4Gy0T5CH3NHznUTjdT5D; csm-hit=tb:s-JREEMB7XXGA959DVR8RH|1582156308281&adb:adblk_yes&t:1582156308998',
                'upgrade-insecure-requests': '1',
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
    ///let genre = $('')
    ///target rating tag, broaden tag search to look from div tag to the child of strong and span
    let rating = $('div[class="ratingValue"] > strong > span').text();
    ///grabs the text for the genres and needs to be in an array with index and elements
    ///$('div[class="title_wrapper"] a[href^="/search/title?genres"').text()
    
    ///grabs from a title tags with specifically See more release dates.
    let releaseDate = $('a[title="See more release dates"]').text().trim();
    ///var grabs source img from console within a tag with img from attribute source
    let poster = $('div[class="poster"] > a > img').attr('src');
    ///$('div[class="title_wrapper"] a[href^="/genre/"').text()

    let genres = [];
    $('div[class="title_wrapper"] a[href^="/search/title?genres"]').each((i, elm) => {
        let genre = $(elm).text();

        genres.push(genre);
    });


    
    
    ///prints out results with clean output
    console.log(`Title: ${title}`);
    console.log(`Rating: ${rating}`);
    console.log(`Genres: ${genres}`);
    console.log(`Release Date: ${releaseDate}`);
    console.log(`Poster: ${poster}`);

})()