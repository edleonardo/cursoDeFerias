import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'
import Genero from '../models/Genero'

async function findOrThrowError(id: number) {
  const generoRepository = getRepository(Genero)
  const genero = await generoRepository.findOne(id)
  if (!genero) {
    throw new Error('Gênero não encontrado')
  }

  return genero
}

async function validaGenero(genero: { nome: string }) {
  const generoRepository = getRepository(Genero)
  const validaGeneroRepetido = await generoRepository.find({
    where: { nome: genero.nome } 
  })
  if (validaGeneroRepetido.length) {
    throw new Error ('Esse gênero já existe')
  }

  const schema = Yup.object().shape({
    nome: Yup.string().required()
  })
  await schema.validate(genero, { abortEarly: false })
}

export default {
  async index(request: Request, response: Response) {
    const generoRepository = getRepository(Genero)
    const generos = await generoRepository.find()

    return response.status(200).json(generos)
  },
  async show(request: Request, response: Response) {
    try {
      const { id } = request.params
      const genero = await findOrThrowError(Number(id))

      return response.status(200).json(genero)
    } catch (error) {
      return response.status(404).json({ message: Object(error).message })    
    }
  },
  async create(request: Request, response: Response) {
    try {
      const { nome } = request.body
      await validaGenero({ nome })
      const generoRepository = getRepository(Genero)
      const genero = generoRepository.create({
        nome
      })
      await generoRepository.save(genero)

      return response.status(201).json(genero)
    } catch (error) {
      return response.status(400).json({ message: Object(error).errors ?? Object(error).message })
    }
  },
  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params
      const genero = await findOrThrowError(Number(id))
      const generoRepository = getRepository(Genero)
      await generoRepository.remove(genero)

      return response.status(200).json({ message: 'Gênero excluido com sucesso' })
    } catch (error) {
      return response.status(404).json({ message: Object(error).message })
    }
  },
  async update(request: Request, response: Response) {
    try {
      const { id } = request.params
      const { nome } = request.body
      const genero = await findOrThrowError(Number(id))
      const generoRepository = getRepository(Genero)
      generoRepository.merge(genero, { nome })
      await generoRepository.save(genero)
      
      return response.status(200).json(genero)
    } catch (error) {
      return response.status(404).json({ message: Object(error).message })
    }
  }
}