function getElement(id) {
    return document.getElementById(id);
}

function elementClass(name) {
    return document.getElementsByClassName(name);
}
//Generic API Module Code
var api = (function() {
    function apiCall(method, url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                cb(JSON.parse(xhr.responseText));
            } else {
                console.log("Waiting for response");
            }
        };
        xhr.open(method, url, true);
        xhr.send();
    }
    return {
        apiCall: apiCall
    };
})();

//Input Value module
var input = (function() {
    function inputValue() {
        window.event.preventDefault();
        console.log(window.event.target[0].value);
        return window.event.target[0].value;
    }
    return {
        inputValue: inputValue
    };
})();


//Movielist module
var createMovieList = (function() {

    function appendSection(e) {

        var movieTitles = elementClass('movielist__item');

        for (var i = 0; i < movieTitles.length; i++) {
            if (movieTitles[i].childNodes.length > 1) {
                movieTitles[i].childNodes[1].remove();
            }
        }

        //Stops appending duplicate sections
        //Maybe add film
        if (e.target.childNodes.length < 2) {
            var section = document.createElement('section');
            section.classList.add('moviecontent');
            e.target.appendChild(section);

            //Gif callback
            api.apiCall("GET", createsURL.generateGifUrl(e.target.innerText), gif_trailer.gif);

            //movieTrailer callback
             api.apiCall("GET", createsURL.generateTrailerObjectUrl(e.target.value), gif_trailer.youtubeEmbed);


        }
    }

    function appendList(arr, val) {
        var i = 0;
        var ul = document.createElement('ul');
        ul.classList.add('movie__ul');
        var movieList = document.getElementById('movieList');

        if (movieList.childNodes.length > 1) {
            movieList.childNodes[1].remove();
        }

        if (movieList.childNodes.length === 1) {
            movieList.appendChild(ul);
            arr.forEach(function(el) {
                var li = document.createElement('li');
                li.classList.add('movielist__item');
                eventListener.createEventListener(li, 'click', appendSection);
                ul.appendChild(li);
                li.textContent = val[i].title;
                li.value = val[i].id;
                i++;
            });
        }


    }


    return {
        appendList: appendList,
        appendSection: appendSection
    };

})();
//addEventListener
var eventListener = (function() {

    function createEventListener(element, action, cb) {
        element.addEventListener(action, cb);
    }

    return {
        createEventListener: createEventListener
    };

})();

//create url
var createsURL = (function() {


    function genreId() {
        var url = "https://api.themoviedb.org/3/genre/movie/list?api_key=a2230c2d2bfec8e19602e73fa268f106&language=en-US";
        return url;
    }

    function generateGenreUrl(id) {
        var url = 'https://api.themoviedb.org/3/genre/' + id + '/movies?api_key=a2230c2d2bfec8e19602e73fa268f106&language=en-US&include_adult=false&sort_by=created_at.asc';
        console.log(url);
        return url;
    }

    function generateGifUrl(movie) {
        var url = 'http://api.giphy.com/v1/gifs/search?q=&api_key=dc6zaTOxFJmzC&lang=en&limit=3&q=' + encodeURIComponent(movie+'film');
        return url;
    }

    function generateTrailerObjectUrl(movie_id) {
        var url = 'https://api.themoviedb.org/3/movie/' + movie_id + '/videos?api_key=a2230c2d2bfec8e19602e73fa268f106&language=en-US';
        return url;
    }

    function generateTrailerUrl(filmKey) {
        var url = 'https://www.youtube.com/embed/' + filmKey;
        console.log(url);
        return url;
    }

    return {
        genreId: genreId,
        generateGenreUrl: generateGenreUrl,
        generateGifUrl: generateGifUrl,
        generateTrailerObjectUrl: generateTrailerObjectUrl,
        generateTrailerUrl: generateTrailerUrl

    };
})();


//Beginning of webapp Process
var start = (function() {

    //Attach listeners
    eventListener.createEventListener(document.getElementById('form'), 'submit', (function() {
        api.apiCall('GET', createsURL.generateGenreUrl(input.inputValue()), (function(o) {
            console.log(o);
            createMovieList.appendList(o.results, o.results);

        }));

    }));



    api.apiCall("GET", createsURL.genreId(), function(object) {

        var select = document.getElementById('select');

        object.genres.forEach(function(element) {
            //Create element module
            var option = document.createElement('option');
            select.appendChild(option);
            option.textContent = element.name;
            option.value = element.id;
        });

    });


})();

// Module that contains functions that will populate the elemnt with 3 Gifs and a trailer
var gif_trailer = (function(){

  function gif(object) {
    for (var i = 0; i < 3; i++) {
        var gifUrl = object.data[i].images.fixed_width_small.url;
        var imageTag = document.createElement('img');
        imageTag.src = gifUrl;
        imageTag.classList.add('gifs');
        elementClass('moviecontent')[0].appendChild(imageTag);
    }
  }

  function youtubeEmbed(obj){

     var src = createsURL.generateTrailerUrl(obj.results[0].key);
     var iframe = document.createElement('iframe');
     iframe.src= src;
     elementClass('moviecontent')[0].appendChild(iframe);

  }

  return {
    gif: gif,
    youtubeEmbed: youtubeEmbed
  };


})();
