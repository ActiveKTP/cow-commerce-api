import { list } from "@keystone-6/core";
import { integer, relationship, select, text, timestamp } from "@keystone-6/core/fields";

export const Mating = list({
    fields: {
        cow: relationship({
            ref: 'Cow',
            many: false,
            ui: {
                displayMode: 'cards',
                cardFields: ['Farm', 'name', 'cBirthDate', 'cLactation', 'cNumOfService'],
                linkToItem: true,
                inlineConnect: true,
            },
        }),
        maLactation: integer({
            label: 'maLactation',
            //defaultValue: 0,
            ui: {
                createView: { fieldMode: 'hidden' },
                itemView: { fieldMode: 'read' },
                listView: { fieldMode: 'read' },
            },
        }),
        maNumberOfService: integer({
            label: 'maNumberOfService',
            //defaultValue: 0,
            ui: {
                createView: { fieldMode: 'hidden' },
                itemView: { fieldMode: 'read' },
                listView: { fieldMode: 'read' },
            },
        }),
        maMatingMethod: select({
            label: 'MatingMethod',
            type: 'string',
            options: [
                { label: 'NA', value: 'NA' },
                { label: 'AI', value: 'AI' },
                { label: 'ET', value: 'ET' },
            ],
            defaultValue: 'AI',
            ui: {
                displayMode: 'select',
            },
        }),
        maDate: timestamp({
            label: 'maDate',
            validation: { isRequired: true },
            defaultValue: { kind: 'now' },
        }),
        maSemenId: relationship({
            ref: 'SemenBeef',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        maResult: text({
            ui: {
                createView: { fieldMode: 'hidden' },
                itemView: { fieldMode: 'hidden' },
                listView: { fieldMode: 'read' },
            },
            db: {
                isNullable: true,
            }
        }),
        insertAt: timestamp({
            defaultValue: { kind: 'now' },
            ui: {
                createView: { fieldMode: 'hidden' },
                itemView: { fieldMode: 'read' }
            }
        }),
        updatedAt: timestamp({
            //defaultValue: { kind: 'now' }
            db: { updatedAt: true },
            ui: {
                createView: { fieldMode: 'hidden' },
                itemView: { fieldMode: 'read' }
            }
        }),
        userUpdate: relationship({
            ref: 'User',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        pregnancy: relationship({
            ref: 'PregnancyCheck.mating',
            many: true,
            ui: {
                displayMode: 'cards',
                cardFields: ['pcCheckDate', 'pcCheckResult', 'userUpdate'],
                inlineCreate: { fields: ['cow', 'mating', 'pcCheckDate', 'pcCheckResult', 'userUpdate'] },
                inlineEdit: { fields: ['cow', 'mating', 'pcCheckDate', 'pcCheckResult', 'userUpdate'] },
            }
        }),
        Farm: relationship({
            ref: 'Farm',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: false,
            }
        }),
    },
    ui: {
        listView: {
            initialColumns: ['cow', 'maLactation', 'maNumberOfService', 'maDate', 'maSemenId'],
        },
    },
    hooks: {
        resolveInput: async ({ operation, inputData, resolvedData, context }) => {
            if (operation === 'create') {
                //get cow data 
                const cow = await context.db.Cow.findOne({
                    where: { id: `${inputData.cow.connect.id}` },
                });
                const cLactation = cow.cLactation;
                const cNumOfService: Number = cow.cNumOfService as number + 1;

                resolvedData.maLactation = cLactation;
                resolvedData.maNumberOfService = cNumOfService;
            }
            // return hook
            return resolvedData;
        },
        afterOperation: async ({ operation, inputData, originalItem, item, resolvedData, context }) => {
            if (operation === 'create') {
                //Update Cow
                const Cow = await context.db.Cow.updateOne({
                    where: { id: `${inputData.cow.connect.id}` },
                    data: {
                        cLactation: resolvedData.maLactation,
                        cNumOfService: resolvedData.maNumberOfService,
                        cStatus: 'CO',
                        cProductionStatus: 'MA',
                    },
                });
            }
            else if (operation === 'delete') {
                //*******sol 1 ************************
                //get cow data 
                const cow = await context.db.Cow.findOne({
                    where: { id: `${originalItem.cowId}` },
                });
                //console.log(`cow => : ${JSON.stringify(cow)}`);

                if (!(cow.cLactation == originalItem.maLactation && cow.cNumOfService == originalItem.maNumberOfService)) {//if not current mating data
                    console.log(`originalItem => : ${JSON.stringify(originalItem)}`);
                    //Update Mating
                    //1. get all mating for update ////////////////////////////
                    const allMatingData = await context.db.Mating.findMany({
                        where: {
                            AND: {
                                cow: { id: { equals: `${cow.id}` } },
                                maLactation: { equals: originalItem.maLactation },
                                maNumberOfService: { gt: originalItem.maNumberOfService },
                            }
                        },
                        //orderBy: [{ maLactation: 'desc' }, { maNumberOfService: 'desc' }],
                    });

                    const dataJson = new Array;
                    allMatingData.forEach(element => {
                        //console.log(`item => : ${element.id}`);
                        dataJson.push({
                            where: { id: element.id },
                            data: {
                                maNumberOfService: element.maNumberOfService as number - 1,
                            },
                        });
                    });
                    console.log(`data => : ${JSON.stringify(dataJson)}`);
                    /////////////////////////////////////////////////////////

                    //2.update
                    const mating = await context.db.Mating.updateMany({
                        data: dataJson
                    });
                    console.log(`update mating => : ${JSON.stringify(mating)}`);
                }

                //Update Cow
                //get max Mating
                const maxMatingData = await context.db.Mating.findMany({
                    where: { cow: { id: { equals: `${cow.id}` } } },
                    take: 1,
                    skip: 0,
                    orderBy: [{ maLactation: 'desc' }, { maNumberOfService: 'desc' }],
                });
                console.log(`maxMatingData => : ${JSON.stringify(maxMatingData)}`);
                // cow update
                if (maxMatingData.length) {
                    const Cow = await context.db.Cow.updateOne({
                        where: { id: `${cow.id}` },
                        data: {
                            cLactation: maxMatingData[0].maLactation,
                            cNumOfService: maxMatingData[0].maNumberOfService,
                        },
                    });
                    console.log(`cLactation => : ${maxMatingData[0].maLactation}`);
                    console.log(`cNumOfService => : ${maxMatingData[0].maNumberOfService}`);
                }
                //end ***************sol 1 ************************
            }
        }
    },
});