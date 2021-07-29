import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'
import Genero from '../models/Genero'
import Filme from '../models/Filme'

async function findOrThrowError(id: number) {
  const filmeRepository = getRepository(Filme)
  const filme = await filmeRepository.findOne(id)
  if (!filme) {
    throw new Error('Filme não encontrado')
  }

  return filme
}

async function validaFilme(filme: { nome: string, diretor: string, ano_de_lancamento: number, genero: number }) {
  const filmeRepository = getRepository(Filme)
  const validaFilmeRepetido = await filmeRepository.find({
    where: { nome: filme.nome } 
  })
  if (validaFilmeRepetido.length) {
    throw new Error ('Esse filme já existe')
  }
  const generoRepository = getRepository(Genero)
  const validaSeGeneroExiste = await generoRepository.findOne(filme.genero)
  if (!validaSeGeneroExiste) {
    throw new Error('O gênero enviado não existe')
  }

  const schema = Yup.object().shape({
    nome: Yup.string().required(),
    diretor: Yup.string().required(),
    ano_de_lancamento: Yup.number().min(1900).max(2030).required(),
    genero: Yup.number().required()
  })
  await schema.validate(filme, { abortEarly: false })
}

export default {
  async index(request: Request, response: Response) {
    const filmeRepository = getRepository(Filme)
    const filmes = await filmeRepository.find({ relations: ['genero']})

    return response.status(200).json(filmes)
  },
  async show(request: Request, response: Response) {
    try {
      const { id } = request.params
      const filmeRepository = getRepository(Filme)
      const filme = await filmeRepository.findOne(id, { relations: ['genero']})
      if (!filme) {
        throw new Error('Filme não encontrado')
      }

      return response.status(200).json(filme)
    } catch (error) {
      return response.status(404).json({ message: Object(error).message })
    }
  },
  async create(request: Request, response: Response) {
    try {
      const { nome, diretor, genero, ano_de_lancamento } = request.body
      await validaFilme({ nome, diretor, ano_de_lancamento, genero })
      const filmeRepository = getRepository(Filme)
      const filme = filmeRepository.create({
        nome,
        diretor,
        ano_de_lancamento,
        genero
      })

      await filmeRepository.save(filme)

      return response.status(201).json(filme)

    } catch (error) {
      return response.status(400).json({ message: Object(error).errors ?? Object(error).message })
    }
  },
  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params
      const filme = await findOrThrowError(Number(id))
      const filmeRepository = getRepository(Filme)
      await filmeRepository.remove(filme)

      return response.status(200).json({ message: 'Filme excluído com sucesso'})
    } catch (error) {
      return response.status(404).json({ message: Object(error).message })
    }    
  },
  async update(request: Request, response: Response) {
    try {
      const { id } = request.params
      const filme = await findOrThrowError(Number(id))
      const filmeRepository = getRepository(Filme)
      const data = request.body

      filmeRepository.merge(filme, data)
      await filmeRepository.save(filme)

      return response.status(200).json(filme)
    } catch (error) {
      return response.status(404).json({ message: Object(error).message })
    }
  }
}