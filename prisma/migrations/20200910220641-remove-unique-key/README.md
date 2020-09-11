# Migration `20200910220641-remove-unique-key`

This migration has been generated by tylor.kolbeck@gmail.com at 9/10/2020, 3:06:41 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
DROP INDEX `Project.id_assigneeId_unique` ON `todo_db`.`Project`
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200910213412-add-unique-field..20200910220641-remove-unique-key
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "mysql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -38,9 +38,8 @@
   ownerId     Int
   assignees   User[]   @relation("projectsAssigned", fields: [assigneeId], references: [id])
   assigneeId  Int?
   @@unique([ownerId, name])
-  @@unique([id, assigneeId])
 }
 model Vote {
   id     Int  @id @default(autoincrement())
```

