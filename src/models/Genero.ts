import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'
import Filme from './Filme'

@Entity('Generos')
export default class Genero {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @OneToMany(() => Filme, filme => filme.genero)
  @JoinColumn({ name: 'genero_id'})
  filme: Filme
}