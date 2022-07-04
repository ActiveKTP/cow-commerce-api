import { list } from "@keystone-6/core";
import { integer, relationship, text, timestamp } from "@keystone-6/core/fields";

export const CowPrice = list({
    fields: {
        cow: relationship({
            ref: 'Cow.cowPrice',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        maxPrice: integer(),
        minPrice: integer(),
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
            initialColumns: ['maxPrice', 'minPrice'],
        },
    },
});