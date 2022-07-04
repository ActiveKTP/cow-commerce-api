import { list } from "@keystone-6/core";
import { text, select, timestamp, checkbox, integer, relationship, image } from "@keystone-6/core/fields";
import { filters } from "@keystone-6/core/types";
import { CowBreed } from "./CowBreed";

export const Cow = list({
    fields: {
        Farm: relationship({
            ref: 'Farm.cow',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: false,
            }
        }),
        cowId: text({
            label: 'CowId',
            validation: { isRequired: true }
        }),
        name: text({
            label: 'Name',
            validation: { isRequired: true }
        }),
        cSex: select({
            label: 'Sex',
            type: 'string',
            options: [
                { label: 'Male', value: 'M' },
                { label: 'Female', value: 'F' },
            ],
            ui: {
                displayMode: 'segmented-control',
            },
        }),
        cBirthDate: timestamp({ label: 'BirthDate', }),
        cStatus: select({
            label: 'Status',
            type: 'string',
            options: [
                { label: 'CA', value: 'CA' },
                { label: 'HI', value: 'HI' },
                { label: 'CO', value: 'CO' },
                { label: 'BU', value: 'BU' },
            ],
            ui: {
                displayMode: 'select',
            },
        }),
        cProductionStatus: select({
            label: 'ProductionStatus',
            type: 'string',
            options: [
                { label: 'MA', value: 'MA' },
                { label: 'PG', value: 'PG' },
                { label: 'NO', value: 'NO' },
                { label: 'DU', value: 'DU' },
                { label: 'CV', value: 'CV' },
                { label: 'AB', value: 'AB' },
            ],
            ui: {
                displayMode: 'select',
            },
        }),
        cLactation: integer({ label: 'Lactation', }),
        cNumOfService: integer({ label: 'Numservice', }),
        frontimage: image({ label: 'Front Images', storage: 'my_S3_images' }),
        sideimage: image({ label: 'Side Images', storage: 'my_S3_images' }),
        backimage: image({ label: 'Back Images', storage: 'my_S3_images' }),
        cFirstBreed: checkbox({ label: 'FirstBreed', }),
        cSireId: relationship({
            label: 'Sire',
            ref: 'Cow',
            many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        cDamId: relationship({
            label: 'Dam',
            ref: 'Cow', many: false,
            ui: {
                displayMode: 'select',
                hideCreate: true,
            },
        }),
        cowBreed: relationship({
            ref: 'CowBreed.cow',
            many: true,
            ui: {
                displayMode: 'cards',
                cardFields: ['cow', 'breedType', 'breedPercent'],
                inlineCreate: { fields: ['cow', 'breedType', 'breedPercent'] },
                inlineEdit: { fields: ['cow', 'breedType', 'breedPercent'] },
            }
        }),
        cDateJoininHerd: timestamp({ label: 'JoinDate', }),
        cSource: select({
            label: 'Source',
            type: 'string',
            options: [
                { label: 'IN Farm', value: 'IN' },
                { label: 'BUY', value: 'BY' },
            ],
            ui: {
                displayMode: 'segmented-control',
            },
        }),
        cowPrice: relationship({
            ref: 'CowPrice.cow',
            many: true,
            ui: {
                // displayMode: 'select',
                // hideCreate: false,
                displayMode: 'cards',
                cardFields: ['maxPrice', 'minPrice'],
                inlineCreate: { fields: ['cow', 'maxPrice', 'minPrice'] },
                inlineEdit: { fields: ['cow', 'maxPrice', 'minPrice'] },
            }
        }),
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
            initialColumns: ['cowId', 'name'],
        },
    },
});