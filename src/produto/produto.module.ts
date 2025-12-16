import { Produto } from './entities/produto.entity';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProdutoService } from './service/produto.service';
import { ProdutoController } from './controller/produto.controller';
import { CategoriaModule } from '../categoria/categoria.module';

@Module({
    imports: [TypeOrmModule.forFeature([Produto]), CategoriaModule],
    providers: [ProdutoService],
    controllers: [ProdutoController],
    exports: [],
})
export class ProdutoModule {}