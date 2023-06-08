const fs = require('fs')
const axios = require('axios')
const https = require('https')

const filenames = fs.readdirSync('./documents')

const pdfs = filenames.filter(f => {
    const result = f.includes('.pdf') ? true : false
    return result
})

const agent = new https.Agent({
    rejectUnauthorized: false
});

for (const pdf of pdfs) {
    console.log(pdf)
    axios.post(`https://demo.azure.com/blob?filename=${pdf}`, fs.readFileSync(`./documents/${pdf}`), { httpsAgent: agent })
}