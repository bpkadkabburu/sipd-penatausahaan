const fs = require('fs')
const {
    fetchGet,
} = require('./lib/utils')

async function get() {
    let apiKey = process.env.TOKEN
    const listPencairan = await fetchGet(`https://service.sipd.kemendagri.go.id/pengeluaran/strict/sp2d/pembuatan/index?status=ditransfer`, apiKey, true)

    console.log(listPencairan)
    // console.log(`Data Berhasil Diambil | ${listPencairan.length}`)

    let pathJson = `pencairan.json`
    if (fs.existsSync(pathJson)) {
        fs.unlinkSync(pathJson)
    }

    fs.writeFile(pathJson, JSON.stringify(listPencairan), function (err) {
        if (err) {
            console.log('File JSON tidak bisa disimpan', err)
        }
        console.log('Data Berhasil Disimpan')
    });
}

get()

let dateInput = document.querySelector('input[type="date"]');
let newDate = "2024-01-08";
dateInput.value = newDate;
const reactProps = Object.keys(dateInput).find(key => key.startsWith('__reactProps') || key.startsWith('__reactEventHandlers'));
if (reactProps) {
    dateInput[reactProps].onChange({
        target: { value: newDate },
        bubbles: true
    });
} else {
    console.error('Tidak dapat menemukan properti React internal untuk elemen ini.');
}