import { list } from '@keystone-6/core';
import { text, relationship, select, timestamp, checkbox } from '@keystone-6/core/fields';

export const Task = list({
    fields: {
        label: text({ validation: { isRequired: true } }),
        priority: select({
            type: 'enum',
            options: [
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
            ],
        }),
        isComplete: checkbox(),
        assignedTo: relationship({ ref: 'User', many: false }),
        finishBy: timestamp(),
    },
});