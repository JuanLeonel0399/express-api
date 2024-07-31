const express = require('express');
const crypto = require('node:crypto');
const cors = require('cors');
const movies = require('./movies.json');
const { validateMovie, validatePartialMovie } = require('./schema')
const app = express();

app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:3000'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.disable('x-powered-by')

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const moviesByGenre = movies.filter(
      movie => movie.genre.some(m => m.toLowerCase() === genre.toLowerCase())
    )
    moviesByGenre ? res.status(200).json(moviesByGenre) : res.status(404).send('404: Not found movies by genre')
  }
  res.status(200).json(movies)
})

app.get('/movies/:id', (req, res) => {
  const id = req.params
  const movie = movies.find(movie => movie.id === id)
  movie ? res.status(200).json(movie) : res.status(404).send('404: Not found')
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const movie = { id: crypto.randomUUID(), ...result.data }
  movies.push(movie)
  res.status(201).json(movie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return res.status(404).send('404: Not found')

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const id = req.params.id
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return res.status(404).send('404: Not found')

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie
  return res.status(200).json(updateMovie)
})


app.use((req, res) => {
  res.status(404).send('404: Not found')
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})