/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity'


@Entity({ name: 'tb_categorias' })
export class Categoria {

  @PrimaryGeneratedColumn()
  id_categoria: number;

  @IsNotEmpty()
  @IsString()
  @Column({ length: 50, nullable: false, unique: true })
  nome: string;

  @IsNotEmpty()
  @IsString()
  @Column({ length: 255, nullable: false })
  descricao: string;

   @Column({ type: 'boolean', default: true })
   ativo: boolean;

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos: Produto[];
}