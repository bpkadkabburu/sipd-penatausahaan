const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cliProgress = require('cli-progress');
const colors = require('ansi-colors');

const updateEnv = (key, value) => {
    const envFile = fs.readFileSync('.env', 'utf8');
    const envLines = envFile.split('\n');
    const updatedLines = envLines.map(line => {
        if (line.startsWith(`${key}=`)) {
            return `${key}=${value}`;
        }
        return line;
    });

    // Write updated content back to .env file
    fs.writeFileSync('.env', updatedLines.join('\n'));
};

const fetchGet = async (url, apiKey, paginate = false) => {
    try {

        if (paginate) {
            let page = 1
            let totalData = 0
            let allData = []

            const response = await fetch(`${url}?page=${page}&limit=50`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            })

            const progress = new cliProgress.SingleBar({
                format: 'Loading Data ' + colors.cyan('{bar}') + '| {percentage}%',
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
                hideCursor: true
            });

            let data = await response.json();

            const headers = response.headers

            const totalCount = headers.get('x-pagination-total-count')
            const pageCount = headers.get('x-pagination-page-count')
            progress.start(totalCount, 0);
            
            if ('items' in data) {
                data = data.items
            }
            
            allData = allData.concat(data)

            totalData += data.length

            progress.update(totalData)


            while (page < pageCount) {
                page++
                const response = await fetch(`${url}?page=${page}&limit=50`, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                });

                let data = await response.json();

                if ('items' in data) {
                    data = data.items
                }

                allData = allData.concat(data)

                totalData += data.length
                progress.update(totalData)
            }

            progress.stop()

            return allData
        } else {

            const response = await fetch(url, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            })

            let data = await response.json();

            if ('items' in data) {
                data = data.items
            }

            return data
        }

    } catch (error) {
        console.log(`Error get data`, error)
    }

}

const groupBy = (element, key) => {
    return element.reduce((accumulator, currentValue) => {
        (accumulator[currentValue[key]] = accumulator[currentValue[key]] || []).push(currentValue);
        return accumulator;
    }, {})
}

function total(x, y) {
    return x.reduce((acc, item) => {
        let value = item[y]
        if (typeof value === 'undefined') {
            value = 0
        }
        return acc + parseFloat(value)
    }, 0)
}

module.exports = {
    updateEnv,
    fetchGet,
    groupBy,
    total
}