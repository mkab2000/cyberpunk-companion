import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { Character, RoomUser, Skill } from "@/store/types";
import { baselineCharacter } from "@/store/constants";
import { RollAttackProps } from "./types";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useSlug = () => {
  const { slug } = useParams();
  const slugStr = Array.isArray(slug) ? slug[0] : slug;

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [activeUsers, setActiveUsers] = useState<{ id: string; name: string }[]>([]);
  
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMessages, setShowMessages] = useState(true);

  const [isGM, setIsGM] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [showGmPage, setShowGmPage] = useState(false);

  const [character, setCharacter] = useState<Character>(baselineCharacter);
  const [loadedCharacters, setLoadedCharacters] = useState<Character[]>([]);
  const [importCharacterIdState, setImportCharacterIdState] = useState<string>("");

  const [combatOrder, setCombatOrder] = useState<{ id: string; initiative: number; name: string }[]>([]);
  
  const [attackLogs, setAttackLogs] = useState<{
    id: string; slug: string; characterId: string; characterName: string; 
    damage: number; createdAt: string; penetration: string
  }[]>([]);

  // --- Realtime Subscriptions ---
  useEffect(() => {
    if (!slugStr) return;
    const channel = supabase.channel(`room_${slugStr}`);

    const fetchCombatOrder = async () => {
      const { data, error } = await supabase.from("game_rooms").select("combat_order").eq("slug", slugStr).single();
      if (!error) setCombatOrder(data.combat_order || []);
    };
    fetchCombatOrder();  
    
    channel
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "game_rooms", filter: `slug=eq.${slugStr}` }, async (payload) => {
        if (payload.new.active_users) setActiveUsers(payload.new.active_users);
        if (isGM) fetchLoadedCharacters(slugStr);
        if (payload.new.combat_order) setCombatOrder([...payload.new.combat_order]);
      })
      .on("broadcast", { event: "new_message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .on("broadcast", { event: "session_update" }, (payload) => {
        setSessionActive(payload.payload.sessionActive);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "attack_logs", filter: `slug=eq.${slugStr}` }, (payload) => {
        const newLog = {
          id: payload.new.id, slug: payload.new.slug, characterId: payload.new.character_id, 
          characterName: payload.new.character_name, damage: payload.new.damage, 
          createdAt: payload.new.created_at, penetration: payload.new.penetration,
        };
        setAttackLogs((prev) => [...prev, newLog]); 
      })
      .on("postgres_changes", {
          event: "UPDATE", schema: "public", table: "characters",
          filter: `id=in.(${loadedCharacters.map((char) => char.id).join(",")})`,
        },
        async (payload) => {
          setLoadedCharacters((prev) =>
            prev.map((char) => char.id === payload.new.id ? {
                  ...char,
                  hp: { ...char.hp, current: payload.new.hp.current },
                  armor: { ...char.armor, armorCurrent: payload.new.armor.armorCurrent },
                } : char )
          );
          if (character?.id === payload.new.id) {
            setCharacter((prev) => prev ? {
                  ...prev,
                  hp: { ...prev.hp, current: payload.new.hp.current },
                  armor: { ...prev.armor, armorCurrent: payload.new.armor.armorCurrent },
                } : prev );
          }
        }
      ).subscribe();
  
    return () => { supabase.removeChannel(channel); };
  }, [slugStr, isGM, character?.id, loadedCharacters]);

  // --- Initializers & Fetchers ---
  useEffect(() => {
    let storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("user_id", storedUserId);
    }
    setUserId(storedUserId);
  
    const fetchAndJoinRoom = async () => {
      const { data } = await supabase.from("game_rooms").select("gm_id, active_users").eq("slug", slugStr).single();
  
      if (!data || !data.gm_id) {
        await supabase.from("game_rooms").insert([{ slug: slugStr, gm_id: storedUserId, active_users: [{ id: storedUserId, name: "Guest" }] }]);
        setIsGM(true);
      } else {
        setActiveUsers(data.active_users || []);
        const activeUsers = data.active_users || [];
        const isAlreadyAdded = activeUsers.some((user: {id: string, name: string}) => user.id === storedUserId);
  
        if (!isAlreadyAdded) {
          const updatedUsers = [...activeUsers, { id: storedUserId, name: "Guest" }];
          await supabase.from("game_rooms").update({ active_users: updatedUsers }).eq("slug", slugStr);
        }
      }
    };
    fetchAndJoinRoom();
  }, [slugStr]);

  useEffect(() => {
    const checkGM = async () => {
      const { data } = await supabase.from("game_rooms").select("gm_id").eq("slug", slugStr).single();
      if (data?.gm_id === localStorage.getItem("user_id")) setIsGM(true);
    };
    checkGM();
  }, [slugStr]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from("messages").select("*").eq("slug", slugStr).order("created_at", { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();
  }, [slugStr]);

  useEffect(() => {
    const fetchSessionStatus = async () => {
      if (!slugStr) return;
      const { data } = await supabase.from("game_rooms").select("session_active").eq("slug", slugStr).single();
      setSessionActive(data?.session_active || false);
    };
    fetchSessionStatus();
  }, [slugStr]);

  useEffect(() => {
    if (slugStr && isGM) fetchLoadedCharacters(slugStr); 
  }, [slugStr, isGM]); 

  useEffect(() => {
    const fetchAttackLogs = async () => {
      if (!slugStr) return;
      const { data } = await supabase.from("attack_logs").select("*").eq("slug", slugStr).order("created_at", { ascending: true });
      if (data) {
        setAttackLogs(data.map(log => ({
            id: log.id, slug: log.slug, characterId: log.character_id, characterName: log.character_name, 
            damage: log.damage, createdAt: log.created_at, penetration: log.penetration,
        })));
      }
    };
    fetchAttackLogs();
  }, [slugStr]);

  // --- Actions ---
  const updateUserInRoom = async () => {
    if (!username.trim()) return; 
  
    const { data } = await supabase
      .from("game_rooms")
      .select("active_users")
      .eq("slug", slugStr)
      .single();
  
    if (!data) return;
  
    // Replace 'any' with 'RoomUser'
    const updatedUsers = (data.active_users || []).map((user: RoomUser) => 
      user.id === userId ? { ...user, name: username } : user
    );
  
    await supabase
      .from("game_rooms")
      .update({ active_users: updatedUsers })
      .eq("slug", slugStr);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    const message = { id: uuidv4(), slug: slugStr, text: `${username || "Guest"}: ${newMessage}` };
    setNewMessage("");
    await supabase.from("messages").insert([message]);
    await supabase.channel(`room_${slugStr}`).send({ type: "broadcast", event: "new_message", payload: message });
  };

  const toggleSession = async () => {
    if (!isGM) return;
    const newStatus = !sessionActive;
    await supabase.from("game_rooms").update({ session_active: newStatus }).eq("slug", slugStr);
    setSessionActive(newStatus);
    await supabase.channel(`room_${slugStr}`).send({ type: "broadcast", event: "session_update", payload: { sessionActive: newStatus } });
  };

  const rollDice = (sides: number, amount: number): number[] => {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * sides) + 1);
  };

  const sendRoll = async (text: string) => {
    const message = { id: uuidv4(), slug: slugStr, text };
    await supabase.from("messages").insert([message]);
    supabase.channel(`room_${slugStr}`).send({ type: "broadcast", event: "new_message", payload: message });
  };

  const rollAbility = async (characterName: string, skill: Skill, statValue: number) => {
    const priorMessage = `${characterName} makes ${skill.name}(Level: ${skill.baseValue} + ${skill.stat}) ability check: ${skill.baseValue} + ${statValue}`;
    const total = rollDice(10, 1);
    await sendRoll(`${priorMessage} + ${total} = ${(skill.baseValue + statValue) + total[0]}`);
  };

  const rollAttack = async (props: RollAttackProps) => {
    const {characterId, characterName, weapon, skillValue, statValue} = props;
    const abilityRoll = rollDice(10, 1);
    await sendRoll(`${characterName} makes an attack using ${weapon.name}: ${skillValue} + ${statValue} + ${abilityRoll} = ${skillValue + statValue + abilityRoll[0]}`);
    
    const damageRoll = rollDice(6, weapon.damage);
    const damageTotal = damageRoll.reduce((acc, curr) => acc + curr, 0);
    await sendRoll(`Total Damage: ${damageRoll.join(" + ")} = ${damageTotal}`);

    await supabase.from("attack_logs").insert([{
      slug: slugStr, character_id: characterId, character_name: characterName, damage: damageTotal, penetration: weapon.penetration
    }]);
  };

  const fetchLoadedCharacters = async (slug: string) => {
    const { data: roomData } = await supabase.from("game_rooms").select("loaded_characters").eq("slug", slug).single();
    const characterIds = roomData?.loaded_characters || [];
    if (characterIds.length === 0) return [];
    const { data: charactersData } = await supabase.from("characters").select("*").in("id", characterIds);
    if (charactersData) setLoadedCharacters(charactersData);
  };

  const onClickImportCharacter = async () => {
    if (!importCharacterIdState) return;
    const { data } = await supabase.from("characters").select("*").eq("id", importCharacterIdState).single();
    if (data) setCharacter(data);

    const { data: roomData } = await supabase.from("game_rooms").select("loaded_characters").eq("slug", slugStr).single();
    const currentCharacters = roomData?.loaded_characters || [];
    
    if (!currentCharacters.includes(importCharacterIdState)) {
      await supabase.from("game_rooms").update({ loaded_characters: [...currentCharacters, importCharacterIdState] }).eq("slug", slugStr);
    }
  };

  const updateCombatOrder = async (newOrder: {name: string, id: string, initiative: number}[]) => {
    await supabase.from("game_rooms").update({ combat_order: newOrder }).eq("slug", slugStr);
  };

  const nextTurn = () => {
    if (combatOrder.length > 1) updateCombatOrder([...combatOrder.slice(1), combatOrder[0]]);
  };

  const prevTurn = () => {
    if (combatOrder.length > 1) updateCombatOrder([combatOrder[combatOrder.length - 1], ...combatOrder.slice(0, -1)]);
  };

  const addCombatant = async (id: string, name: string, initiative: number) => {
    await supabase.from("combatants").upsert([{ id, name, initiative, slug: slugStr }], { onConflict: "id" });
    const { data: combatants } = await supabase.from("combatants").select("id, name, initiative").eq("slug", slugStr).order("initiative", { ascending: false });
    if (combatants) await updateCombatOrder(combatants);
  };

  return {
    slug: slugStr,
    // State
    username, setUsername, activeUsers, messages, newMessage, setNewMessage, showMessages, setShowMessages,
    isGM, sessionActive, showGmPage, setShowGmPage, character, loadedCharacters,
    importCharacterIdState, setImportCharacterIdState, combatOrder, attackLogs,
    // Actions
    updateUserInRoom, sendMessage, toggleSession, rollDice, sendRoll, rollAbility, rollAttack,
    onClickImportCharacter, nextTurn, prevTurn, addCombatant
  };
};