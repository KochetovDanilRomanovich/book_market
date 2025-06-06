import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggersAndFunctionsForMyDB1687028339168
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Триггер для проверки количества
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION check_quantity()
      RETURNS TRIGGER AS $$
      BEGIN
          IF NEW.quantity <= 0 THEN
              RAISE EXCEPTION 'Количество должно быть больше 0';
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER before_insert_orderitem
      BEFORE INSERT ON order_item
      FOR EACH ROW
      EXECUTE FUNCTION check_quantity();
    `);

    // Триггер для обновления общей суммы заказа
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_order_total()
      RETURNS TRIGGER AS $$
      BEGIN
          UPDATE "order"
          SET total_amount = (
              SELECT COALESCE(SUM(quantity * price_at_order), 0)
              FROM order_item
              WHERE order_id = NEW.order_id
          )
          WHERE order_id = NEW.order_id;  -- Исправлено на order_id
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_order_total_after_insert
      AFTER INSERT ON order_item
      FOR EACH ROW
      EXECUTE FUNCTION update_order_total();
    `);

    // Хранимая процедура для повышения цен для определенного автора
    await queryRunner.query(`
      CREATE OR REPLACE PROCEDURE increase_prices_by_author(
          p_author_id INT,  -- Переименовано на p_author_id
          percent DECIMAL(5, 2)
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
          IF percent > 1000 THEN
              RAISE EXCEPTION 'Процент увеличения не может превышать 1000%%';
          END IF;

          -- Проверка существования автора
          IF NOT EXISTS (SELECT 1 FROM author WHERE author_id = p_author_id) THEN
              RAISE EXCEPTION 'Автор с указанным ID не найден';
          END IF;

          -- Обновление цен
          UPDATE book
          SET current_price = ROUND(current_price * (1 + percent / 100), 2)
          WHERE author_id = p_author_id;  -- Используйте p_author_id
      END;
      $$;
    `);

    // Создание представления с информацией о книгах, авторах и жанрах
    await queryRunner.query(`
      CREATE OR REPLACE VIEW book_details_view AS
      SELECT 
          b.book_id,
          b.title,
          b.current_price,
          b.stock_quantity,
          a.author_id,
          a.author_name,
          g.genre_id,
          g.genre_name
      FROM 
          book b
      LEFT JOIN 
          author a ON b.author_id = a.author_id
      LEFT JOIN 
          genre g ON b.genre_id = g.genre_id
      ORDER BY 
          b.title;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS before_insert_orderitem ON order_item`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS check_quantity`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS update_order_total_after_insert ON order_item`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_order_total`);

    await queryRunner.query(`DROP PROCEDURE IF EXISTS increase_prices_by_author`);
    
    await queryRunner.query(`DROP VIEW IF EXISTS book_details_view`);
  }
}


