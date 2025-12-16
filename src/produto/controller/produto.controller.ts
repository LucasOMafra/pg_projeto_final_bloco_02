/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ProdutoService } from "../service/produto.service";
import { Produto } from "../entities/produto.entity";

@Controller("/produtos") 
export class ProdutoController {
    
    // Injeção do ProdutoService
    constructor(private readonly produtoService: ProdutoService) {}

    // Rota: GET /produtos
    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Produto[]> {
        // Chama o método do Service que inclui a relação com Categoria
        return this.produtoService.findAll();
    }

    // Rota: GET /produtos/:id
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
        // O ParseIntPipe garante que o ID é um número
        return this.produtoService.findById(id);
    }
    
    // Rota: GET /produtos/nome/:nome
    @Get('/nome/:nome')
    @HttpCode(HttpStatus.OK)
    findByNome(@Param('nome') nome: string): Promise<Produto[]> {
        // Usa o parâmetro de rota para buscar por nome (LIKE)
        return this.produtoService.findByNome(nome);
    }

    // Rota: POST /produtos
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() produto: Produto): Promise<Produto> {
        // O corpo deve conter os dados do produto E a chave estrangeira (ex: "categoria": { "id_categoria": 1 })
        return this.produtoService.create(produto);
    }

    // Rota: PUT /produtos/:id
    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number, // Captura o ID da URL
        @Body() produto: Produto // Captura os dados do corpo
    ): Promise<Produto> {
        // Passa os dois argumentos necessários para o Service
        return this.produtoService.update(id, produto);
    }

    // Rota: DELETE /produtos/:id
    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 (No Content) após exclusão bem-sucedida
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.produtoService.delete(id);
    }
}