import './style.css'

const searchBox = document.getElementById('search-box')
const searchBtn = document.getElementById('search-btn')
const clearBtn = document.getElementById('clear-btn')
// const toggleBtn = document.getElementById('toggle-btn')
const select = document.getElementById('version-select')
const verseText = document.getElementById('verse-text')
let currentVerse = ""

/** This event listener copies the verse text to the clipboard.
 * Clipboard API might not work properly on every browser yet
 */
  verseText.addEventListener('click', () => {

    navigator.clipboard.writeText("\"" + verseText.innerHTML.trim() + "\" " + currentVerse); 
    
})

clearBtn.addEventListener('click', () => {
  searchBox.value = ""
})

searchBtn.addEventListener('click', async () => {
  const reference = searchBox.value.trim()

    try {
      const params = parseReference(reference)
      const response = await fetch(`https://notion-bible.uc.r.appspot.com/verse?book=${params.book}&chapter=${params.chapter}&verse=${params.verse}&version=${select.value}`)
      const result = await response.json()

      if (result["data"]) {
        verseText.innerHTML = result["data"]["content"]
        currentVerse = result["data"]["reference"]
      } else
      verseText.innerHTML = "Verse not found"

    } catch (error) {
      console.error(error)
      verseText.innerHTML = error
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

