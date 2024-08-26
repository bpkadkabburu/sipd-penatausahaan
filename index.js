const puppeteer = require('puppeteer')
const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const cliProgress = require('cli-progress')
const colors = require('ansi-colors')
const cookiesFilePath = 'cookies.json'
const {
    URL,
    USER,
    PASSWORD,
    TAHUN,
    PATH,
    JADWAL
} = require('./lib/dpa/config')
const {
    updateEnv,
    fetchGet,
    groupBy
} = require('./lib/utils')

async function navigateAndRetry(page, url, pageName, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] })
            console.log('Page loaded successfully', pageName)
            return
        } catch (error) {
            if (error.message.includes('ERR_CONNECTION_RESET')) {
                console.log(`Connection reset error, retrying (${i + 1}/${retries})...`)
                await page.waitForTimeout(3000) // Wait 3 seconds before retrying
            } else {
                console.error('Unexpected error:', error)
                throw error
            }
        }
    }
    throw new Error(`Failed to load the page after ${retries} attempts`)
}

async function goLogin(page) {
    console.log("Mengunjungi halaman login")
    await navigateAndRetry(page, URL.BASE.LOGIN, 'Login')

    await page.evaluate((tahun) => {
        const hiddenInput = document.querySelector('input[name="tahun"]')
        if (hiddenInput) {
            hiddenInput.value = tahun
        }
    }, TAHUN)

    await page.type("input[name='username']", USER)
    await page.type("input[name='password']", PASSWORD)

    await page.click("button[type='submit']")

    await page.waitForSelector('.account-select-card')

    const account = await page.$('.account-select-card button')

    if (account) {
        await account.click()
    } else {
        console.log("no button")
    }

    await page.waitForNavigation()

    const cookiesObject = await page.cookies()
    const targetCookie = cookiesObject.find(cookie => cookie.name === 'X-SIPD-PU-TK')

    if (targetCookie) {
        updateEnv('TOKEN', targetCookie.value)
        console.log('TOKEN saved in .env file')

        fs.writeFile(cookiesFilePath, JSON.stringify(cookiesObject), function (err) {
            if (err) {
                console.log('The file could not be written.', err)
            }
            console.log('Session has been successfully saved')
        });
    } else {
        console.log('Cookie not found');
    }

}

async function goHome(page) {
    await navigateAndRetry(page, URL.BASE.HOME, 'Dashboard')
}


