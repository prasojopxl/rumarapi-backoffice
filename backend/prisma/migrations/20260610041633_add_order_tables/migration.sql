-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `bookingCode` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `workerId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PENDING', 'CANCEL', 'REJECT', 'EXPIRED', 'PROCESS', 'ON_PROGRESS', 'DONE') NOT NULL DEFAULT 'DRAFT',
    `scheduledAt` DATETIME(3) NULL,
    `address` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_bookingCode_key`(`bookingCode`),
    INDEX `Order_clientId_idx`(`clientId`),
    INDEX `Order_workerId_idx`(`workerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `price` DECIMAL(12, 2) NOT NULL,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `totalPrice` DECIMAL(12, 2) NOT NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `OrderItem_orderId_idx`(`orderId`),
    INDEX `OrderItem_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderStatusHistory` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `fromStatus` ENUM('DRAFT', 'PENDING', 'CANCEL', 'REJECT', 'EXPIRED', 'PROCESS', 'ON_PROGRESS', 'DONE') NOT NULL,
    `toStatus` ENUM('DRAFT', 'PENDING', 'CANCEL', 'REJECT', 'EXPIRED', 'PROCESS', 'ON_PROGRESS', 'DONE') NOT NULL,
    `changedByUserId` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OrderStatusHistory_orderId_idx`(`orderId`),
    INDEX `OrderStatusHistory_changedByUserId_idx`(`changedByUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderStatusHistory` ADD CONSTRAINT `OrderStatusHistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderStatusHistory` ADD CONSTRAINT `OrderStatusHistory_changedByUserId_fkey` FOREIGN KEY (`changedByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
