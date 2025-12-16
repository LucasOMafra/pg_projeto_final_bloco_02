/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsInt, IsNumber, IsDateString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity({ name: 'tb_produtos' })
export class Produto {

  @PrimaryGeneratedColumn()
  id_produto: number;

  // --- Relacionamento Many-to-One ---
  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
    onDelete: "CASCADE" // Opção de cascata: se a categoria for deletada, o produto também é.
  })
  categoria: Categoria;
  // Nesse caso, o TypeORM cria a coluna 'categoriaId' automaticamente.

  @IsNotEmpty()
  @IsString()
  @Column({ length: 100, nullable: false })
  nome: string;

  @IsNotEmpty()
  @IsString()
  @Column({ length: 20, nullable: false, unique: true })
  sku: string; // SKU: Código de Estoque (Stock Keeping Unit)

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 }) // Validação para ser um número com até 2 casas decimais
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  preco: number;

  @IsNotEmpty()
  @IsInt() // Validação para ser um número inteiro
  @Column({ nullable: false })
  estoque: number;

  @IsNotEmpty()
  @IsDateString() // Validação para garantir que é uma string de data válida (ex: "AAAA-MM-DD")
  @Column({ type: 'date', nullable: false })
  data_validade: Date;

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;
}