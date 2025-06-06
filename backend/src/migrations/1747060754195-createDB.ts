import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDB1747060754195 implements MigrationInterface {
    name = 'CreateDB1747060754195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "genre" ("genre_id" BIGSERIAL NOT NULL, "genre_name" character varying NOT NULL, CONSTRAINT "UQ_35a95dd11ad0db6e9684ca50df0" UNIQUE ("genre_name"), CONSTRAINT "PK_af0c9d11cb69b909fd91dd33009" PRIMARY KEY ("genre_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_af0c9d11cb69b909fd91dd3300" ON "genre" ("genre_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_35a95dd11ad0db6e9684ca50df" ON "genre" ("genre_name") `);
        await queryRunner.query(`CREATE TABLE "book" ("book_id" BIGSERIAL NOT NULL, "title" character varying(255) NOT NULL, "current_price" numeric(10,2) NOT NULL, "stock_quantity" integer NOT NULL, "author_id" bigint, "genre_id" bigint, CONSTRAINT "UQ_c10a44a29ef231062f22b1b7ac5" UNIQUE ("title"), CONSTRAINT "PK_b66091a3d2edddc14f6b91fc606" PRIMARY KEY ("book_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b66091a3d2edddc14f6b91fc60" ON "book" ("book_id") `);
        await queryRunner.query(`CREATE TABLE "author" ("author_id" BIGSERIAL NOT NULL, "author_name" character varying NOT NULL, CONSTRAINT "UQ_fe5ae13bba4a0b8f888d0b08895" UNIQUE ("author_name"), CONSTRAINT "PK_c36fb987d8132c9bdb15916e619" PRIMARY KEY ("author_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c36fb987d8132c9bdb15916e61" ON "author" ("author_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fe5ae13bba4a0b8f888d0b0889" ON "author" ("author_name") `);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" BIGSERIAL NOT NULL, "username" character varying NOT NULL, "first_name" character varying NOT NULL, "second_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_758b8ce7c18b9d347461b30228" ON "user" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "order" ("order_id" BIGSERIAL NOT NULL, "total_amount" numeric(10,2) NOT NULL, "user_id" bigint, CONSTRAINT "PK_58998c5eaeaacdd004dec8b5d86" PRIMARY KEY ("order_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_58998c5eaeaacdd004dec8b5d8" ON "order" ("order_id") `);
        await queryRunner.query(`CREATE TABLE "order_item" ("order_id" bigint NOT NULL, "product_id" bigint NOT NULL, "quantity" integer NOT NULL, "price_at_order" numeric(10,2) NOT NULL, CONSTRAINT "PK_f72b2c61968a218d1756d37efdc" PRIMARY KEY ("order_id", "product_id"))`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_24b753b0490a992a6941451f405" FOREIGN KEY ("author_id") REFERENCES "author"("author_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_f316eed809f6f7617821012ad05" FOREIGN KEY ("genre_id") REFERENCES "genre"("genre_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_f316eed809f6f7617821012ad05"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_24b753b0490a992a6941451f405"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58998c5eaeaacdd004dec8b5d8"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_758b8ce7c18b9d347461b30228"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe5ae13bba4a0b8f888d0b0889"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c36fb987d8132c9bdb15916e61"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b66091a3d2edddc14f6b91fc60"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35a95dd11ad0db6e9684ca50df"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af0c9d11cb69b909fd91dd3300"`);
        await queryRunner.query(`DROP TABLE "genre"`);
    }

}
