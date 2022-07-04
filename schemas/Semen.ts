import { list } from "@keystone-6/core";
import { checkbox, integer, relationship, text, timestamp } from "@keystone-6/core/fields";

export const SemenBeef = list({
    fields: {
        cow: relationship({
            ref: 'Cow',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        name: text({
            label: 'SemenName',
            validation: { isRequired: true }
        }),
        recivedDate: timestamp({ validation: { isRequired: true } }),
        expireDate: timestamp(),
        keepLocation: text(),
        sPrice: integer({ label: 'Semen Price', }),
        isActive: checkbox({ defaultValue: true, }),
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
        listView: {
            initialColumns: ['name', 'cow', 'recivedDate', 'expireDate', 'keepLocation'],
        },
    },
});