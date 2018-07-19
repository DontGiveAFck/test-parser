const puppeteer = require('puppeteer')

const preparePageForTests = async (page) => {

// Pass the User-Agent Test.
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
}

module.exports = async function getCarInfo(req, res) {
    try {
        console.log('p started')
        let VIN = req.body.vin
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await preparePageForTests(page)
        await page.goto('https://avtokods.ru/')
        await page.waitForSelector("input#vehicle-id", {
            visible: true
        })
        console.log('page loaded')
        await page.click('input#vehicle-id')
        await page.keyboard.type(VIN)
        await page.click('button.btn.btn-default.btn-lg')
        await page.waitForNavigation({ waitUntil: 'load' });
        await page.waitForSelector('h1')
        await page.waitForFunction('document.querySelector("h1").innerText.length > 1', {
            timeout: 1000000
        })
        console.log('info rendered')
        const carModel = await page.evaluate(() => document.querySelector('h1').innerText);
        const carYear = await page.evaluate(() => document.querySelector('div.col-sm-8.col-md-6 > b').innerText);
        const carColor = await page.evaluate(() => document.querySelectorAll('div.report-block > div.data-block > div.row > div.col-xs-12.col-md-6 > div.row > div.col-sm-8.col-md-6')[3].innerText);
        const carType = await page.evaluate(() => document.querySelectorAll('div.report-block > div.data-block > div.row > div.col-xs-12.col-md-6 > div.row > div.col-sm-8.col-md-6')[4].innerText);
        const carP = await page.evaluate(() => document.querySelector('div.report-block > div.data-block > div.row > div.col-sm-8.col-md-9').innerText);
        const engineV = await page.evaluate(() => document.querySelectorAll('div.report-block > div.data-block > div.row > div.col-sm-8.col-md-9')[1].innerText);
        const category = await page.evaluate(() => document.querySelectorAll('div.report-block > div.data-block > div.row > div.col-xs-12.col-md-6 > div.row > div.col-sm-8.col-md-6')[5].innerText);

        const carInfo = {
            model: carModel,
            year: carYear,
            color: carColor,
            type: carType,
            category: category,
            carP: carP,
            engineV: engineV
        }
        await browser.close()
        console.log(carInfo)
        res.status(200).json(carInfo)
    } catch (err) {
        console.log(err)
    }

}