(async () => {

    let pathDpa = PATH.DPA
    for (const key in pathDpa) {
        if (Object.hasOwnProperty.call(pathDpa, key)) {
            const element = pathDpa[key]
            if (!fs.existsSync(element)) {
                fs.mkdirSync(element)
                // console.log(`Membuat Folder ${element}`)
            } else {
                // console.log(`Folder ${element} Sudah Ada`)
            }
        }
    }

    const browser = await puppeteer.launch({headless:false, devtools: true, defaultViewport:null, args:['--start-maximized'], executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'}) //, devtools: true, defaultViewport:null, args:['--start-maximized'] 
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(60000)

    try {
        if (!fs.existsSync(cookiesFilePath)) {
            await goLogin(page)
        } else {
            const cookiesString = fs.readFileSync(cookiesFilePath)
            const parsedCookies = JSON.parse(cookiesString)
            if (parsedCookies.length !== 0) {
                let exp = true
                for (let cookie of parsedCookies) {
                    if (cookie.name === 'X-SIPD-PU-IDENTITY') {
                        let now = new Date()
                        let cookieDay = new Date(cookie.expires * 1000)
                        if (now <= cookieDay) {
                            exp = !exp
                        } else {
                            exp = exp
                        }
                    }

                    if (cookie.name === 'X-SIPD-PU-TK') {
                        updateEnv('TOKEN', cookie.value)
                        // console.log('TOKEN updated in .env file')
                    }
                }

                if (exp) {
                    console.log('session expired')
                    await login(page)
                } else {
                    for (let cookie of parsedCookies) {
                        await page.setCookie(cookie)
                    }
                    console.log('Session has been loaded in the browser')
                    await goHome(page)
                }
            } else {
                await login(page)
            }
        }

        let apiKey = process.env.TOKEN, listSKPD = []

        if (!fs.existsSync(`${PATH.DPA.JSON}\\listSKPD.json`)){
            const skpdBelanja = await fetchGet(URL.API.VALIDASI.RAK.BELANJA.INDEX, apiKey, true)
            let urut = 1
            const progress = new cliProgress.SingleBar({
                format: 'Loading Data ' + colors.cyan('{bar}') + '| {percentage}%',
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
                hideCursor: true
            })

            progress.start(skpdBelanja.length, 0)

            for (const iterator of skpdBelanja) {
                const detailSkpdBelanja = await fetchGet(`${URL.API.VALIDASI.RAK.BELANJA.DETAIL}/${iterator.id_skpd}`, apiKey)
                let listDetail = groupBy(detailSkpdBelanja, 'id_sub_skpd')
                for (const key in listDetail) {
                    if (Object.hasOwnProperty.call(listDetail, key)) {
                        const element = listDetail[key];
                        listSKPD.push({
                            no: urut,
                            nama: element[0].nama_sub_skpd,
                            id_daerah: element[0].id_daerah,
                            id_skpd: element[0].id_skpd,
                            id_sub_skpd: element[0].id_sub_skpd,
                            id_unit: element[0].id_unit,
                        })
                        urut++
                    }
                }

                progress.increment()
            }

            progress.stop()

            fs.writeFile(`${PATH.DPA.JSON}\\listSKPD.json`, JSON.stringify(listSKPD), function (err) {
                if (err) {
                    console.log('File JSON tidak bisa disimpan', err)
                }
                console.log('List SKPD Lengkap Berhasil Disimpan')
            });
        }
            
        listSKPD = JSON.parse(fs.readFileSync(`${PATH.DPA.JSON}\\listSKPD.json`))

        // Halaman persetujuan menggunakan id_skpd (API.LIST_SKPD)
        await navigateAndRetry(page, `${URL.DPA.PERSETUJUAN}/277`, 'Halaman DPA Persetujuan')

        await page.waitForSelector('.chakra-modal__body');

        // Find the button with the specific text and click it
        const buttonSelector = await page.evaluate((jadwal) => {
            console.log(jadwal)
            const buttons = document.querySelectorAll('.chakra-modal__body .border .btn-primary');
            for (const button of buttons) {
                console.log(jadwal)
                const textElement = button.parentElement.querySelector('.font-12');
                if (textElement && textElement.innerText.includes(jadwal)) {
                    console.log(button)
                    return button;
                }
            }
            return null;
        }, JADWAL);

        console.log(buttonSelector)
        
        if (buttonSelector) {
            await page.click(buttonSelector);
            console.log('Button clicked');
        } else {
            console.log('Button not found');
        }

        // Halaman depan menggunakan id_skpd (API.LIST_SKPD)
        // Halaman SKPD menggunakan id_skpd (API.LIST_SKPD)
        // Halaman pendapatan menggunakan id_skpd tapi cek dulu apakah ada pendapatannya (API.PENDAPATAN)
        // Halaman belanja menggunakan id_skpd (API.LIST_SKPD)
        // Halaman rincian belanja menggunakan id_skpd (API.BELANJA) rincian-belanja/444/277/444/11/201/1186/8714/20337/print
        // Halaman pembiayaan menggunakan (API.PEMBIAYAAN)
        


        // const profile = await fetchGet(URL.API.PROFILE, apiKey)

        // const idDaerah = profile.idDaerah

        // await navigateAndRetry(page, URL.DPA.PERSETUJUAN, 'Persetujuan')

        // let listSKPD = await fetchGet(`${URL.API.LIST_SKPD}/${idDaerah}/${TAHUN}`, apiKey)

        // let dpaKeys = Object.keys(URL.DPA)

        // for (let index = 0; index < dpaKeys.length; index++) {
        //     const key = dpaKeys[index]
        //     const url = URL.DPA[key]
        //     console.log(index + 1, key)
        // }

    } catch (error) {
        console.log(error)
        await browser.close()
    }
})()