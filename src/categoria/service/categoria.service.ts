/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './../entities/categoria.entity';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Like, Repository } from 'typeorm';

@Injectable()
export class CategoriaService { // <-- Início da Classe

    constructor(
        //Injeção do repositório da entidade Categoria
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>,
    ) {} // <-- Fechamento do Construtor

    //***Buscar todas as categorias
    async findAll(): Promise<Categoria[]> {
        return await this.categoriaRepository.find({
            order: {
                nome: "ASC"
                }
            });
    } // <-- Fechamento da função findAll
    
    //***Buscar Categoria por ID
    async findById(id: number): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findOne({
            where: {
                id_categoria: id
            }
        });
    //Em caso de erro (Não encontrado)
    if (!categoria) {
      throw new HttpException('Categoria não foi encontrada!', HttpStatus.NOT_FOUND);
    }
    return categoria;
    } // <-- Fechamento da função findById
    
    //***Buscar categoria por nome (Ajustado o fechamento e a sintaxe do where)
    async findByNome(nome: string): Promise<Categoria[]> {
        const categorias= await this.categoriaRepository.find({
            where: { 
                //Busca por parte do nome (LIKE %nome%):
                nome: Like(`%${nome}%`) 
            }, // <-- Fechamento do where
        }); // <-- Fechamento do find e das opções

        // Retorna um erro 404 se nenhuma categoria for encontrada
        if (categorias.length === 0) {
            throw new HttpException('Nenhuma categoria encontrada com este nome.', HttpStatus.NOT_FOUND);
        }

        return categorias;
    } // <-- Fechamento da função FindByName

    //***Criar categoria
    async create(categoria: Categoria): Promise<Categoria> {
        // Regra de Negócio: Verificar se já existe uma categoria com o mesmo nome
        const categoriaExistente = await this.categoriaRepository.findOne({
            where: { nome: categoria.nome }
        });

      if (categoriaExistente) {
      // Retorna erro 400 (Requisição Inválida) se a categoria já existe
      throw new HttpException('Categoria com este nome já cadastrada.', HttpStatus.BAD_REQUEST);
    }

      // Persiste (salva) o novo objeto no banco de dados
      return await this.categoriaRepository.save(categoria);   
    } // <-- Fechamento da função create

    //***Atualizar categoria existente/
    async update(id: number, categoria: Categoria): Promise<Categoria> {

    //Verifica se a categoria existe
    const categoriaUpdate = await this.findById(id);

    //Se a categoria existe, atualiza os dados
    categoria.id_categoria = id;
    return await this.categoriaRepository.save(categoria);
    } // <-- Fechamento da função atualizar

    ///***Deletar categoria por Id
    async delete(id: number): Promise<void> {
    //Verifica se a categoria existe
    const categoriaDelete = await this.findById(id);

    //Se existir, executa o DELETE.
    await this.categoriaRepository.delete(id);
    } // <-- Fechamento da função atualizar

} // <-- Fechamento da Classe CategoriaService