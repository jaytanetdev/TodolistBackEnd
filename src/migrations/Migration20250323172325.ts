import { Migration } from '@mikro-orm/migrations';

export class Migration20250323172325 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "todo" drop column "uuid_user";`);

    this.addSql(`alter table "todo" add column "user_id" uuid not null;`);
    this.addSql(`alter table "todo" add constraint "todo_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "todo" drop constraint "todo_user_id_foreign";`);

    this.addSql(`alter table "todo" drop column "user_id";`);

    this.addSql(`alter table "todo" add column "uuid_user" text not null;`);
  }

}
