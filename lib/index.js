const getArtistSongs = (q) => {
  fetch(`https://api-play.herokuapp.com/api/v1/search`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'artist': q
    })
  })
    .then(response => response.json())
    .then(parsedResponse => compileArtistSongs(parsedResponse))
    .catch(error => console.error({ error }));
}

const compileArtistSongs = (artistData) => {
  artistData.forEach(song => {
    displayArtistSongs(song);
  });
}

const displayArtistSongs = (song) => {
  $('.songs-index-table').append(`
    <tr class="song-table-row">
      <td class="song-cell"><button class="song-row song-fav-btn" type="button">Favorite</button></td>
      <td class="song-cell" id="song-cell-title-">${song.title}</td>
      <td class="song-cell" id="song-cell-artist">${song.artist}</td>
      <td class="song-cell" id="song-cell-genre">${song.genre}</td>
      <td class="song-cell" id="song-cell-rating">${song.rating}</td>
    </tr>`)
}

const postFavorite = (songData) => {
  fetch('https://api-play.herokuapp.com/api/v1/songs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: songData[3].innerText,
      artist: songData[5].innerText,
      genre: songData[7].innerText,
      rating: songData[9].innerText
    })
  });
}

const postPlaylist = (playlistData) => {
  fetch('https://api-play.herokuapp.com/api/v1/playlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: playlistData
    })
  });
}

