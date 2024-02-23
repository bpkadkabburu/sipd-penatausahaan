const listDinas = require('./listDinas.json')
const XLSX = require('xlsx-js-style')
const fs = require('fs')
const path = require('path')
const {
  TABEL
} = require('./tabelGaji')

require('dotenv').config()

let token = process.env.TOKEN

let listBulan = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

// Buat mengubah format yang telah diinput sama SKPD, karena kadang formatnya lucu
// possible format I A, I-A, I/A, I / A, dan bentuk huruf kecilnya
const standardizeGolongan = (originalGolongan) => {
  // Remove slashes
  let standardizedGolongan = originalGolongan.replace('/', '').toUpperCase();

  // Extract the Roman numeral (I/II/III/IV)
  const romanNumeral = standardizedGolongan.match(/^[IV]+/);

  // Convert the Roman numeral to its Arabic numeral equivalent
  if (romanNumeral) {
    switch (romanNumeral[0]) {
      case 'I':
        standardizedGolongan = '1' + standardizedGolongan.substring(standardizedGolongan.length - 1);
        break;
      case 'II':
        standardizedGolongan = '2' + standardizedGolongan.substring(standardizedGolongan.length - 1);
        break;
      case 'III':
        standardizedGolongan = '3' + standardizedGolongan.substring(standardizedGolongan.length - 1);
        break;
      case 'IV':
        standardizedGolongan = '4' + standardizedGolongan.substring(standardizedGolongan.length - 1);
        break;
      default:
        // If no valid Roman numeral found, return original value
        return originalGolongan;
    }
  }

  return standardizedGolongan;
};

const cariGaji = (gaji, mode) => {
  for (const category in TABEL) {
    for (const key in TABEL[category]) {
      const data = TABEL[category][key];
      if (data.LAMA === gaji) {
        if(mode === 'golongan'){
          return category
        } 

        if(mode === 'mkg'){
          return key
        }
      }
    }
  }

  return 'not found'
}

