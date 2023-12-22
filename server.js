import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

import data from './books.json' assert {type: 'json'}
const booksString = JSON.stringify(data.data)

const apiURL = "https://api.scripture.api.bible/v1/bibles"
const bibleVersion = "06125adad2d5898a-01" // American Standard Version 
const apiKey = process.env.BIBLE_API

const headers = new Headers()
headers.append("api-key", apiKey)

app.get('/verse', async (req,res, next)=>{
    if (req.query.book && req.query.chapter && req.query.verse){
        try {
            const verseContent = await retrieveVerse(req.query.book, req.query.chapter, req.query.verse)
            res.send(verseContent)
        } catch (error) {
            next(error)
            res.status(404).send({"status": 404, "message":"Verse not found"})
        }
    } else 
    res.status(400).send({"status": 400, "message":"Request parameters missing"})
})

app.listen(3000, () => console.log("App listening on port 3000"))

async function retrieveVerse(book,chapter,verse){
    
    const bookID = getBookID(book)
    const request = new Request(`${apiURL}/${bibleVersion}/verses/${bookID}.${chapter}.${verse}?content-type=json`, {
        method: "GET",
        headers: headers,
        mode: "cors",
        cache: "default"
    })
    const response = await fetch(request)

    if (response.ok) {
            return response.json(); // Get JSON value from the response body
    } else { 
        const errorMessage = "Something happened" 
        throw new Error(errorMessage)
    }
}

function getBookID(bookName){
    try {
        // Parse the JSON string into a JavaScript object
        const jsonArray = JSON.parse(booksString)
        const foundObject = jsonArray.find(obj => obj.name.toUpperCase() === bookName.toUpperCase())
    
        if (foundObject) {
            return foundObject.id
        } else {
            console.error("Book not found")
            throw new Error("Book not found")
        }
    } catch (error) {

        console.error('Error parsing JSON:', error)
        return null
    }
}