# Notion Bible (bible-notion)
 A webpage meant to be used as a Notion widget for quickly fetching a single Bible verse. Built because I was tired of manually typing in verses into my Notion journal. Made using the API provided by [API.Bible](https://scripture.api.bible).

## Backend 

The backend is written in JavaScript using Node.js, and using Express as the API framework.

How it works: 
1. On start-up, it requests a list of all Bible books from API.Bible and stores it in a JavaScript object. 
2. On each request, it takes the request parameters that should be included and formats a request to send to the Bible API. Upon receiving a response, it sends the data to the client.

The backend is deployed to a Google Cloud App Engine. 

## Frontend

The front end is a basic HTML webpage with some JavaScript code to give it interactivity and CSS to make it re-sizeable. It uses Vite as a build tool. 

How it works: 
1. When the user clicks "Get verse", the text in the input box is parsed using a regular expression. If the input is correct, the book, chapter, and verse are stored accordingly and formatted into a request which is sent to the backend. 
2. Upon receiving the data successfully, it displays the verse in the `#verse-text` element. The user can also click this element to quickly copy the verse and its reference to the clipboard.*

The front end is deployed to GitHub Pages using GitHub Actions. GitHub Actions is necessary because it's not simply serving some files, but using a build step. It allows one to define a CI workflow to build and deploy the project. I used the sample workflow provided in the [Vite documentation](https://vitejs.dev/guide/static-deploy.html). This checks out the branch, sets up the Node environment, runs `npm install` to install dependencies, runs `npm run build` to build the project, and then serves the files in the `dist` folder. 

*This function uses the new Clipboard API which might not yet work correctly in every browser, but I elected to use it because it's currently supported in most major browsers.
