import {JSONSchemaType} from "ajv";
import { DemoCreateDto } from "./demo.create.dto";

export const demoCreateValidationSchema:JSONSchemaType<DemoCreateDto> = {
    
    type: 'object', 
    // Type can be: number, integer, string, boolean, array, object or null. see https://ajv.js.org/json-schema.html
    properties: {
        name:         { type: "string" }, 
        description:  { type: "string" }
    },
    required: ["name"],
    additionalProperties: false
};