import ElementParameterData from "../models/ElementParameterModal.js"
export const createElementParameter = async (req, res) => {
  const data = req.body;
  const elementParameters = await ElementParameterData.create({
    indexCount: data.indexCount,
    partNumber: data.partNumber,
    productName: data.productName,
    fr: data.fr,
    // blockId:data.blockId,
    productId: data.productId,
    fmecaId: data.fmecaId,
    fmDescription: data.fmDescription,
    elementType: data.elementType,
    time: data.time,
    repair: data.repair,
    inspectionPeriod: data.inspectionPeriod,
    dutyCycle: data.dutyCycle,
    color: data.color,
    frDistribution: data.frDistribution,
    k: data.k,
    n: data.n,
    repairDistribution: data.repairDistribution,
    load: data.load,
    mct: data.mct,
    projectId: data.projectId,
    companyId: data.companyId,
  });
  console.log("elementParameters", elementParameters)
  res.status(201).json({
    success: true,
    data: data
  });

}

export const updateelementParameters = async (req, res) => {
  const data = req.body
  console.log("dagggh.....", data)
  const elementParameters = await ElementParameterData.findByIdAndUpdate({
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
    frDistribution: data.frDistribution,
    k: data.k,
    n: data.n,
    repairDistribution: data.repairDistribution,
    load: data.load,
    mct: data.mct,
    projectId: data.projectId,
    companyId: data.companyId,
  });
  console.log("elementParameters", elementParameters)
  res.status(201).json({
    success: true,
    data: data
  });
}


export const getElementParameterById = async (req, res) => {
  console.log("Apple....")
  try {
    console.log("ID...", req.query)
    const elementParameter = await ElementParameterData.find({ projectId: req.query.projectId });
    console.log("ElementParameters...", elementParameter)
    if (!elementParameter) {
      return res.status(404).json({
        success: false,

        message: "Element Parameter not found",
      });
    }
    res.status(200).json({
      success: true,
      data: elementParameter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}