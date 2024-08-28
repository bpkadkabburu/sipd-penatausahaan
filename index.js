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

    try {
        

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