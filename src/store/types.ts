import { 
  WEAPON_DAMAGE_OPTIONS, 
  WEAPON_STAT_OPTIONS, 
  WEAPON_PENETRATION_OPTIONS,
  WEAPON_QUALITY_OPTIONS,
  WEAPON_SKILL_OPTIONS,
  WEAPON_FIRERATE_OPTIONS 
} from "@/store/constants";

export enum PageTypes {
  Home = 'Home',
  CharacterCreate = 'CharacterCreate',
  CharacterEdit = 'CharacterEdit',
  CharacterDisplay = 'CharacterDisplay',
}

export interface DisplayedPage {
  type: PageTypes;
}

export interface Skill {
  name: string;
  stat: "INT" | "DEX" | "WILL" | "REF" | "COOL" | "EMP" | "TECH" | "BODY" | "MOVE" | "LUCK";  
  description: string;
  price: number;
  baseValue: number;
  minimalValue: number;
  modifier?: number;
}

export interface Stat {
  name: string;
  baseValue: number;
  modifier?: number;
}

export interface RoleAbility {
  name: string;
  description: string;
  rank: number;
}

export interface LifePath {
  name: string;
  handle: string;
  culture: string;
  personality: string;
  motivation: string;
}

export interface Character {
  id?: string;
  name: string;
  lifepath: LifePath;
  stats: Record<string, Stat>;
  skills: Skill[];
  weapons: Weapon[];
  armor: Armor;
  hp: Record<string, number>;
}

export interface Weapon {
  name: string;
  damage: typeof WEAPON_DAMAGE_OPTIONS[number];
  stat: typeof WEAPON_STAT_OPTIONS[number];  
  skillName: typeof WEAPON_SKILL_OPTIONS[number];
  penetration: typeof WEAPON_PENETRATION_OPTIONS[number];
  quality: typeof WEAPON_QUALITY_OPTIONS[number];
  rateOfFire: typeof WEAPON_FIRERATE_OPTIONS[number];
}

export interface Armor {
  armorTotal: number;
  armorCurrent: number;
  penalty: number;
}

export interface RoomUser {
  id: string; 
  name: string;
}