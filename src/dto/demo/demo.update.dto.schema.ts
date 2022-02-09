import {JSONSchemaType} from "ajv";
import { DemoUpdateDto } from "./demo.update.dto";

export const demoUpdateValidationSchema:JSONSchemaType<DemoUpdateDto> = {
    
    type: 'object', 
    // Type can be: number, integer, string, boolean, array, object or null. see https://ajv.js.org/json-schema.html
    properties: {
        id:           { type: "number", minimum:1 }, 
        name:         { type: "string" }, 
        deleted:        { type: "boolean" },
        description:   { type: "string"}
    },
    required: ["id","name","deleted"],
    additionalProperties: false
};