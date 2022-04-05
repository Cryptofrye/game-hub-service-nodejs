import { findAssetById } from "src/common/constants/asset";
import { findGameById } from "src/common/constants/game";
import { fundGameHubUserById } from "src/common/constants/game-hub-user";
import { findGameLoungeBySate } from "src/common/constants/game-lounge-state";
import { findGameLoungeTypeId } from "src/common/constants/game-lounge-type";
import { GameLoungeUserDto } from "../dtos/game-lounge-user.dto";
import { GameLoungeDto } from "../dtos/game-lounge.dto";
import { GameLoungeUserEntity } from "../entities/game-lounge-user.entity";
import { GameLoungeEntity } from "../entities/game-lounge.entity";

export class GLDtoMapper {

    public static toGameLoungeUserDto(glUserEntity:GameLoungeUserEntity): GameLoungeUserDto {
        let dto: GameLoungeUserDto = {
            uid : glUserEntity.uid,
            gameLoungeId: glUserEntity.gameLoungeId,
            user: fundGameHubUserById(glUserEntity.userId)
        }

        return dto;
    }

    public static toGameLoungeUserDtos(glUserEntities:GameLoungeUserEntity[]): GameLoungeUserDto[] {
        
        let dtos: GameLoungeUserDto[] = new Array<GameLoungeUserDto>()
        for (let index = 0; index < glUserEntities.length; index++) {
            let glu:GameLoungeUserEntity = glUserEntities[index];
            dtos.push(this.toGameLoungeUserDto(glu));
        }
        return dtos;
    }
    
    public static toGameLoungeDto(gl:GameLoungeEntity):GameLoungeDto {

        let glDto: GameLoungeDto = {
            uid: gl.uid,
            asset: findAssetById(gl.assetId),
            state: findGameLoungeBySate(gl.state)!,
            type: findGameLoungeTypeId(gl.type)!,
            deleted:gl.deleted,
            duration:gl.duration,
            fee: gl.fee,
            game: findGameById(gl.gameId),
            prize: gl.prize,
            rules: gl.rules,
            createdAt: gl.createdAt,
            updatedAt: gl.updatedAt
          }
          return glDto;
    }

    public static toGameLoungeDtos(gls:GameLoungeEntity[]) {
        
        let glDtos: GameLoungeDto[] = new Array();
        for (let index = 0; index < gls.length; index++) {
            let gl:GameLoungeEntity = gls[index];
            glDtos.push(GLDtoMapper.toGameLoungeDto(gl));
        }
        return glDtos;
    }
}