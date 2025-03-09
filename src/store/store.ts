"use client"; 

import { atom } from "jotai";

import { PageTypes, DisplayedPage, Character } from './types';
import { baselineCharacter } from './constants';
import { atomWithReset } from "jotai/utils";

export const displayedPage = atom<DisplayedPage>({
  type: PageTypes.Home,
});

export const storedCharacterData = atomWithReset<Character>(
  baselineCharacter
);

export const storedCharacterId = atom<string>("");
