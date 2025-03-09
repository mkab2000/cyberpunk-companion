import { Weapon } from "@/store/types";

export interface RollAttackProps {
  characterId: string,
  characterName: string,
  weapon: Weapon,
  skillValue: number,
  statValue: number
}