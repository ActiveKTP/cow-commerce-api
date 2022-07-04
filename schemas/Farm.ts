import { list } from "@keystone-6/core";
import { relationship, text, timestamp } from "@keystone-6/core/fields";

export const Farm = list({
    fields: {
        name: text({
            validation: { isRequired: true }
        }),
        Address: text(),
        MobileNo: text(),
        cow: relationship({
            ref: 'Cow.Farm',
            many: true,
            ui: {
                displayMode: 'select',
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
    }
});