import './style.css'

const searchBox = document.getElementById('search')
const searchBtn = document.getElementById('search-btn')
const clearBtn = document.getElementById('clear-btn')

const verseText = document.getElementById('verse-content')
const verseReference = document.getElementById('reference')

clearBtn.addEventListener('click', () => {
  searchBox.value = ""
})

searchBtn.addEventListener('click', async () => {
  const reference = searchBox.value.trim()

    try {
      const parameters = parseReference(reference)
    } catch (error) {
      verseText.innerHTML = error
    }

  const response =  await callAPI(parameters)
  const result = response.json()

  if (result["data"]) {
    verseText.innerHTML = result["data"]["content"][0]["items"][1]["text"]
    verseReference.innerHTML = result["data"]["reference"]
  } else
  verseText.innerHTML = "Verse not found or invalid format"
  verseReference.innerHTML = ""
})

async function callAPI(params){
  try {
    const response = await fetch(`http://localhost:3000/verse?book=${params.book}&chapter=${params.chapter}&verse=${params.verse}`)
    return response
  } catch (error) {
    console.error("Error: " + error)
    return null
  }
}

function parseReference(verseString){
    // Regular expression to match the pattern "Book Chapter:Verse"
    const regex = /^([\w\s]+)(\d+)\s*:\s*(\d+)$/;
  
    // Use the regex to extract book, chapter, and verse
    const match = verseString.match(regex);
  
    // Check if the string matches the expected pattern
    if (match) {
      const book = match[1].trim();
      const chapter = parseInt(match[2], 10);
      const verse = parseInt(match[3], 10);
  
      // Create and return the verse object
      return {
        book: book,
        chapter: chapter,
        verse: verse
      };
    } else {
      // Return null or handle invalid input as needed
      throw new Error("Invalid verse format")
    }
  }

