/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';
import { CategoriaService } from '../../categoria/service/categoria.service'; // Injetar CategoriaService para validação

@Injectable()
export class ProdutoService { // <-- Início da Classe

  constructor(
    // Injeção do repositório da entidade Produto
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private categoriaService: CategoriaService
  ) {}


  //*** Buscar todos os Produtos com Categoria
  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      relations: ['categoria'], //dados da categoria
      order: {
        nome: "ASC"
      }
    });
  }
  
  //*** Buscar Produto por ID com Categoria
  async findById(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: {
        id_produto: id
      },
      relations: ['categoria'] //dados da categoria
    });

    if (!produto) {
      throw new HttpException('Produto não foi encontrado!', HttpStatus.NOT_FOUND);
    }
    return produto;
  }
  
  //*** Buscar Produtos por Nome
  async findByNome(nome: string): Promise<Produto[]> {
    const produtos = await this.produtoRepository.find({
      where: {
        // Busca por parte do nome (LIKE %nome%):
        nome: Like(`%${nome}%`)
      },
      relations: ['categoria'], //dados da categoria
      order: {
        nome: "ASC"
      }
    });

    if (produtos.length === 0) {
      throw new HttpException('Nenhum produto encontrado com este nome.', HttpStatus.NOT_FOUND);
    }
    return produtos;
  }
  
  //*** Criar Novo Produto
  async create(produto: Produto): Promise<Produto> {
    //Verificar se o SKU já existe
    const skuExistente = await this.produtoRepository.findOne({
      where: { sku: produto.sku }
    });

    if (skuExistente) {
      throw new HttpException('Produto com este SKU já cadastrado.', HttpStatus.BAD_REQUEST);
    }

    //Verificar se a Categoria existe (usando o CategoriaService)
    await this.categoriaService.findById(produto.categoria.id_categoria); 
    // Caso a categoria não existir, o findById já lançará um erro 404

    // Persiste (salva) o novo objeto no banco de dados
    return await this.produtoRepository.save(produto);
  }

  //*** Atualizar Produto Existente
  async update(id: number, produto: Produto): Promise<Produto> {
    
    // Verifica se o produto existe
    await this.findById(id); 

    // Verifica se a Categoria existe (se ela estiver sendo atualizada)
    if (produto.categoria.id_categoria) {
       await this.categoriaService.findById(produto.categoria.id_categoria);
    }

    // Verifica se o SKU está sendo alterado para um que já existe em outro produto
    const produtoSku = await this.produtoRepository.findOne({
      where: { sku: produto.sku }
    });

    if (produtoSku && produtoSku.id_produto !== id) {
      throw new HttpException('SKU já cadastrado em outro produto.', HttpStatus.BAD_REQUEST);
    }

    // Atualiza os dados
    produto.id_produto = id;
    return await this.produtoRepository.save(produto);
  }

  //*** Apagar Produto por ID
  async delete(id: number): Promise<void> {

    // Verifica se o produto existe
    await this.findById(id); 

    // Se existir, executa o DELETE.
    await this.produtoRepository.delete(id);
  }
}