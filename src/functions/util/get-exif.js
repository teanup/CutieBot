const puppeteer = require('puppeteer');

module.exports = {
	async scrapeExif(url) {
		// media key
		const mediaKey = url.match(/photo\/.+?\?key/g)[0].slice(6, -4);


		// launch browser
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(url, {
			waitUntil: 'networkidle0',
		});
		await page.exposeFunction("getMediaKey", () => mediaKey);

		// get image URL
		const dataHandle = await page.evaluateHandle(async () => {
			return document.querySelector(`.A7ANFe[data-media-key="${await getMediaKey()}"]`);
		});
		const dataURL = await page.evaluate(e => e.getAttribute("data-url"), dataHandle);
		const dataWidth = await page.evaluate(e => e.getAttribute("data-width"), dataHandle);
		const dataHeight = await page.evaluate(e => e.getAttribute("data-height"), dataHandle);

		const picInfo = {
			url: `${dataURL}=w${dataWidth}-h${dataHeight}-no`,
			width: dataWidth,
			height: dataHeight
		};


		// get timestamp
		const dateHandle = await page.evaluateHandle(async () => {
			return document.querySelector(`.A7ANFe[data-media-key="${await getMediaKey()}"] .BiCYpc`);
		});
		let dateTime = await page.evaluate(e => e.getAttribute("aria-label"), dateHandle);
		dateTime = dateTime.match(/\w{3} \d{1,2}, \d{4}, .+?M$/g)[0];

		const timestamp = new Date(dateTime).toISOString();


		// click info button
		const infoSelector = 'button[aria-label="Open info"]';
		await page.waitForSelector(infoSelector);
		await page.click(infoSelector);


		// get file name
		await page.waitForSelector(`.WUbige[jslog*="${mediaKey}"] .ffq9nc:nth-child(3) .R9U8ab`);
		const fileHandle = await page.evaluateHandle(async () => {
			return document.querySelector(`.WUbige[jslog*="${await getMediaKey()}"] .ffq9nc:nth-child(3) .R9U8ab`);
		});
		const fileName = await page.evaluate(e => e.innerHTML, fileHandle);


		// get GMaps location
		const locationHandle = await page.evaluateHandle(async () => {
			return document.querySelector(`.WUbige[jslog*="${await getMediaKey()}"] .GHWQBd .R9U8ab`);
		});
		const location = await page.evaluate(e => {
			if (e) return e.innerHTML;
		}, locationHandle);


		// get GMaps URL and preview
		const gmapsHandle = await page.evaluateHandle(async () => {
			return document.querySelector(`.WUbige[jslog*="${await getMediaKey()}"] .cFLCHe`);
		});
		const gmaps = await page.evaluate(e => {
			if (e) return e.href;
		}, gmapsHandle);

		const gmapsBackground = await page.evaluate(e => {
			if (e) return e.getAttribute("style");
		}, gmapsHandle);
		let gmapsPic = undefined;
		if (gmapsBackground) {
			gmapsPic = gmapsBackground.match(/url\('.+?'\)/)[0].slice(5,-2);
		}


		await browser.close();

		return {
			picInfo: picInfo,
			timestamp: timestamp,
			fileName: fileName,
			location: location,
			gmapsURL: gmaps,
			gmapsPic: gmapsPic
		};
	}
};
