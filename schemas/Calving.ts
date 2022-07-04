import { list } from "@keystone-6/core";
import { relationship, select, timestamp } from "@keystone-6/core/fields";
import { getLastMating } from "../service/getLastMating";
import { getLastPregnancy } from "../service/getLastPregnancy";
import { isCurrentLacnService } from "../service/isCurrentLacnService";

export const Calving = list({
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
        cvgDate: timestamp({
            label: 'cvgDate',
            validation: { isRequired: true },
            defaultValue: { kind: 'now' },
        }),
        calve: relationship({
            ref: 'Calve.calving',
            many: true,
            ui: {
                displayMode: 'cards',
                cardFields: ['cvSex', 'cvCalveNo', 'cvCalveName'],
                inlineCreate: { fields: ['cow', 'calving', 'cvSex', 'cvCalveNo', 'cvCalveName'] },
                inlineEdit: { fields: ['cow', 'calving', 'cvSex', 'cvCalveNo', 'cvCalveName'] },
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

                //Update Cow
                if (iscurrent) {
                    const cowUpdate = await context.db.Cow.updateOne({
                        where: { id: `${inputData.cow.connect.id}` },
                        data: {
                            cProductionStatus: 'CV',
                            cLactation: lastMating[0].maLactation as number + 1,
                            cNumOfService: 0,
                        },
                    });
                }

                //Update mating
                const matingUdate = await context.db.Mating.updateOne({
                    where: { id: `${inputData.mating.connect.id}` },
                    data: {
                        maResult: 'CV',
                    },
                });
            }
            else if (operation === 'delete') {
                const iscurrent = await isCurrentLacnService(originalItem, context, operation);
                const lastMating = await getLastMating(originalItem, context, operation);
                const lastPregnancy = await getLastPregnancy(originalItem, context, operation);

                //check last Preg
                var pcCheckResult = new String;
                if (lastPregnancy.length) {
                    pcCheckResult = `${lastPregnancy[0].pcCheckResult}`;
                } else {
                    pcCheckResult = 'MA';
                }
                ///////////////////////////
                //Update Cow
                if (iscurrent) {
                    const cowUpdate = await context.db.Cow.updateOne({
                        where: { id: `${originalItem.cowId}` },
                        data: {
                            cProductionStatus: pcCheckResult,
                            cLactation: lastMating[0].maLactation,
                            cNumOfService: lastMating[0].maNumberOfService,
                        },
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