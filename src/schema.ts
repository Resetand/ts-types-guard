// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

import { is } from './guards';
import { InferTypeSchema, TypeSchema } from './types';

const schemaGuardFactory = (options: { strict: boolean }) => {
    const strict = options?.strict ?? false;

    const validate = <TSchema extends TypeSchema<any>>(
        value: unknown,
        schema: TSchema,
    ): value is InferTypeSchema<TSchema> => {
        if (is.Function(schema)) {
            return schema(value);
        }

        if (is.PlainObject(value)) {
            if (Object.keys(value).length !== Object.keys(schema).length && strict) {
                return false;
            }
            return Object.entries(schema).every(([key, guard]) =>
                is.HasKey(value, key) ? validate(value[key], guard) : false,
            );
        }

        throw new Error('Schema must be an object schema or a guard function');
    };

    return validate;
};

export const schemaGuard = schemaGuardFactory({ strict: false });
export const schemaGuardStrict = schemaGuardFactory({ strict: true });
