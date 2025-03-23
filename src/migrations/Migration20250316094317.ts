import { Migration } from '@mikro-orm/migrations';

export class Migration20250316094317 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" alter column "is_active" type boolean using ("is_active"::boolean);`);
    this.addSql(`alter table "user" alter column "is_active" set default true;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" alter column "is_active" type boolean using ("is_active"::boolean);`);
    this.addSql(`alter table "user" alter column "is_active" set default false;`);
  }

}
