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

app.get('/verse', async (req,res)=>{
    if (req.query){
        try {
            const verseContent = await retrieveVerse(req.query.book, req.query.chapter, req.query.verse)
            res.send(verseContent)
        } catch (error) {
            console.log(error)
        }
    } else 
    res.status(400).send('Bad request')//idk if this is correct but adding it just for now
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
    try {
        const response = await fetch(request)
        const result = response.json()
        return result
    } catch (error) {
        console.error("Error:", error)
        const errorMessage = "Error: " + error 
        return errorMessage
    }
}