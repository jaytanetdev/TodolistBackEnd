import { Migration } from '@mikro-orm/migrations';

export class Migration20250316084307 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "auth_methods" ("id" uuid not null, "method_type" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "refresh_token" text null, "user_id" uuid null, constraint "auth_methods_pkey" primary key ("id"));`);

    this.addSql(`create table "auth_password" ("id" uuid not null, "password_hash" text not null, "created_at" timestamptz not null, "jwt_id" uuid null, "auth_method_id" uuid null, constraint "auth_password_pkey" primary key ("id"));`);

    this.addSql(`alter table "auth_methods" add constraint "auth_methods_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "auth_password" add constraint "auth_password_auth_method_id_foreign" foreign key ("auth_method_id") references "auth_methods" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user" alter column "password_hash" drop default;`);
    this.addSql(`alter table "user" alter column "password_hash" type text using ("password_hash"::text);`);
    this.addSql(`alter table "user" rename column "username" to "email";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "auth_password" drop constraint "auth_password_auth_method_id_foreign";`);

    this.addSql(`drop table if exists "auth_methods" cascade;`);

    this.addSql(`drop table if exists "auth_password" cascade;`);

    this.addSql(`alter table "user" alter column "password_hash" type text using ("password_hash"::text);`);
    this.addSql(`alter table "user" alter column "password_hash" set default '';`);
    this.addSql(`alter table "user" rename column "email" to "username";`);
  }

}