async function getData(limit){
  for (const [index, value] of listBulan.entries()) {
    let element = `./GAJI/${index+1}. ${value}`
    if(!fs.existsSync(element)){
      fs.mkdirSync(element)
      console.log(`Membuat Folder ${element}`)
    } else {
      console.log(`Folder ${element} Sudah Ada`)
    }
  }

  for (const [indexDinas, dinas] of listDinas.entries()) {
    
    for (const [index, value] of listBulan.entries()) {
      try {
        let nama_dinas = dinas.nama_skpd
        let id_skpd = dinas.id_skpd
        console.log(`Mengambil data pegawai ${nama_dinas} bulan ${value}`)

        let month = index + 1

        // SPECIAL BREAK HERE
        if(month > limit){
          break;
        }

        let page = 1
        let totalData = 0
        let allData = []

        const response = await fetch(`https://service.sipd.kemendagri.go.id/pengeluaran/strict/gaji-pegawai?id_skpd=${id_skpd}&page=${page}&limit=50&bulan=${month}&nama_pegawai=&nip_pegawai=`, {
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
          const response = await fetch(`https://service.sipd.kemendagri.go.id/pengeluaran/strict/gaji-pegawai?id_skpd=${id_skpd}&page=${page}&limit=50&bulan=${month}&nama_pegawai=&nip_pegawai=`, {
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

        let pathJson = `GAJI\\${index+1}. ${value}\\${indexDinas+1}. ${nama_dinas}.json`
        if(fs.existsSync(pathJson)){
          fs.unlinkSync(pathJson)
        }

        fs.writeFile(pathJson, JSON.stringify(allData), function(err) { 
            if (err) {
                console.log('File JSON tidak bisa disimpan', err)
            }
            console.log('Data Berhasil Disimpan')
        });
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    }
  }
}


function convertData(limit){
  let workbook = XLSX.utils.book_new()
  for (const [index, value] of listBulan.entries()) {
    if((index+1) > limit){
      break;
    }
    const folderPath = `GAJI\\${index+1}. ${value}`;
    const outputFile = `GAJI\\Gaji Pegawai ${index+1}. ${value}.json`;
    const concatenatedData = [];
    let filesProcessed = 0;

    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }

      files.forEach(file => {
        if (path.extname(file) === '.json') {
          const filePath = path.join(folderPath, file);
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading file:', err);
              return;
            }
            try {
              let jsonData = JSON.parse(data);

              jsonData = jsonData.map(obj => {
                let golonganBaru, golonganSesuaiGapok, mkgSesuaiGapok, 
                gajiSeharusnya, gajiSesuaiGolonganMkgLama,  notfound = 0, mkgMaksimal,
                gajiBaru;
                try {
                  golonganBaru = standardizeGolongan(obj.golongan)
                  
                  golonganSesuaiGapok = cariGaji(obj.belanja_gaji_pokok, 'golongan')
                  
                  if(golonganSesuaiGapok === 'not found'){
                    notfound++
                    golonganSesuaiGapok = golonganBaru
                  }

                  mkgSesuaiGapok = cariGaji(obj.belanja_gaji_pokok, 'mkg')
                  if(mkgSesuaiGapok === 'not found'){
                    notfound++
                    mkgSesuaiGapok = obj.mkg
                  }

                  gajiSeharusnya = TABEL[golonganSesuaiGapok][mkgSesuaiGapok]['LAMA']
                  gajiBaru = TABEL[golonganSesuaiGapok][mkgSesuaiGapok]['BARU']
                  
                  if (TABEL[golonganBaru][obj.mkg]) {
                    gajiSesuaiGolonganMkgLama = TABEL[golonganBaru][obj.mkg]['LAMA']
                  } else {
                    if(obj.mkg >  Object.keys(TABEL[golonganBaru]).length){
                      mkgMaksimal = Object.keys(TABEL[golonganBaru]).length - 1
                    }
                    gajiSesuaiGolonganMkgLama = TABEL[golonganBaru][mkgMaksimal]['LAMA']
                  }

                  if(obj.belanja_gaji_pokok === gajiSesuaiGolonganMkgLama){
                    mkgSesuaiGapok = obj.mkg
                  }

                  return {
                    ...obj,
                    raw:{
                      tunjangan_beras_per_tanggungan: 72420,
                      jumlah_keluarga: (1 + parseInt(obj.jumlah_tanggungan) ),
                      golongan_baru: golonganBaru,
                      golongan_sesuai_gaji_pokok_dibayar: golonganSesuaiGapok,
                      is_golongan_sesuai_gapok: golonganSesuaiGapok === golonganBaru,
                      mkg_sesuai_gaji_pokok_dibayar: mkgSesuaiGapok,
                      is_mkg_sesuai_gapok: mkgSesuaiGapok === obj.mkg,
                      gaji_golongan_mkg_sesuai_dibayar: gajiSeharusnya,
                      gaji_golongan_mkg_yang_seharusnya: gajiSesuaiGolonganMkgLama,
                      is_gaji_sesuai_golongan_mkg: obj.belanja_gaji_pokok === gajiSesuaiGolonganMkgLama,
                      is_gaji_sesuai_golongan_mkg_dibayar: obj.belanja_gaji_pokok === gajiSeharusnya,
                      flag_not_found: notfound,
                    },
                    belanja_gaji_pokok_baru: 3861000,
                    belanja_tunjangan_keluarga_baru: 540540,
                    belanja_tunjangan_jabatan_baru: 0,
                    belanja_tunjangan_fungsional_baru: 0,
                    belanja_tunjangan_fungsional_umum_baru: 185000,
                    belanja_tunjangan_beras_baru: 289680,
                    belanja_tunjangan_pph_baru: 0,
                    belanja_pembulatan_gaji_baru: 68,
                    belanja_iuran_jaminan_kesehatan_baru: 183462,
                    belanja_iuran_jaminan_kecelakaan_kerja_baru: 9266,
                    belanja_iuran_jaminan_kematian_baru: 27799,
                    belanja_iuran_simpanan_tapera_baru: 0,
                  }
                } catch (error) {
                  console.log(error)
                  console.log(`${obj.belanja_gaji_pokok} - ${golonganSesuaiGapok} - ${mkgSesuaiGapok} - ${mkgMaksimal} - ${obj.nip_pegawai} - ${obj.nama_pegawai}`)
                  console.log(`${obj.belanja_gaji_pokok} - ${golonganBaru} - ${obj.mkg} - ${mkgMaksimal} - ${obj.nip_pegawai} - ${obj.nama_pegawai}`)
                }
                
                
              })

              concatenatedData.push(...jsonData);
              filesProcessed++
              if (filesProcessed === files.length) {
                console.log('Jumlah Pegawai ' + concatenatedData.length)
                // All files have been read, write concatenated data to output file
                fs.writeFile(outputFile, JSON.stringify(concatenatedData, null, 2), err => {
                  if (err) {
                    console.error('Error writing output file:', err);
                  } else {
                    console.log('Data pegawai disimpan ', outputFile);
                  }
                });
              }
            } catch (error) {
              console.error('Error parsing JSON from file:', error);
            }
          });
        }
      });

    });
  //   for (const key in parsedData) {
  //     if (Object.hasOwnProperty.call(parsedData, key)) {
  //       const element = parsedData[key];
  //       excelData.push(
  //         [
  //           {t:"s", v:"Nama Pegawai", s:{font:{bold:true, name: "Calibri", sz: 9}}}, 
  //           {t:"s", v:"Nama Pegawai", s:{font:{bold:true, name: "Calibri", sz: 9}}}, 
  //           "", 
  //           "", 
  //           ""
  //         ],
  //         ["", "", "", ""],
  //         [
  //           {t:"s", v:"Kode", s:{font:{bold:true, name: "Calibri", sz: 9}}}, 
  //           {t:"s", v:"Urusan / Bidang Urusan / Program / Kegiatan / Sub Kegiatan", s:{font:{bold:true, name: "Calibri", sz: 9}}}, 
  //           {t:"s", v:"Nama Sumber Dana", s:{font:{bold:true, name: "Calibri", sz: 9}}}, 
  //           {t:"s", v:"Pagu Indikatif (Rp)", s:{font:{bold:true, name: "Calibri", sz: 9}}}, 
  //         ],
  //         [
  //           {t:"s", v:duplicate[0].kode_sub_skpd + " " + key, s:{font:{bold:true, name: "Calibri", sz: 9}}}, 
  //           "", 
  //           "", 
  //           {t:"n", z:"#,##0.00", v:total(duplicate, 'pagu_indikatif'), s:{font:{bold:true, name: "Calibri", sz: 9}}}
  //         ]
  //       )
  //     }
  //   }

  //   const worksheet = XLSX.utils.aoa_to_sheet(excelData);
  //   worksheet["!cols"] = [ { wpx: 185 }, { wpx: 470 }, { wpx: 580 }, { wpx: 125 }, { wpx: 205 } ];

  //   XLSX.utils.book_append_sheet(workbook, worksheet, `${index+1}. ${value}`);

  }

  // XLSX.writeFile(workbook, "DAFTAR GAJI PEGAWAI.xlsx", { compression: true });
}

