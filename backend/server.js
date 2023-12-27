import * as dotenv from 'dotenv'
dotenv.config()

import path from 'path'

import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

const apiURL = "https://api.scripture.api.bible/v1/bibles"
const apiKey = process.env.API_KEY

const headers = new Headers()
headers.append("api-key", apiKey)

const versions = new Map()
versions.set("ASV", "06125adad2d5898a-01")
versions.set("WEB", "9879dbb7cfe39e4d-03")
versions.set("KJV", "de4e12af7f28f599-02")

const books = await getBooks()

app.get('/verse', async (req,res,next) => {
    
    let version = ""
    if(req.query.version){ 
        version = versions.get(req.query.version)
    } else {
        version = versions.get("ASV")
    }
    if (req.query.book && req.query.chapter && req.query.verse){
        try {
            const verseContent = await retrieveVerse(version,req.query.book, req.query.chapter, req.query.verse)
            res.send(verseContent)
        } catch (error) {
            next(error)
            res.status(404).send({"status": 404, "message":"Verse not found"})
        }
    } else 
    res.status(400).send({"status": 400, "message":"Request parameters missing"})
})

app.set('trust proxy', true)
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`App listening on port ${PORT}...`))

async function retrieveVerse(version,book,chapter,verse){
    
    const bookID = getBookID(book)
    const request = new Request(`${apiURL}/${version}/verses/${bookID}.${chapter}.${verse}?content-type=text&include-verse-numbers=false`, {
        method: "GET",
        headers: headers,
        mode: "cors",
        cache: "default"
    })
    const response = await fetch(request)

    if (response.ok) {
            return response.json(); 
    } else { 
        throw new Error("Could not retrieve verse")
    }
}

function getBookID(bookName){
    try {

       // const bstring = JSON.stringify(booksString)
        const jsonArray = books.data
        const foundObject = jsonArray.find(obj => obj.name.toUpperCase() === bookName.toUpperCase())
    
        if (foundObject) {
            return foundObject.id
        } else {
            //console.error("Book not found")
            throw new Error("Book not found")
        }
    } catch (error) {
        console.error('Error parsing JSON:', error)
        return null
    }
}

/**This function retrieves the list of Bible books from the API for the American Standard Version specifically, 
 * but that list should work for all versions
 */
async function getBooks(){ 

    const request = new Request(`${apiURL}/${versions.get("ASV")}/books`, { 
        method: "GET",
        headers: headers,
        mode: "cors",
        cache: "default"
    })

    const response = await fetch(request)

    if (response.ok) {
            return response.json(); // Get JSON value from the response body
    } else { 
        throw new Error("Could not retrieve books")
    }
}