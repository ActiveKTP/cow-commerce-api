import { list } from "@keystone-6/core";
import { float, relationship, text, timestamp } from "@keystone-6/core/fields";

export const CowBreed = list({
    fields: {
        cow: relationship({
            ref: 'Cow.cowBreed',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        breedType: relationship({
            ref: 'Breed',
            many: false,
            ui: {
                displayMode: 'select',
                labelField: 'BreedName',
            },
        }),
        breedPercent: float(),
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
    },
    ui: {
        isHidden: true,
        listView: {
            initialColumns: ['cow', 'breedType', 'breedPercent'],
        },
    },
});