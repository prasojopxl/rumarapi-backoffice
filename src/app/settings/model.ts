import { prisma } from "../../lib/prisma";

export function findSettings() {
    return prisma.setting.findMany()
}

export function findSettingByKey(key: string) {
    return prisma.setting.findUnique({
        where: {
            key,
        },
    })
}

export function createSetting(data: { key: string; value: string; siteName?: string }) {
    return prisma.setting.create({
        data,
    })
}

export function updateSettingByKey(key: string, data: { value?: string; siteName?: string }) {
    return prisma.setting.update({
        where: {
            key,
        },
        data,
    })
}

export function deleteSettingByKey(key: string) {
    return prisma.setting.delete({
        where: {
            key,
        },
    })
}
