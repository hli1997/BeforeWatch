const movieSearchBox = document.getElementById('movie-search-box')
movieSearchBox.addEventListener("click", findMovies);
movieSearchBox.addEventListener("keyup", findMovies);
const searchList = document.getElementById('search-list',displayMovieList);
const resultGrid = document.getElementById('result-grid');



// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=INSERT_API_KEY`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "src/img/image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=INSERT_API_KEY`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    let imageDescription = "The poster theme color";
    var background = new Image();
    background.crossOrigin = "Anonymous";
    background.alt = imageDescription;
    background.src = details.Poster;
    background.onload = function(){
        var rgb = getAverageColor(this);
        currentColor = "rgb(" + rgb.r + ", " + rgb.b + ", " + rgb.g + ")";
        document.getElementById("bg").style.backgroundColor = currentColor;
    }
   
    const path = "https://pbs.twimg.com/profile_images/527528131171590144/EQXs3lpX_400x400.png"
    resultGrid.innerHTML = `
    <div class = "movie-info" >
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">${details.Year}</li>
            <li class = "rated">· ${details.Rated}</li>
            <li class = "Runtime">· ${details.Runtime}</li>
        </ul>
        <p class = "directer"><b>Directed by</b> ${details.Director}</p>
        <div  class = "movie-poster">
        <img id = "poster" src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
        </div>
        <ul class = "movie-misc-info-2">
            <li class = "genre"> ${details.Genre}</p>
            <li class = "plot"> ${details.Plot}</p>
        </ul>
        <ul class = "movie-misc-info-3">
        
<li class = "ratings"><img class="ratingimg" src = "src/img/imdb_logo.png"> ${details.Ratings[0].Value}</li>
<li class = "ratings"><img class="ratingimg" src = "src/img/metascore_logo.png"> ${details.Ratings[1].Value}</li>
<li class = "ratings"><img class="ratingimg" src = "src/img/rotten_tomatoes_logo.svg.png"> ${details.Ratings[2].Value}</li>

</ul>
 

    </div>
    `
    const button = document.createElement('button');
    button.innerHTML = "Watch Trailer";
    button.id = "button";

    button.addEventListener('click', async function() {
        try {
            const youtubeLink = await getTrailer(details.Title);
            window.open(youtubeLink,'_blank');
        } catch (error) {
            console.error(error);
        }
    });
    resultGrid.appendChild(button);
      
    
}

function getAverageColor(img) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = img.naturalWidth;
    var height = canvas.height = img.naturalHeight;
  
    ctx.drawImage(img, 0, 0);
  
    var imageData = ctx.getImageData(0, 0, width, height);
    var data = imageData.data;
    var r = 0;
    var g = 0;
    var b = 0;
  
    for (var i = 0, l = data.length; i < l; i += 4) {
      r += data[i];
      g += data[i+1];
      b += data[i+2];
    }
  
    r = Math.floor(r / (data.length / 4));
    g = Math.floor(g / (data.length / 4));
    b = Math.floor(b / (data.length / 4));
  
    return { r: r, g: g, b: b };
  }


  async function getTrailer(movieName) {
    try {
      const youtubeKey = "INSERT_API_KEY";
      const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieName}+trailer&type=video&key=${youtubeKey}`;
      const response = await fetch(youtubeUrl);
      const data = await response.json();
      for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].snippet.title.includes(movieName)) {
           return trailerLink = `https://www.youtube.com/watch?v=${data.items[i].id.videoId}`;
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});