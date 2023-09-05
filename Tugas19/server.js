const fs = require('fs')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const _dirname = path.resolve()
const datapath = path.join(_dirname, 'data', 'data.json')
const data = JSON.parse(fs.readFileSync(datapath, 'utf-8'))
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('list', { data })
})

app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', (req, res) => {
    let newData = { name: req.body.name, height: req.body.height, weight: req.body.weight, birthdate: req.body.birthdate, married: req.body.married }
    if (newData.married == 'true') {
        newData.married = true
        data.push(newData)
    } else {
        newData.married = false
        data.push(newData)
    }
    fs.writeFileSync(datapath, JSON.stringify(data), 'utf-8')
    res.redirect('/')
})

app.get('/delete/:index', (req, res) => { // create router delete
    const index = req.params.index
    data.splice(index, 1)
    res.redirect('/')
})

app.get('/edit/:index', (req, res) => { // create router delete
    const index = req.params.index
    const item = data[index]
    res.render('edit', { item })
})

app.post('/edit/:index', (req, res) => {
    const index = req.params.index
    data[index] = { name: req.body.name, height: req.body.height, weight: req.body.weight, birthdate: req.body.birthdate, married: req.body.married }
    if (data[index].married == 'true') data[index].married = true
    else data[index].married = false
    fs.writeFileSync(datapath, JSON.stringify(data), 'utf-8')
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})