function groupBy(element, x){
    return element.reduce((accumulator, currentValue) =>{
        (accumulator[currentValue[x]] = accumulator[currentValue[x]] || []).push(currentValue);
        return accumulator;
    }, {})
}

function groupByLength(array, key) {
  return array.reduce((acc, obj) => {
    const keyValue = obj[key];
    acc[keyValue] = (acc[keyValue] || 0) + 1;
    return acc;
  }, {});
}

function sortObjectKeys(obj) {
  const sortedKeys = Object.keys(obj).sort();
  const sortedData = {};
  sortedKeys.forEach(key => {
    sortedData[key] = obj[key];
  });
  return sortedData;
}

function calculateTotal(dictionary) {
  let total = 0;
  for (let key in dictionary) {
    total += dictionary[key];
  }
  return total;
}

const data = require('./GAJI/Gaji Pegawai 1. Januari.json')

const groupedDataBaru = groupBy(data, 'golongan_baru');

const sortedDataBaru = sortObjectKeys(groupedDataBaru);

for (const key in sortedDataBaru) {
  if (Object.hasOwnProperty.call(sortedDataBaru, key)) {
    console.log(key);
    const element = sortedDataBaru[key];
    const listMkg = groupBy(element, 'mkg')

    for (const keyMkg in listMkg) {
      if (Object.hasOwnProperty.call(listMkg, keyMkg)) {
        console.log("   -",keyMkg)
        const elementMkg = listMkg[keyMkg];

        const listGaji = groupBy(elementMkg, 'belanja_gaji_pokok')

        for (const keyGapok in listGaji) {
          if (Object.hasOwnProperty.call(listGaji, keyGapok)) {
            const gapok = listGaji[keyGapok];
            const gapokLength = groupByLength(gapok, 'belanja_gaji_pokok')
            console.log("-------", keyGapok, " | ", gapokLength[keyGapok])
          }
        }
      }
    }
    
  }
}

// console.log(sortedDataBaru);
// console.log("Total:", calculateTotal(sortedDataBaru));
