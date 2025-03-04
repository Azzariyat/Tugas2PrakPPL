const fs = require('fs');
const readlineSync = require('readline-sync');

const DB_FILE = 'movie.json';

// Read database
function readDB() {
    return JSON.parse(fs.readFileSync(DB_FILE));
}

// Write to database
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Show all movies
function showMovies() {
    const db = readDB();
    if (db.movies.length === 0) {
        console.log('No movies in database');
        return;
    }
    console.log('\nMovie List:');
    db.movies.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title} (${movie.year})`);
        console.log(`   Genre: ${movie.genre}`);
        console.log(`   Rating: ${movie.rating}/10\n`);
    });
}

// Add new movie
function addMovie() {
    const title = readlineSync.question('Enter movie title: ');
    const year = readlineSync.question('Enter release year: ');
    const genre = readlineSync.question('Enter genre: ');
    const rating = readlineSync.question('Enter rating (0-10): ');

    const db = readDB();
    db.movies.push({ title, year, genre, rating });
    writeDB(db);
    console.log('Movie added successfully!');
}

function findMovie() {
    const db = readDB();
    if (db.movies.length === 0) {
        console.log('No movies in database');
        return null;
    }
    
    showMovies();
    const index = readlineSync.questionInt('Enter movie number to update: ') - 1;
    
    if (index < 0 || index >= db.movies.length) {
        console.log('Invalid movie number!');
        return null;
    }
    
    return { index, movie: db.movies[index] };
}

function updateMovie() {
    const result = findMovie();
    if (!result) return;
    
    const { index, movie } = result;
    console.log('\nCurrent movie details:');
    console.log(`Title: ${movie.title}`);
    console.log(`Year: ${movie.year}`);
    console.log(`Genre: ${movie.genre}`);
    console.log(`Rating: ${movie.rating}`);
    
    console.log('\nEnter new details (press Enter to keep current value):');
    const newTitle = readlineSync.question('New title: ') || movie.title;
    const newYear = readlineSync.question('New year: ') || movie.year;
    const newGenre = readlineSync.question('New genre: ') || movie.genre;
    const newRating = readlineSync.question('New rating (0-10): ') || movie.rating;
    
    const db = readDB();
    db.movies[index] = {
        title: newTitle,
        year: newYear,
        genre: newGenre,
        rating: newRating
    };
    
    writeDB(db);
    console.log('Movie updated successfully!');
}

function searchMovie() {
    const searchTerm = readlineSync.question('Enter movie title to search: ');
    const db = readDB();
    const results = db.movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (results.length === 0) {
        console.log('No movies found!');
        return;
    }
    
    console.log('\nSearch Results:');
    results.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title} (${movie.year})`);
        console.log(`   Genre: ${movie.genre}`);
        console.log(`   Rating: ${movie.rating}/10\n`);
    });
}

function filterByGenre() {
    const searchGenre = readlineSync.question('Enter genre to filter: ');
    const db = readDB();
    const filtered = db.movies.filter(movie => {
        // Split genre if it contains multiple genres
        const movieGenres = movie.genre.split(',').map(g => g.trim().toLowerCase());
        return movieGenres.includes(searchGenre.toLowerCase());
    });
    
    if (filtered.length === 0) {
        console.log('No movies found in that genre!');
        return;
    }
    
    console.log(`\nMovies in ${searchGenre} genre:`);
    filtered.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title} (${movie.year})`);
        console.log(`   Genre: ${movie.genre}`);
        console.log(`   Rating: ${movie.rating}/10\n`);
    });
}

function sortByRating() {
    const db = readDB();
    const sorted = [...db.movies].sort((a, b) => b.rating - a.rating);
    
    console.log('\nMovies sorted by rating (highest to lowest):');
    sorted.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title}`);
        console.log(`   Rating: ${movie.rating}/10`);
        console.log(`   Genre: ${movie.genre}\n`);
    });
}

function deleteMovie() {
    const result = findMovie();
    if (!result) return;
    
    const { index, movie } = result;
    const confirm = readlineSync.keyInYN(`Are you sure you want to delete "${movie.title}"?`);
    
    if (confirm) {
        const db = readDB();
        db.movies.splice(index, 1);
        writeDB(db);
        console.log('Movie deleted successfully!');
    }
}

function showStats() {
    const db = readDB();
    const totalMovies = db.movies.length;
    const avgRating = (db.movies.reduce((sum, movie) => sum + Number(movie.rating), 0) / totalMovies).toFixed(2);
    const genres = [...new Set(db.movies.map(movie => movie.genre))];
    
    console.log('\nDatabase Statistics:');
    console.log(`Total Movies: ${totalMovies}`);
    console.log(`Average Rating: ${avgRating}`);
    console.log(`Available Genres: ${genres.join(', ')}`);
}

// Main menu
function mainMenu() {
    while (true) {
        console.log('\nWelcome to Movie Database');
        console.log('1. Show all movies');
        console.log('2. Add new movie');
        console.log('3. Update movie');
        console.log('4. Search movie');
        console.log('5. Filter by genre');
        console.log('6. Sort by rating');
        console.log('7. Delete movie');
        console.log('8. Show statistics');
        console.log('9. Exit');
        
        const choice = readlineSync.question('Enter your choice: ');
        
        switch (choice) {
            case '1':
                showMovies();
                break;
            case '2':
                addMovie();
                break;
            case '3':
                updateMovie();
                break;
            case '4':
                searchMovie();
                break;
            case '5':
                filterByGenre();
                break;
            case '6':
                sortByRating();
                break;
            case '7':
                deleteMovie();
                break;
            case '8':
                showStats();
                break;
            case '9':
                console.log('Goodbye!');
                process.exit(0);
            default:
                console.log('Invalid choice!');
        }
    }
}

// Start the application
mainMenu();