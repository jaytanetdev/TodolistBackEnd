import { Migration } from '@mikro-orm/migrations';

export class Migration20250323122813 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "notification" ("id" uuid not null, "response_line_noti" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "notification_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "notification" cascade;`);
  }

}
