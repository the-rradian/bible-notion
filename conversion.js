import data from './books.json' assert {type: 'json'}
const booksString = JSON.stringify(data.data)

const jsonArray = JSON.parse(booksString)
let bookMap = new Map()
for (let i = 0; i < jsonArray.length; i++){
    bookMap.set(jsonArray[i]["name"], jsonArray[i]["id"])
}

//console.log(bookMap)

