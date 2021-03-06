# Migration `20200912180815-add-priority-enum`

This migration has been generated by tylor.kolbeck@gmail.com at 9/12/2020, 11:08:15 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `todo_db`.`Task` MODIFY `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'LOW',
MODIFY `sos` boolean DEFAULT false

ALTER TABLE `todo_db`.`User` ADD COLUMN `role` ENUM('USER', 'ADMIN')  NOT NULL DEFAULT 'USER'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200912002646-make-task-fields-optional..20200912180815-add-priority-enum
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
@@ -29,8 +29,9 @@
   projectsAssigned Project[]   @relation("projectsAssigned") // Projects this user is a member of
   tasksAssigned    Task[]      @relation("tasksAssigned")
   Task             Task[]
   milestone        Milestone[]
+  role             Role        @default(USER)
 }
 model Project {
   id          Int         @id @default(autoincrement())
@@ -74,14 +75,25 @@
   name          String
   description   String?
   color         String?
   dateCompleted DateTime?
-  priority      String?
-  sos           Boolean?
+  priority      Priority   @default(LOW)
+  sos           Boolean?   @default(false)
   assigned      User[]     @relation("tasksAssigned", fields: [assigneeId], references: [id])
   assigneeId    Int?
   creator       User?      @relation(fields: [creatorId], references: [id])
   creatorId     Int?
   dueDate       DateTime?
   milestone     Milestone? @relation(fields: [milestoneId], references: [id])
   milestoneId   Int?
 }
+
+enum Priority {
+  LOW
+  MEDIUM
+  HIGH
+}
+
+enum Role {
+  USER
+  ADMIN
+}
```


