import isTupleOf from './guards/isTupleOf';
import isFunction from './guards/isFunction';
import { curriedGuard } from './utils/_curried-guard';

type IsEqualFn = (value: unknown, expectedValue: unknown) => boolean;

export type IsGuard = {
    /**
     * Check if value is equal to expected value
     *
     * Based on Object.is by default
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     *
     * @example
     * is(1, 1); // -> true
     * is(1, 2); // -> false
     * is(1)(1); // -> true
     * is(1)(2); // -> false
     */
    <T>(expectedValue: T): (value: unknown | T) => value is T;
    <T>(expectedValue: T, isEqual: IsEqualFn): (value: unknown | T) => value is T;
    <T>(value: unknown | T, expectedValue: T): value is T;
    <T>(value: unknown | T, expectedValue: T, isEqual: IsEqualFn): value is T;
};

const isAny = (_v: unknown): _v is unknown => true;

const is: IsGuard = curriedGuard(
    (value: unknown, expectedValue: unknown, isEqual: IsEqualFn = Object.is) => isEqual(value, expectedValue),
    (args, guard) => {
        if (isTupleOf(args, [isAny])) {
            // is(1) -> (value: unknown) => value is 1
            return (value: unknown) => guard(value, args[0]);
        }

        if (isTupleOf(args, [isAny, isFunction])) {
            // is(1, isEqual) -> (value: unknown) => value is 1
            return (value: unknown) => guard(value, args[0], args[1]);
        }

        if (isTupleOf(args, [isAny, isAny])) {
            // is(1, 1) -> true
            return guard(args[0], args[1]);
        }

        if (isTupleOf(args, [isAny, isAny, isFunction])) {
            // is(1, 1, isEqual) -> true
            return guard(args[0], args[1], args[2] as any);
        }

        throw new Error('Invalid arguments');
    },
);

export default is;
