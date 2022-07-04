export async function isCurrentLacnService(inputData: any, context: any, operation: any): Promise<boolean> {

    //console.log(`inputData => : ${JSON.stringify(inputData)}`);

    const cowId = operation === 'create' ? inputData.cow.connect.id : inputData.cowId;
    const matingId = operation === 'create' ? inputData.mating.connect.id : inputData.matingId;

    // //get cow data 
    // const cow = await context.db.Cow.findOne({
    //     where: { id: `${cowId}` },
    // });

    //get max Mating
    const maxMatingData = await context.db.Mating.findMany({
        where: { cow: { id: { equals: `${cowId}` } } },
        take: 1,
        skip: 0,
        orderBy: [{ maLactation: 'desc' }, { maNumberOfService: 'desc' }],
    });
    //console.log(`maxMatingData => : ${JSON.stringify(maxMatingData)}`);

    //get mating data 
    const mating = await context.db.Mating.findOne({
        where: { id: `${matingId}` },
    });
    //console.log(`mating => : ${JSON.stringify(mating)}`);

    return (maxMatingData[0].maLactation == mating.maLactation && maxMatingData[0].maNumberOfService == mating.maNumberOfService);
}