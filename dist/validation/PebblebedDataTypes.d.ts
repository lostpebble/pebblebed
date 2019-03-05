import { IOJoiSchemaObjectPropertyMetaInput, IOJoiSchemaPropertyMetaInput, IOJoiSchemaSerializedJsonPropertyMetaInput } from "../";
import * as Joi from "joi";
export declare type TPebblebedJoiTypeFunction<T, K, I = IOJoiSchemaPropertyMetaInput<K>, E = any> = (meta?: I, extraOptions?: E) => T;
export declare const PebbleStringId: () => Joi.StringSchema;
export declare const PebbleStringIdStrict: () => Joi.StringSchema;
export declare const PebbleStringIdStrictWithFirebase: () => Joi.StringSchema;
export declare const PebbleIntegerId: () => Joi.NumberSchema;
export declare const PebbleInteger: TPebblebedJoiTypeFunction<Joi.NumberSchema, number>;
export declare const PebbleDouble: TPebblebedJoiTypeFunction<Joi.NumberSchema, number>;
export declare const PebbleGeoPoint: TPebblebedJoiTypeFunction<Joi.AnySchema, any>;
interface IPebbleStringExtraOptions {
    allowEmpty?: boolean;
}
export declare const PebbleString: TPebblebedJoiTypeFunction<Joi.StringSchema, string, IOJoiSchemaPropertyMetaInput<string>, IPebbleStringExtraOptions>;
export declare const PebbleBoolean: TPebblebedJoiTypeFunction<Joi.BooleanSchema, boolean>;
export declare const PebbleDateTime: TPebblebedJoiTypeFunction<Joi.DateSchema, Date>;
export declare const PebbleArray: TPebblebedJoiTypeFunction<Joi.ArraySchema, any[]>;
export declare const PebbleObject: TPebblebedJoiTypeFunction<Joi.ObjectSchema, object, IOJoiSchemaPropertyMetaInput<object> & IOJoiSchemaObjectPropertyMetaInput>;
export declare const PebbleSerializedJson: TPebblebedJoiTypeFunction<Joi.AnySchema, any, IOJoiSchemaPropertyMetaInput<any> & IOJoiSchemaSerializedJsonPropertyMetaInput>;
export declare const types: {
    integerId: () => Joi.NumberSchema;
    stringId: () => Joi.StringSchema;
    stringIdStrict: () => Joi.StringSchema;
    stringIdStrictFirebase: () => Joi.StringSchema;
    integer: TPebblebedJoiTypeFunction<Joi.NumberSchema, number, IOJoiSchemaPropertyMetaInput<number>, any>;
    string: TPebblebedJoiTypeFunction<Joi.StringSchema, string, IOJoiSchemaPropertyMetaInput<string>, IPebbleStringExtraOptions>;
    double: TPebblebedJoiTypeFunction<Joi.NumberSchema, number, IOJoiSchemaPropertyMetaInput<number>, any>;
    geoPoint: TPebblebedJoiTypeFunction<Joi.AnySchema, any, IOJoiSchemaPropertyMetaInput<any>, any>;
    boolean: TPebblebedJoiTypeFunction<Joi.BooleanSchema, boolean, IOJoiSchemaPropertyMetaInput<boolean>, any>;
    dateTime: TPebblebedJoiTypeFunction<Joi.DateSchema, Date, IOJoiSchemaPropertyMetaInput<Date>, any>;
    array: TPebblebedJoiTypeFunction<Joi.ArraySchema, any[], IOJoiSchemaPropertyMetaInput<any[]>, any>;
    object: TPebblebedJoiTypeFunction<Joi.ObjectSchema, object, IOJoiSchemaPropertyMetaInput<object> & IOJoiSchemaObjectPropertyMetaInput, any>;
    serializedJson: TPebblebedJoiTypeFunction<Joi.AnySchema, any, IOJoiSchemaPropertyMetaInput<any> & IOJoiSchemaSerializedJsonPropertyMetaInput, any>;
    specialized: {
        dateTimeUpdated: TPebblebedJoiTypeFunction<Joi.DateSchema, Date, IOJoiSchemaPropertyMetaInput<Date>, any>;
        dateTimeCreated: TPebblebedJoiTypeFunction<Joi.DateSchema, Date, IOJoiSchemaPropertyMetaInput<Date>, any>;
    };
};
export {};
