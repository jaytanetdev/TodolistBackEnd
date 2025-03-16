import { Migration } from '@mikro-orm/migrations';

export class Migration20250305161229 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" uuid not null, "first_name" text not null, "last_name" text not null, "username" text not null, "password_hash" text not null default '', "created_at" timestamptz not null, "updated_at" timestamptz not null, "is_active" boolean not null default false, "refresh_token" text null, constraint "user_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
