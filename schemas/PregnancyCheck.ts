import { list } from "@keystone-6/core";
import { relationship, select, timestamp } from "@keystone-6/core/fields";
import { isCurrentLacnService } from "../service/isCurrentLacnService";
import { getLastPregnancy } from "../service/getLastPregnancy";

export const PregnancyCheck = list({
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
            ref: 'Mating.pregnancy',
            many: false,
            ui: {
                displayMode: 'cards',
                cardFields: ['cow', 'maLactation', 'maNumberOfService', 'maDate'],
                linkToItem: true,
                inlineConnect: true,
            },
        }),
        pcCheckDate: timestamp({
            label: 'CheckDate',
            validation: { isRequired: true },
            defaultValue: { kind: 'now' },
        }),
        pcCheckResult: select({
            label: 'CheckResult',
            type: 'string',
            options: [
                { label: 'PG', value: 'PG' },
                { label: 'NO', value: 'NO' },
                { label: 'DU', value: 'DU' },
            ],
            ui: {
                displayMode: 'select',
            },
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
    ui: {
        isHidden: false,
        listView: {
            initialColumns: ['cow', 'mating', 'pcCheckDate', 'pcCheckResult'],
        },
    },
    hooks: {
        resolveInput: async ({ operation, inputData, resolvedData, context }) => {
            // return hook
            return resolvedData;
        },
        afterOperation: async ({ operation, inputData, originalItem, item, resolvedData, context }) => {
            if (operation === 'create') {

                const iscurrent = await isCurrentLacnService(inputData, context, operation);
                console.log(`iscurrent => : ${iscurrent}`);

                const lastPregnancy = await getLastPregnancy(inputData, context, operation);
                console.log(`lastPregnancy => : ${JSON.stringify(lastPregnancy)}`);

                //Update Cow
                if (iscurrent) {
                    const cowUpdate = await context.db.Cow.updateOne({
                        where: { id: `${inputData.cow.connect.id}` },
                        data: {
                            cProductionStatus: lastPregnancy.length ? `${lastPregnancy[0].pcCheckResult}` : null,
                        },
                    });
                }

                //Update mating
                const matingUdate = await context.db.Mating.updateOne({
                    where: { id: `${inputData.mating.connect.id}` },
                    data: {
                        maResult: lastPregnancy.length ? `${lastPregnancy[0].pcCheckResult}` : null,
                    },
                });
            }
            else if (operation === 'delete' || operation === 'update') {

                const iscurrent = await isCurrentLacnService(originalItem, context, operation);
                console.log(`iscurrent => : ${iscurrent}`);

                const lastPregnancy = await getLastPregnancy(originalItem, context, operation);
                console.log(`lastPregnancy => : ${JSON.stringify(lastPregnancy)}`);

                //Update Cow
                if (iscurrent) {
                    const cowUpdate = await context.db.Cow.updateOne({
                        where: { id: `${originalItem.cowId}` },
                        data: {
                            cProductionStatus: lastPregnancy.length ? lastPregnancy[0].pcCheckResult : null,
                        },
                    });
                }

                //Update mating
                const matingUdate = await context.db.Mating.updateOne({
                    where: { id: `${originalItem.matingId}` },
                    data: {
                        maResult: lastPregnancy.length ? lastPregnancy[0].pcCheckResult : null,
                    },
                });
            }
        },
    }
});

