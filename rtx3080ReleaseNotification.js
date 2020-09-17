const got = require('got')
const notif = require('node-notifier')
const cheerio = require('cheerio')
const subpro = require('child_process')

const url = 'https://www.nvidia.com/en-gb/geforce/graphics-cards/30-series/rtx-3080/?ncid=afm-chs-44270&ranMID=44270&ranEAID=VZfI20jEa0c&ranSiteID=VZfI20jEa0c-i5NonjQlrpGdA11rinlkhQ'
const buyPage = "https://www.nvidia.com/en-gb/shop/geforce/gpu/?page=1&limit=9&locale=en-gb&category=GPU&gpu=RTX%203080"
const selector = "#sectionenhanced_copycc3fd0ad_f45f_4971_bd1b_033ccd0a5dae > div > div > div > div.button.parbase.section > div > div.noicon"
async function check() {
    let data = await got(url)
    if (! data) return console.log('Unable to get data..')
    else {
        let $ = cheerio.load(data.body)
        if ($(selector).text().includes('Out Of Stock')) {
            return console.log('Out Of Stock')
        }
        else {
            notif.notify('THEY ARE IN STOCK RN!!')
            subpro.execSync(`explorer "${buyPage}"`)
            return console.log('IN STOCK')
        }
    }
}

setInterval(check,2e4)