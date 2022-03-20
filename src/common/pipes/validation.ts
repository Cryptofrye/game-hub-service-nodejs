import Ajv from "ajv";
import Ajv2019 from "ajv/dist/2019"
import { gameLoungeCreateValidationSchema } from "src/game-lounge/dtos/game-lounge-create.dto.schema";
import { gameLoungeUpdateValidationSchema } from "src/game-lounge/dtos/game-lounge-update.dto.schema";

export const ajv = new Ajv2019();

export const VALIDATION_SCHEMA_GAME_LOUNGE_CREATE = "validation.schema.game.lounge.create";
export const VALIDATION_SCHEMA_GAME_LOUNGE_UPDATE = "validation.schema.game.lounge.update";

ajv.addSchema(gameLoungeCreateValidationSchema, VALIDATION_SCHEMA_GAME_LOUNGE_CREATE);
ajv.addSchema(gameLoungeUpdateValidationSchema, VALIDATION_SCHEMA_GAME_LOUNGE_UPDATE);


