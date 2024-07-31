const z = require('zod');

const schema = z.object({
  title: z.string({invalid_type_error: 'Title is required', required_error: 'Title is required'}),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({ message: 'Invalid URL' }),
  genre: z.array(z.enum(['Action', 'Comedy', 'Drama', 'Terror', 'Romance', 'Policiaca', 'Ficcion',  "Adventure", "Fantasy", "Sci-Fi", "Biography", "Animation", 'Crime'],{
    required_error: 'Genre is required',
    invalid_type_error: 'Genre is required'
  })),
  rate: z.number().min(0).max(10).default(4.5)
})

function validateMovie(movie) {
  return schema.safeParse(movie)
}

function validatePartialMovie(object){
  return schema.partial().safeParse(object)
}
module.exports = {
  validateMovie,
  validatePartialMovie
}