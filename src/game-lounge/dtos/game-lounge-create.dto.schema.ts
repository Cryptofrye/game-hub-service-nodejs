import {JSONSchemaType} from "ajv";
import {GameLoungeCreateDto} from "./game-lounge-create.dto";

export const gameLoungeCreateValidationSchema:JSONSchemaType<GameLoungeCreateDto> = {
    
    type: 'object', 
    // Type can be: number, integer, string, boolean, array, object or null. see https://ajv.js.org/json-schema.html
    properties: {
        type:         { type: "number", minimum:1, maximum: 2 }, 
        state:        { type: "number", minimum:1, maximum: 5 },
        gameId:       { type: "number"},
        assetId:      { type: "number", minimum:1, maximum: 3},
        rules:        { type: "string"},
        fee:          { type: "number", minimum: 0.0000001},
        prize:        { type: "number"},
        duration:     { type: "number", minimum:1}
    },
    required: ["type", "state", "gameId", "assetId", "rules", "fee", "prize", "duration"],
    additionalProperties: false
};