# Migration `20200903031453-edit`

This migration has been generated by tylor.kolbeck@gmail.com at 9/2/2020, 8:14:53 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200903030658-fix-user..20200903031453-edit
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
@@ -25,16 +25,17 @@
   password          String
   links             Link[]
   votes             Vote[]
   assigned_projects Project[] @relation("assigned_projects")
-  Project           Project[] @relation("owned_projects")
+  projects          Project[] @relation("owned_projects")
 }
 model Project {
   id          Int      @id @default(autoincrement())
   createdAt   DateTime @default(now())
   name        String
   description String
+  // OWNER NEEDS TO BE REQUIRED
   owner       User?    @relation(name: "owned_projects", fields: [ownerId], references: [id])
   ownerId     Int?
   assignees   User[]   @relation("assigned_projects", fields: [assigneeId], references: [id])
   assigneeId  Int?
```