const postPlaylistSong = (playlist, song) => {
  fetch(`https://api-play.herokuapp.com/api/v1/playlists/${playlist}/songs/${song}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
}

const getFavoriteSongs = () => {
  fetch('https://api-play.herokuapp.com/api/v1/favorites')
  .then((response) => response.json())
  .then((songsData) => compileFavoriteSongs(songsData))
  .catch((error) => console.error({ error }));
}

const compileFavoriteSongs = (songsData) => {
  songsData.forEach(song => {
    displayFavoriteSongs(song);
  });
  getPlaylistsDropdown();
  $(".add-song-button").on("click", (event) => {
    var playlist = event.currentTarget.parentElement.parentElement.children[0].children[0].value
    var songId = event.currentTarget.parentElement.parentElement.children[2].innerText
    postPlaylistSong(playlist, songId);
  })
}

const displayFavoriteSongs = (song) => {
  $('.favorites-index-table').append(`
    <tr class="favorites-table-row">
      <td class="song-cell"><select class="fav-dropdown"><select></td>
      <td class="song-cell"><button class="song-row song-fav-btn add-song-button" type="button">Add To Playlist</button></td>
      <td class="song-cell" id="song-cell-id" style="display:none">${song.id}</td>
      <td class="song-cell" id="song-cell-title-">${song.title}</td>
      <td class="song-cell" id="song-cell-artist">${song.artist}</td>
      <td class="song-cell" id="song-cell-genre">${song.genre}</td>
      <td class="song-cell" id="song-cell-rating">${song.rating}</td>
    </tr>`)
}

const getPlaylistsDropdown = () => {
  fetch('https://api-play.herokuapp.com/api/v1/playlists')
  .then((response) => response.json())
  .then((playlistsData) => compilePlaylistsDropdown(playlistsData))
  .catch((error) => console.error({ error }));
}

const compilePlaylistsDropdown = (playlistsData) => {
  playlistsData.forEach(playlist => {
    fillPlaylistDropdown(playlist);
  });
}

const fillPlaylistDropdown = (playlist) => {
  $(".fav-dropdown").append(`
    <option id="${playlist.id}" value='${playlist.id}'>${playlist.playlist_name}</option>
    `)
}

const getPlaylists = () => {
  fetch('https://api-play.herokuapp.com/api/v1/playlists')
  .then((response) => response.json())
  .then((playlistsData) => {
    return compilePlaylists(playlistsData)
  })
  .catch((error) => console.error({ error }));
}

const compilePlaylists = (playlistsData) => {
  playlistsData.forEach(playlist => {
    displayPlaylists(playlist);
  });
  $(".playlist-title-link").on("click", (event) => {
    getSinglePlaylist(event.currentTarget.parentElement.parentElement.children[0].innerText);
    $(".single-playlist-container").slideDown(500);
    $(".playlists-container").hide(500)
  })
}

const displayPlaylists = (playlist) => {
  $('.playlists-index-table').append(`
    <tr class="playlists-table-row">
      <td class="song-cell" id="song-cell-id">${playlist.id}</td>
      <td class="song-cell" id="song-cell-title"><button class="playlist-title-link">${playlist.playlist_name}</button></td>
    </tr>`)
}

const getSinglePlaylist = (id) => {
  fetch(`https://api-play.herokuapp.com/api/v1/playlists/${id}/songs`)
  .then((response) => response.json())
  .then((songsData) => {
    return compileSinglePlaylist(songsData)
  })
  .catch((error) => console.error({ error }));
}

const compileSinglePlaylist = (playlistsData) => {
  playlistsData['songs'].forEach(song => {
    displaySinglePlaylistSongs(song)
  })
    $(".single-playlist-container").slideDown(500);
}

const displaySinglePlaylistSongs = (song) => {
  $('.playlist-show-table').append(`
    <tr class="playlist-table-row">
      <td class="song-cell" id="song-cell-id" style="display:none">${song.id}</td>
      <td class="song-cell" id="song-cell-title-">${song.title}</td>
      <td class="song-cell" id="song-cell-artist">${song.artist}</td>
      <td class="song-cell" id="song-cell-genre">${song.genre}</td>
      <td class="song-cell" id="song-cell-rating">${song.rating}</td>
    </tr>`)
}


const getPlaylistSongs = (playlistData) => {
  fetch(`https://api-play.herokuapp.com/api/v1/playlists/${playlistData.id}/songs`)
  .then((response) => response.json())
  .then((playlistData) => compilePlaylistSongs(playlistData.songs))
  .catch((error) => console.error({ error }));
}

const compilePlaylistSongs = (songs) => {
  songs.forEach(song => {
    displayPlaylistSongs(song);
  });
}

const displayPlaylistSongs = (song) => {
  $('.playlist-show-table').append(`
    <tr class="playlists-table-row">
      <td class="song-cell" id="song-cell-title-">${song.title}</td>
      <td class="song-cell" id="song-cell-artist">${song.artist}</td>
      <td class="song-cell" id="song-cell-genre">${song.genre}</td>
      <td class="song-cell" id="song-cell-rating">${song.rating}</td>
    </tr>`)
}

$(".search-button").on("click", () => {
  var q = $(".search-nav-input").val()
  getArtistSongs(q);
  $(".search-nav-input").val("")
  $('.song-table-row').remove();
  $('.search-container').slideUp(900);
  $('.favorites-container').slideUp(900);
  $('.songs-container').slideDown(600);
  $(".playlists-container").hide(500);
})

$('.search-nav-input').keypress(function (e) {
 var key = e.which;
 if(key == 13)
  {
    $('#search-nav-button').click();
    return false;
  }
});

$("#search-container-button").on("click", () => {
  var q = $(".search-container-input").val();
  getArtistSongs(q);
  $(".search-container-input").val("")
  $('.song-table-row').remove();
  $('.search-container').slideUp(900);
  $('.favorites-container').slideUp(900);
  $('.songs-container').slideDown(600);
  $(".playlists-container").hide(500);
})

$('.search-container-input').keypress(function (e) {
 var key = e.which;
 if(key == 13)
  {
    $('#search-container-button').click();
    return false;
  }
});

$(".span-title").on("click", () => {
  $(".search-container-input").val("")
  $(".search-nav-input").val("")
  $('.search-container').slideDown(900);
  $('.songs-container').hide(500);
  $('.songs-table-row').remove();
  $(".favorites-table-row").remove();
  $('.favorites-container').hide(500);
  $(".playlists-container").hide(500);
})

$(".fas-nav").on("click", () => {
  $(".search-container-input").val("")
  $(".search-nav-input").val("")
  $('.search-container').slideDown(900);
  $('.songs-container').hide(500);
  $('.songs-table-row').remove();
  $(".playlists-container").hide(500);
})

$(".songs-container").on("click", ".song-fav-btn", function() {
  var songData = this.parentElement.parentElement.childNodes
  postFavorite(songData);
})

$("#nav-fav-btn").on("click", () => {
  $(".favorites-table-row").remove();
  getFavoriteSongs();
  $(".search-container-input").val("")
  $(".search-nav-input").val("")
  $(".search-container").hide(500);
  $(".songs-container").hide(500);
  $(".favorites-container").slideDown(900);
  $(".playlists-container").hide();
})

$("#nav-playlist-btn").on("click", () => {
  getPlaylists();
  $(".search-container-input").val("")
  $(".search-nav-input").val("")
  $(".search-container").hide(500);
  $(".songs-container").hide(500);
  $(".favorites-container").hide(900);
  $(".playlists-container").slideDown(500);
})

$("#create-new-playlist").on("click", () => {
  $("#create-new-playlist").slideUp(900);
  $(".playlist-name-input").slideDown(500);
  $("#create-button").slideDown(500);
  $("#cancel-button").slideDown(500);
})

$("#create-button").on("click", () => {
  var name = $(".playlist-name-input").val()
  postPlaylist(name);
  $(".playlist-name-input").val("");
})

$("#cancel-button").on("click", () => {
  $("#create-new-playlist").slideDown(900);
  $(".playlist-name-input").hide(500);
  $(".playlist-name-input").val("");
  $("#create-button").hide(500);
  $("#cancel-button").hide(500);
})

$("#playlist-back").on("click", () => {
  $(".single-playlist-container").hide();
  $(".playlists-container").slideDown(500);
})
