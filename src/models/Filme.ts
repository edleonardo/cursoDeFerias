import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import Genero from './Genero'

@Entity('Filmes')
export default class Filme {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @Column()
  diretor: string;

  @Column()
  ano_de_lancamento: number;

  @ManyToOne(() => Genero, genero => genero.id)
  @JoinColumn({ name: 'genero_id' })
  genero: Genero
}