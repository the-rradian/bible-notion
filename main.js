import './style.css'

const searchBox = document.getElementById('search-box')
const searchBtn = document.getElementById('search-btn')
const clearBtn = document.getElementById('clear-btn')

const verseText = document.getElementById('verse-text')

  verseText.addEventListener('click', () => {

    navigator.clipboard.writeText(verseText.innerHTML);
    
})

clearBtn.addEventListener('click', () => {
  searchBox.value = ""
})

searchBtn.addEventListener('click', async () => {
  const reference = searchBox.value.trim()

    try {
      const params = parseReference(reference)
      const response = await fetch(`http://localhost:8080/verse?book=${params.book}&chapter=${params.chapter}&verse=${params.verse}`)
      const result = await response.json()

      if (result["data"]) {
        verseText.innerHTML = result["data"]["content"]
      } else
      verseText.innerHTML = "Verse not found"

    } catch (error) {
      console.error("Error: " + error)
      verseText.innerHTML = "Error: " + error
    }

})

function parseReference(verseString){
    // Regular expression to match the pattern "Book Chapter:Verse"
    const regex = /^([\w\s]+[^\d]+)(\d+)\s*:\s*(\d+)$/;
    const match = verseString.match(regex);
  
    // Check if the string matches the expected pattern and stores each value accordingly
    if (match) {
      const book = match[1].trim();
      const chapter = parseInt(match[2], 10);
      const verse = parseInt(match[3], 10);
  
      return {
        book: book,
        chapter: chapter,
        verse: verse
      };
    } else {
      throw new Error("Invalid verse format")
    }
  }

