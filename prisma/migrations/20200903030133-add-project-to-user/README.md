# Migration `20200903030133-add-project-to-user`

This migration has been generated by tylor.kolbeck@gmail.com at 9/2/2020, 8:01:33 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `todo_db`.`_ProjectToUser` DROP FOREIGN KEY `_projecttouser_ibfk_1`

ALTER TABLE `todo_db`.`_ProjectToUser` DROP FOREIGN KEY `_projecttouser_ibfk_2`

ALTER TABLE `todo_db`.`Project` ADD COLUMN `userId` int  

CREATE TABLE `todo_db`.`_assigned_projects` (
`A` int  NOT NULL ,
`B` int  NOT NULL ,
UNIQUE Index `_assigned_projects_AB_unique`(`A`,
`B`),
Index `_assigned_projects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `todo_db`.`_assigned_projects` ADD FOREIGN KEY (`A`) REFERENCES `todo_db`.`Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `todo_db`.`_assigned_projects` ADD FOREIGN KEY (`B`) REFERENCES `todo_db`.`User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `todo_db`.`Project` ADD FOREIGN KEY (`userId`) REFERENCES `todo_db`.`User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

DROP TABLE `todo_db`.`_ProjectToUser`
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200903025808-add-project-model..20200903030133-add-project-to-user
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
@@ -17,28 +17,31 @@
   votes       Vote[]
 }
 model User {
-  id        Int       @id @default(autoincrement())
-  createdAt DateTime  @default(now())
-  name      String
-  email     String    @unique
-  password  String
-  links     Link[]
-  votes     Vote[]
-  projects  Project[]
-  Project   Project[] @relation("ownerId")
+  id                Int       @id @default(autoincrement())
+  createdAt         DateTime  @default(now())
+  name              String
+  email             String    @unique
+  password          String
+  links             Link[]
+  votes             Vote[]
+  assigned_projects Project[] @relation("assigned_projects")
+  owned_projects    Project[] @relation("ownedProjects")
+  Project           Project[] @relation("owned_projects")
 }
 model Project {
   id          Int      @id @default(autoincrement())
   createdAt   DateTime @default(now())
   name        String
   description String
-  owner       User?    @relation(name: "ownerId", fields: [ownerId], references: [id])
+  owner       User?    @relation(name: "owned_projects", fields: [ownerId], references: [id])
   ownerId     Int?
-  assignees   User[]   @relation(fields: [assigneeId], references: [id])
+  assignees   User[]   @relation("assigned_projects", fields: [assigneeId], references: [id])
   assigneeId  Int?
+  User        User?    @relation("ownedProjects", fields: [userId], references: [id])
+  userId      Int?
 }
 model Vote {
   id     Int  @id @default(autoincrement())
```


