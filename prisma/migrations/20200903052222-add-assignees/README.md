# Migration `20200903052222-add-assignees`

This migration has been generated by tylor.kolbeck@gmail.com at 9/2/2020, 10:22:22 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `todo_db`.`Project` ADD COLUMN `userId` int  

ALTER TABLE `todo_db`.`Project` ADD FOREIGN KEY (`userId`) REFERENCES `todo_db`.`User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200903035153-just-do-project-owner..20200903052222-add-assignees
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
@@ -17,16 +17,17 @@
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
+  id               Int       @id @default(autoincrement())
+  createdAt        DateTime  @default(now())
+  name             String
+  email            String    @unique
+  password         String
+  links            Link[]
+  votes            Vote[]
+  projects         Project[] // Projects this User owns
+  projectsAssigned Project[] @relation("projectsAssigned") // Projects this user is a part of
 }
 model Project {
   id          Int      @id @default(autoincrement())
@@ -34,10 +35,12 @@
   name        String
   description String
   owner       User     @relation(fields: [ownerId], references: [id])
   ownerId     Int
+  User        User?    @relation("projectsAssigned", fields: [userId], references: [id])
+  userId      Int?
+  @@unique([ownerId, name])
-  @@unique([ownerId, name])
 }
 model Vote {
   id     Int  @id @default(autoincrement())
```

