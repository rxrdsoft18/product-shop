import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
