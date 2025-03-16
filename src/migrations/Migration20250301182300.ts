import { Migration } from '@mikro-orm/migrations';

export class Migration20250301182300 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "todo" ("id" uuid not null, "uuid_user" text not null, "title" text not null, "date_todo_start" timestamptz not null, "date_todo_end" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "todo_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "todo" cascade;`);
  }

}
