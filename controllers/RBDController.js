import RBDModel from "../models/RBDModel.js";

export async function createRBD(req, res, next) {
    try {
        const data = req.body;
        const createData = await RBDModel.create({
            indexCount: data.indexCount,
            partNumber: data.partNumber,
            productName: data.productName,
            fr: data.fr,
            productId: data.productId,
            fmecaId: data.fmecaId,
            fmDescription: data.fmDescription,
            elementType: data.elementType,
            time: data.time,
            repair: data.repair,
            inspectionPeriod: data.inspectionPeriod,
            dutyCycle: data.dutyCycle,
            color: data.color,
            projectId: data.projectId,
            companyId: data.companyId,

        });
        console.log("createData", createData);
        res.status(201).json(createData);
    } catch (error) {
        next(error);
    }
}
//  export async function get