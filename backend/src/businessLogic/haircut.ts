import * as uuid from "uuid";
import {CreateHaircutAppointment} from "../requests/CreateHaircutAppointment";
import {HaircutAccess} from "../dataLayer/haircutAccess";
import {HaircutAppointment} from "../models/HaircutAppointment";
import {UpdateHaircutAppointment} from "../requests/UpdateHaircutAppointment";
import {createLogger} from "../utils/logger";

const haircutAccess = new HaircutAccess()
const logger = createLogger("haircut-bl")

export class HaircutBL {
    async createNew(newHaircutData: CreateHaircutAppointment, userId: string) {
        const haircutId = uuid.v4()
        
        const newHaircutAppointment: HaircutAppointment = {
            userId: userId,
            haircutId: haircutId,
            createdAt: new Date().toISOString(),
            done: false,
            ...newHaircutData
        }
        await haircutAccess.saveHaircut(newHaircutAppointment)
        logger.info(`New haircut appointment ${haircutId} created by user ${userId}`)
        return newHaircutAppointment
    }

    async delete(haircutId: string, userId: string) {
        const haircut = await haircutAccess.findHaircut(haircutId, userId)
        if (!haircut) {
            return undefined
        }

        await haircutAccess.deleteHaircut(haircutId, userId);
        logger.info(`Haircut appointment ${haircutId} deleted by user ${userId}`)
        return haircut
    }

    async findAll(userId: string) {
        logger.info(`All haircut appointments requested by ${userId}`)
        return await haircutAccess.getHaircuts(userId)
    }

    async update(haircutId: string, updateHaircutData: UpdateHaircutAppointment, userId: string) {
        const oldHaircut = await haircutAccess.findHaircut(haircutId, userId)
        if (!oldHaircut) {
            return undefined
        }
        
        await haircutAccess.updateHaircut(haircutId, userId, updateHaircutData)
        logger.info(`Haircut appointment ${haircutId} updated by user ${userId}`)
        return oldHaircut
    }

    async createAttachment(haircutId: string, userId: string) {
        const haircut = await haircutAccess.findHaircut(haircutId, userId)
        if (!haircut) {
            return undefined
        }
        
        await haircutAccess.attachToHaircut(haircutId, userId);
        logger.info(`Attachment added to ${haircutId} by user ${userId}`)
        return haircutAccess.getHaircutUploadURL(haircutId)
    }
}