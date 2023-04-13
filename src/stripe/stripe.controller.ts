import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Cart } from './card.model';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  checkout(@Body() body: { cart: Cart }) {
    try {
      return this.stripeService.checkout(body.cart);
    } catch (error) {
      return error;
    }
  }
}
