import { list } from "@keystone-6/core";
import { integer, relationship, select, text, timestamp } from "@keystone-6/core/fields";

export const Calve = list({
    fields: {
        cow: relationship({
            ref: 'Cow',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        calving: relationship({
            ref: 'Calving.calve',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        cvSex: select({
            label: 'Sex',
            type: 'string',
            validation: { isRequired: true },
            options: [
                { label: 'Male', value: 'M' },
                { label: 'Female', value: 'F' },
            ],
            ui: {
                displayMode: 'segmented-control',
            },
        }),
        cvCalveNo: text({
            label: 'CalveNo',
            validation: { isRequired: true }
        }),
        cvCalveName: text({
            label: 'Name',
            validation: { isRequired: true }
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
    },
    ui: {
        isHidden: false,
    },
});