import { Migration } from '@mikro-orm/migrations';

export class Migration20250323163015 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "user_id_line" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "user_id_line";`);
  }

}
