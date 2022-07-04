import { list } from "@keystone-6/core";
import { object } from "@keystone-6/core/dist/declarations/src/types/schema/schema-api-with-context";
import { checkbox, relationship, select, timestamp } from "@keystone-6/core/fields";
import { getLastMating } from "../service/getLastMating";
import { getLastPregnancy } from "../service/getLastPregnancy";
import { isCurrentLacnService } from "../service/isCurrentLacnService";

export const Abortion = list({
    fields: {
        cow: relationship({
            ref: 'Cow',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        mating: relationship({
            ref: 'Mating',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        abAbortionDate: timestamp({
            label: 'AbortionDate',
            validation: { isRequired: true },
            defaultValue: { kind: 'now' },
        }),
        setNewLac: checkbox({ defaultValue: false, label: 'Set New Lactation', }),
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
        Farm: relationship({
            ref: 'Farm',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: false,
            }
        }),
    },
    hooks: {
        resolveInput: async ({ operation, inputData, resolvedData, context }) => {
            // return hook
            return resolvedData;
        },
        afterOperation: async ({ operation, inputData, originalItem, item, resolvedData, context }) => {
            if (operation === 'create') {

                console.log(`inputData => : ${JSON.stringify(inputData)}`);

                const iscurrent = await isCurrentLacnService(inputData, context, operation);
                console.log(`iscurrent => : ${JSON.stringify(iscurrent)}`);

                const lastMating = await getLastMating(inputData, context, operation);

                //new lac set ? ///////////
                var dataObj = new Object;
                if (inputData.setNewLac) {
                    dataObj = {
                        cProductionStatus: 'AB',
                        cLactation: lastMating[0].maLactation as number + 1,
                        cNumOfService: 0,
                    }
                } else {
                    dataObj = {
                        cProductionStatus: 'AB',
                    }
                }
                ///////////////////////////

                //Update Cow
                if (iscurrent) {
                    const cowUpdate = await context.db.Cow.updateOne({
                        where: { id: `${inputData.cow.connect.id}` },
                        data: dataObj,
                    });
                }

                //Update mating
                const matingUdate = await context.db.Mating.updateOne({
                    where: { id: `${inputData.mating.connect.id}` },
                    data: {
                        maResult: 'AB',
                    },
                });
            }
            else if (operation === 'update') {
                console.log(`inputData => : ${JSON.stringify(inputData)}`);
                console.log(`originalItem => : ${JSON.stringify(originalItem)}`);

                const iscurrent = await isCurrentLacnService(originalItem, context, operation);
                console.log(`iscurrent => : ${JSON.stringify(iscurrent)}`);

                const lastMating = await getLastMating(originalItem, context, operation);

                //new lac set ? ///////////
                var dataObj = new Object;
                if (inputData.setNewLac) {
                    dataObj = {
                        cLactation: lastMating[0].maLactation as number + 1,
                        cNumOfService: 0,
                    }
                } else {
                    dataObj = {
                        cLactation: lastMating[0].maLactation,
                        cNumOfService: lastMating[0].maNumberOfService,
                    }
                }
                console.log(`dataObj => : ${JSON.stringify(dataObj)}`);
                ///////////////////////////

                //Update Cow
                if (iscurrent) {
                    const cowUpdate = await context.db.Cow.updateOne({
                        where: { id: `${originalItem.cowId}` },
                        data: dataObj,
                    });
                }
            }
            else if (operation === 'delete') {
                const iscurrent = await isCurrentLacnService(originalItem, context, operation);
                //console.log(`iscurrent => : ${JSON.stringify(iscurrent)}`);
                const lastMating = await getLastMating(originalItem, context, operation);
                const lastPregnancy = await getLastPregnancy(originalItem, context, operation);

                //Update Cow
                //check last Preg
                var pcCheckResult = new String;
                if (lastPregnancy.length) {
                    pcCheckResult = `${lastPregnancy[0].pcCheckResult}`;
                } else {
                    pcCheckResult = 'MA';
                }
                ///////////////////////////

                //new lac set ? ///////////
                var dataObj = new Object;
                if (originalItem.setNewLac) {
                    dataObj = {
                        cProductionStatus: pcCheckResult,
                        cLactation: lastMating[0].maLactation,
                        cNumOfService: lastMating[0].maNumberOfService,
                    }
                } else {
                    dataObj = {
                        cProductionStatus: pcCheckResult,
                    }
                }
                ///////////////////////////
                if (iscurrent) {
                    const cowUpdate = await context.db.Cow.updateOne({
                        where: { id: `${originalItem.cowId}` },
                        data: dataObj,
                    });
                }

                //Update mating
                //check last Preg
                var pcCheckResult = new String;
                if (lastPregnancy.length) {
                    pcCheckResult = `${lastPregnancy[0].pcCheckResult}`;
                } else {
                    pcCheckResult = "";
                }
                ///////////////////////////
                const matingUdate = await context.db.Mating.updateOne({
                    where: { id: `${originalItem.matingId}` },
                    data: {
                        maResult: pcCheckResult,
                    },
                });
            }
        },
    }
});