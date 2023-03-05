const express = require('express')
// const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 9000

app.use(express.json())
app.use(cors({ origin: '*' }));

// var my_array = [];

// for (var i = 1; i <= 20; i++) {
//     my_array.push(i);
// }

// app.get('/', (_, res)=>{
//     async function start() {

//         const browser = await puppeteer.launch()
//         const page = await browser.newPage()
//         await page.goto("https://www.olx.uz/d/obyavlenie/almazar-kora-kamish-2-4-1-2-4-sredniy-remont-ID38CIW.html?reason=ip%7Ccf", {timeout: 0})

//         await page.waitForSelector('#root > div.css-50cyfj > div.css-1qw98an > div:nth-child(3) > div.css-6u8zs6 > div:nth-child(1) > div:nth-child(3) > div > button.css-1hrtz3t')

//         click_bottom = await page.click('#root > div.css-50cyfj > div.css-1qw98an > div:nth-child(3) > div.css-6u8zs6 > div:nth-child(1) > div:nth-child(3) > div > button.css-1hrtz3t')
//         console.log(click_bottom);

//         // await page.waitForTimeout(3000)

//         const  text_top= await page.$eval('#root > div.css-50cyfj > div.css-1qw98an > div:nth-child(3) > div.css-6u8zs6 > div:nth-child(1) > div:nth-child(3) > div > button.css-1hrtz3t > span > a',  (el)=>el.innerText)

//         const  text_bottom= await page.$eval('#root > div.css-50cyfj > div.css-1qw98an > div:nth-child(3) > div.css-n9feq4 > section > div > div > div.css-1epmoz1 > div.css-1saqqt7 > div > div > a',  (el)=>el.innerText)

//         console.log(text_top);
//         await browser.close()

//         // const data = JSON.stringify(text_top)
//         // res.send(JSON.parse(data));

//         res.send(text_bottom)
//     }

//     start()
// }) 

// const productList = [];

// app.get('/', async (req, res) => {

//     const browser = await puppeteer.launch()
//     const page = await browser.newPage() 
//     await page.goto("https://www.olx.uz/d/dom-i-sad/sad-ogorod/", {timeout: 0})
//     const content = await page.content();
//     browser.close(); 

//     const $ = cheerio.load(content);

//     $('.css-rc5s2u').each((i, header) => {
//         const url = $(header).attr('href');
//         productList.push({url});
//     })

//     console.log(productList);

//     res.json(productList);
// }) 

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome = require("chrome-aws-lambda");
    puppeteer = require("puppeteer-core");
} else {
    puppeteer = require("puppeteer");
}

// app.get("/", (req, res) => {
//     res.json("hello world")
// })

app.get('/api', (req, res) => {
    async function start() {
        let options = {};

        if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
            options = {
                args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
                defaultViewport: chrome.defaultViewport,
                executablePath: await chrome.executablePath,
                headless: true,
                ignoreHTTPSErrors: true,
            };
        } 
        
        try {
            // const browser = await puppeteer.launch(process.env.AWS_LAMBDA_FUNCTION_VERSION ? options : { headless: false })
            // const page = await browser.newPage()
            // await page.goto("https://www.olx.uz/d/obyavlenie/prodaetsya-zhentra-ID3aHnt.html", { timeout: 0 })
            // const numberElement = await page.waitForSelector('button.css-19zjgsi');
            // await numberElement.click('button.css-19zjgsi', { clickCount: 3 });
            // await page.waitForSelector('a[data-testid="contact-phone"]');
            // const content = await page.content();
            // browser.close(); 

            const browser = await puppeteer.launch(process.env.AWS_LAMBDA_FUNCTION_VERSION ? options : { headless: false })
            const page = await browser.newPage()
            await page.goto("https://www.olx.uz/d/obyavlenie/prodaetsya-zhentra-ID3aHnt.html", { timeout: 0 })
            await page.waitForSelector('h1[data-cy="ad_title"]');
            const content = await page.content();
            browser.close();

            const $ = cheerio.load(content); 

            $('.css-1soizd2').each((i, header) => {
                const url = $(header).text();
                res.json(url);
            }) 

            // $('.css-rc5s2u').each((i, header) => {
            //     const url = $(header).attr('href');
            //     productList.push({ url });
            // })

        } catch (err) {
            res.json(err);
        }
    }

    start();
})

app.get("/", (req,res) => {
    res.json("hello world");
}) 



app.listen(PORT, console.log(`Siz shu (${PORT}) portdasiz`)) 

// "engines": {
//     "node": "^14"
//   },