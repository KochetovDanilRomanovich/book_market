import { DataSource } from 'typeorm';
import { config } from './config';
import { Author } from './authors/entities/author.entity';
import { Book } from './books/entities/book.entity';
import { Genre } from './genres/entities/genre.entity';
import { OrderItem } from './order_items/entities/order_item.entity';
import { Order } from './orders/entities/order.entity';
import { User } from './users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  entities: [Author, Book, Genre, OrderItem, Order, User],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});

