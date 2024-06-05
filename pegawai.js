const fs = require('fs')
const path = require('path')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()
let token = process.env.TOKEN

async function download(){
    

    let page = 1
    let totalData = 0
    let allData = []

    const response = await fetch(`https://service.sipd.kemendagri.go.id/auth/strict/user-manager?page=${page}&limit=100000`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    });

    const headers = response.headers
    let data = await response.json();

    allData = allData.concat(data)

    totalData += data.length

    const totalCount = headers.get('x-pagination-total-count')
    const pageCount = headers.get('x-pagination-page-count')

    console.log(`-- Progress ${page}/${pageCount} | ${totalData}/ ${totalCount} | ${allData.length} --`)

    while (page < pageCount) {
        page++
        const response = await fetch(`https://service.sipd.kemendagri.go.id/auth/strict/user-manager?page=${page}&limit=100000`, {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });

        let data = await response.json();

        allData =  allData.concat(data)

        totalData += data.length
        console.log(`-- Progress ${page}/${pageCount} | ${totalData}/ ${totalCount} | ${allData.length} --`)
    }

    console.log(`Data Berhasil Diambil | ${allData.length}`)

    let pathJson = `JSON\\pegawai.json`
    if(fs.existsSync(pathJson)){
        fs.unlinkSync(pathJson)
    }

    fs.writeFile(pathJson, JSON.stringify(allData), function(err) { 
        if (err) {
            console.log('File JSON tidak bisa disimpan', err)
        }
        console.log('Data Berhasil Disimpan')
    });
}

function cariPegawai (){
    fs.readFile('./JSON/pegawai.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        let jsonData = JSON.parse(data);
        // console.log(jsonData)
        const ketemu = jsonData.find(item => item.id_user === 280375);
        console.log(ketemu)

    })
}

// download()

cariPegawai()