function premature(limit){
  for (const [index, value] of listBulan.entries()) {
    if((index+1) > limit){
      break;
    }

    const outputFile = `GAJI\\Gaji Pegawai ${index+1}. ${value}.json`;
    const jsonData = fs.readFileSync(outputFile, 'utf-8')
    const parsedData = JSON.parse(jsonData)
    const outputGajiTidakSesuai = `GAJI\\Gaji Pegawai ${index+1}. ${value} - TIDAK SESUAI.json`;
    let dataTidakSesuai = []
    let countFalse = 0;

    parsedData.forEach(entry => {
      //  || entry.is_mkg_sesuai_gapok === false || entry.is_gaji_sesuai_golongan_mkg === false
      if (entry.is_gaji_sesuai_golongan_mkg_dibayar === false) {
        countFalse++;
        dataTidakSesuai.push(entry)
      }
    });

    console.log("GAJI TIDAK SESUAI ", countFalse, " PEGAWAI")

    fs.writeFile(outputGajiTidakSesuai, JSON.stringify(dataTidakSesuai, null, 2), err => {
      if (err) {
        console.error('Error writing output file:', err);
      } else {
        console.log('Data pegawai disimpan ', outputGajiTidakSesuai);
      }
    });
  }
}

// mainkan ini saja mau ambil, convert, atau cek yang prematur

// getData(2);
// convertData(2);
premature(2)