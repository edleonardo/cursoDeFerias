import { Router } from 'express'
import FilmesController from './controllers/FilmesController'
import GeneroController from './controllers/GeneroController'

const routes = Router()

routes.get('/filmes', FilmesController.index)
routes.get('/filmes/:id', FilmesController.show)
routes.post('/filmes', FilmesController.create)
routes.delete('/filmes/:id', FilmesController.delete)
routes.put('/filmes/:id', FilmesController.update)

routes.get('/generos', GeneroController.index)
routes.get('/generos/:id', GeneroController.show)
routes.post('/generos', GeneroController.create)
routes.delete('/generos/:id', GeneroController.delete)
routes.put('/generos/:id', GeneroController.update)

export default routes