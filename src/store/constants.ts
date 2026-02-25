import { Armor, Character, Skill, Stat, Weapon } from './types';

export const WEAPON_DAMAGE_OPTIONS = [1, 2, 3, 4, 5, 6, 8];
export const WEAPON_STAT_OPTIONS = ["DEX", "REF"];
export const WEAPON_SKILL_OPTIONS = ["Archery", "Handgun", "Shoulder Arms", "Autofire", "Heavy Weapons", "Brawling", "Martial Arts", "Melee Weapons"];
export const WEAPON_PENETRATION_OPTIONS = ["None", "Half"];
export const WEAPON_QUALITY_OPTIONS = ["Standard", "Excellent", "Poor"];
export const WEAPON_FIRERATE_OPTIONS = [1, 2];

export const ARMOR_TOTAL_OPTIONS = [7, 9, 11, 12, 13, 15, 18];
export const ARMOR_PENALTY = [0, 2, 4];

export const baselineStats: Record<string, Stat> = {
  INT: {
    name: "Intelligence",
    baseValue: 5,
  },
  DEX: {
    name: "Dexterity",
    baseValue: 5,
  },
  WILL: {
    name: "Willpower",
    baseValue: 5,
  },
  REF: {
    name: "Reflex",
    baseValue: 5,
  },
  COOL: {
    name: "Cool",
    baseValue: 5,
  },
  EMP: {
    name: "Empathy",
    baseValue: 5,
  },
  TECH: {
    name: "Tech",
    baseValue: 5,
  },
  BODY: {
    name: "Body",
    baseValue: 5,
  },
  MOVE: {
    name: "Movement",
    baseValue: 5,
  },
  LUCK: {
    name: "Luck",
    baseValue: 5,
  },
}

export const baselineSkills: Skill[] = [
  {
    name: "Concentration",
    stat: "WILL",
    description: "Skill of focus and mental control, encompassing feats of memory, recall, ignoring distractions, and physiological mastery.",
    price: 1,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Athletics",
    stat: "DEX",
    description: "Skill of jumping, climbing, throwing, swimming, lifting weights, etc.",
    price: 1,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Resist Torture/Drugs",
    stat: "WILL",
    description: "Skill of resisting painful effects including interrogation, torture, and drugs.",
    price: 1,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Brawling",
    stat: "DEX",
    description: "Skill at fighting and grappling with brute strength.",
    price: 1,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Evasion",
    stat: "DEX",
    description: "Skill for dodging attacks in melee combat. A Character with REF 8 or higher can also use this Skill to dodge Ranged Attacks.",
    price: 1,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Martial Arts",
    stat: "DEX",
    description: "Skill for fighting with a Martial Arts Form. Each time you increase this Skill you must choose in which form you are training. You can learn multiple forms, but you must do so separately.",
    price: 2,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Melee Weapons",
    stat: "DEX",
    description: "Skill for fighting with melee weapons.",
    price: 1,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Archery",
    stat: "REF",
    description: "Skill for accurately firing projectile weapons like bows.",
    price: 1,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Handgun",
    stat: "REF",
    description: "Skill for accurately firing handheld projectile weapons such as pistols.",
    price: 1,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Shoulder Arms",
    stat: "REF",
    description: "Skill for accurately firing rifles and shotguns.",
    price: 1,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Autofire",
    stat: "REF",
    description: "Skill for keeping a weapon's Autofire firing mode on target through recoil.",
    price: 2,
    baseValue: 0,
    minimalValue: 0,
  },
  {
    name: "Heavy Weapons",
    stat: "REF",
    description: "Skill for accurately firing extremely large projectile weapons, including grenade and rocket launchers.",
    price: 2,
    baseValue: 0,
    minimalValue: 0,
  },
];


export const baselineWeapons: Weapon[] = [
  {
    name: "Unarmed",
    damage: 1,
    stat: "DEX",
    skillName: "Brawling",
    penetration: "None",
    quality: "Standard",
    rateOfFire: 2,
  }
];

export const baselineArmor: Armor = {
  armorTotal: 11,
  armorCurrent: 11,
  penalty: 0
}

export const baselineCharacter: Character = {
  name: "",
  lifepath: {
    name: "",
    handle: "",
    culture: "",
    personality: "",
    motivation: "",
  },
  stats: baselineStats,
  skills: baselineSkills,
  weapons: baselineWeapons,
  armor: baselineArmor,
  hp: {total: 35, current: 35}
}