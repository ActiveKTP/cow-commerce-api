export async function getLastPregnancy(inputData: any, context: any, operation: any): Promise<any> {

    //console.log(`inputData => : ${JSON.stringify(inputData)}`);

    const matingId = operation === 'create' ? inputData.mating.connect.id : inputData.matingId;

    console.log(`matingId => : ${matingId}`);

    const lastPregnancy = await context.db.PregnancyCheck.findMany({
        where: { mating: { id: { equals: `${matingId}` } } },
        take: 1,
        skip: 0,
        orderBy: [{ pcCheckDate: 'desc' }],
    });

    return (lastPregnancy);
}