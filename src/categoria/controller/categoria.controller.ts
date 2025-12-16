import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CategoriaService } from "../service/categoria.service";
import { Categoria } from "../entities/categoria.entity";

@Controller("/categorias")
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) {}

@Get()
@HttpCode(HttpStatus.OK)
findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
 }

@Get('/:id')
@HttpCode(HttpStatus.OK)
findById(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
    return this.categoriaService.findById(id);
}

@Get('/nome/:nome')
@HttpCode(HttpStatus.OK)
findByNome(@Param('nome') nome: string): Promise<Categoria[]> {
    return this.categoriaService.findByNome(nome);
}

@Post()
@HttpCode(HttpStatus.CREATED)
create(@Body() categoria: Categoria): Promise<Categoria> {
    return this.categoriaService.create(categoria);
}

@Put('/:id')
@HttpCode(HttpStatus.OK)
update(
    @Param('id', ParseIntPipe) id: number, // <--- Capturando o ID
    @Body() categoria: Categoria
): Promise<Categoria> {
    // Passando o ID e o corpo da requisição para o Service
    return this.categoriaService.update(id, categoria); 
}

@Delete('/:id')
@HttpCode(HttpStatus.NO_CONTENT)
delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriaService.delete(id);
}
}
