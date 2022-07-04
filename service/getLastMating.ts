export async function getLastMating(inputData: any, context: any, operation: any): Promise<any> {

    const ccowId = operation === 'create' ? inputData.cow.connect.id : inputData.cowId;

    //console.log(`ccowId => : ${ccowId}`);

    //get max Mating
    const maxMatingData = await context.db.Mating.findMany({
        where: { cow: { id: { equals: `${ccowId}` } } },
        take: 1,
        skip: 0,
        orderBy: [{ maLactation: 'desc' }, { maNumberOfService: 'desc' }],
    });
    //console.log(`maxMatingData => : ${JSON.stringify(maxMatingData)}`);

    return (maxMatingData);
}