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

export interface Character {
  id?: string;
  name: string;
  stats: Record<string, Stat>;
  skills: Skill[];
  weapons: Weapon[];
  armor: Armor;
  hp: Record<string, number>;
}

export interface Weapon {
  name: string;
  damage: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  stat: "DEX" | "REF";  
  skillName: "Archery" | "Handgun" | "Shoulder Arms" | "Autofire" | "Heavy Weapons" | "Brawling" | "Martial Arts" | "Melee Weapons";
  penetration: "None" | "Half";
  excellentQuality: boolean;
  rateOfFire: 1 | 2;
}

export interface Armor {
  armorTotal: number;
  armorCurrent: number;
  penalty: number;
}