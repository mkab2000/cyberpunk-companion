"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { Character, Skill } from "@/store/types";
import { baselineCharacter } from "@/store/constants";
import CharacterDisplay from "./components/CharacterDisplay";
import MessagesDisplay from "./components/MessagesDisplay";
import InitiativeDisplay from "./components/InitiativeDisplay";
import GmDisplay from "./components/GmDisplay";
import { StyledButton } from "@/styled-components/styledButton";
import { RollAttackProps } from "./types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);



const GameRoom = () => {
  const { slug } = useParams();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [activeUsers, setActiveUsers] = useState<{ id: string; name: string}[]>([])
  
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMessages, setShowMessages] = useState(true);

  const [isGM, setIsGM] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [showGmPage, setShowGmPage] = useState(false);

  const [character, setCharacter] = useState<Character>(baselineCharacter);
  const [loadedCharacters, setLoadedCharacters] = useState<Character[]>([]);
  const [importCharacterIdState, setImportCharacterIdState] = useState<string>("");

  const [combatOrder, setCombatOrder] = useState<{
    id: string,
    initiative: number,
    name: string
  }[]>([]);
  
  const [attackLogs, setAttackLogs] = useState<{
    id: string,
    slug: string,
    characterId: string,
    characterName: string,
    damage: number,
    createdAt: string,
    penetration: string
  }[]>([]);
  
  useEffect(() => {
    if (!slug) return;
    const channel = supabase.channel(`room_${slug}`);
    const slugStr = Array.isArray(slug) ? slug[0] : slug;

    const fetchCombatOrder = async () => {
      const { data, error } = await supabase
          .from("game_rooms")
          .select("combat_order")
          .eq("slug", slug)
          .single();

      if (error) {
          console.error("Error fetching combat order:", error);
      } else {
          setCombatOrder(data.combat_order || []);
      }
    };

    fetchCombatOrder()  
    
    channel
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_rooms", filter: `slug=eq.${slug}` },
        (payload) => {
          if (payload.new.active_users) {
            setActiveUsers(payload.new.active_users);
          }
        }
      )
      .on("broadcast", { event: "new_message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      }) // Message subscription
      .on("broadcast", { event: "session_update" }, (payload) => {
        setSessionActive(payload.payload.sessionActive);
      }) // Whether Session is active or not
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_rooms",
          filter: `slug=eq.${slug}`,
        },
        async (payload) => {
          console.log("Game room updated:", payload);
          if(isGM)
            fetchLoadedCharacters(slugStr);
        }
      )  // Gm at all times has full access to all characters, and can store several of them at once
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "game_rooms",
        filter: `slug=eq.${slug}`,
      }, (payload) => {
        if (payload.new.combat_order) {
          setCombatOrder(payload.new.combat_order);
        }
      }) // Adjust Combat Order accordingly whenever a change occurs in it
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "attack_logs", filter: `slug=eq.${slug}` },
        (payload) => {
          // console.log("New attack log received:", payload.new);
          const newLog = {
            id: payload.new.id,
            slug: payload.new.slug,
            characterId: payload.new.character_id, 
            characterName: payload.new.character_name,
            damage: payload.new.damage,
            createdAt: payload.new.created_at,
            penetration: payload.new.penetration,
          };
      
          setAttackLogs((prev) => [...prev, newLog]); 
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "characters",
          filter: `id=in.(${loadedCharacters.map((char) => char.id).join(",")})`,
        },
        async (payload) => {
          // console.log("HP or Armor update received:", payload.new);
    
          setLoadedCharacters((prev) =>
            prev.map((char) =>
              char.id === payload.new.id
                ? {
                    ...char,
                    hp: { ...char.hp, current: payload.new.hp.current },
                    armor: { ...char.armor, armorCurrent: payload.new.armor.armorCurrent },
                  }
                : char
            )
          );
    
          if (character?.id === payload.new.id) {
            setCharacter((prev) =>
              prev
                ? {
                    ...prev,
                    hp: { ...prev.hp, current: payload.new.hp.current },
                    armor: { ...prev.armor, armorCurrent: payload.new.armor.armorCurrent },
                  }
                : prev
            );
          }
        }
      ) // Track HP and armor updates for all loaded characters
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug, isGM, character?.id, loadedCharacters]);

  useEffect(() => {
    let storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("user_id", storedUserId);
    }
    setUserId(storedUserId);
  
    const fetchAndJoinRoom = async () => {
      const { data, error } = await supabase
        .from("game_rooms")
        .select("gm_id, active_users")
        .eq("slug", slug)
        .single();
  
      console.log(error);
  
      if (!data || !data.gm_id) {
        // Create room if it doesn't exist
        await supabase.from("game_rooms").insert([{ slug, gm_id: storedUserId, active_users: [{ id: storedUserId, name: "Guest" }] }]);
        setIsGM(true);
      } else {

        setActiveUsers(data.active_users || []);
        // If room exists, add user to active_users
        const activeUsers = data.active_users || [];
        
        const isAlreadyAdded = activeUsers.some((user: {id: string, name: string}) => user.id === storedUserId);
  
        if (!isAlreadyAdded) {
          const updatedUsers = [...activeUsers, { id: storedUserId, name: "Guest" }];
          await supabase.from("game_rooms").update({ active_users: updatedUsers }).eq("slug", slug);
        }
      }
    };
  
    fetchAndJoinRoom();
  }, [slug]);

  const updateUserInRoom = async () => {
    if (!username.trim()) return; // Prevent empty names
  
    const { data, error } = await supabase
      .from("game_rooms")
      .select("active_users")
      .eq("slug", slug)
      .single();
  
    if (error || !data) {
      console.error("Error fetching active users:", error);
      return;
    }
  
    // Get the current active users
    const activeUsers = data.active_users || [];
  
    // Update the specific user's name
    const updatedUsers = activeUsers.map((user: {id: string, name: string}) =>
      user.id === userId ? { ...user, name: username } : user
    );
  
    // Push the update to the database
    const { error: updateError } = await supabase
      .from("game_rooms")
      .update({ active_users: updatedUsers })
      .eq("slug", slug);
  
    if (updateError) {
      console.error("Error updating user name:", updateError);
    }
  };

  useEffect(() => {
    const checkGM = async () => {
      const { data } = await supabase
        .from("game_rooms")
        .select("gm_id")
        .eq("slug", slug)
        .single();
  
      if (data?.gm_id === localStorage.getItem("user_id")) {
        setIsGM(true);
      }
    };
  
    checkGM();
  }, [isGM, slug]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("slug", slug)
        .order("created_at", { ascending: true });
  
      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }
  
      setMessages(data || []);
    };
  
    fetchMessages();
  }, [slug]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
  
    const message = {
      id: uuidv4(),
      slug,
      text: `${username || "Guest"}: ${newMessage}`,
    };
    setNewMessage("");
  
    // Save to database
    const { error } = await supabase.from("messages").insert([message]);
  
    if (error) {
      console.error("Error sending message:", error);
      return;
    }
  
    // Broadcast message in real-time
    await supabase.channel(`room_${slug}`).send({
      type: "broadcast",
      event: "new_message",
      payload: message,
    });
  };

  useEffect(() => {
    const fetchSessionStatus = async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from("game_rooms")
        .select("session_active")
        .eq("slug", slug)
        .single();
  
      if (error) {
        console.error("Error fetching session status:", error);
        return;
      }
  
      setSessionActive(data?.session_active || false);
    };
  
    fetchSessionStatus();
  }, [slug]);
  
  const toggleSession = async () => {
    if (!isGM) return;
  
    const newStatus = !sessionActive;
  
    const { error } = await supabase
      .from("game_rooms")
      .update({ session_active: newStatus })
      .eq("slug", slug);
  
    if (error) {
      console.error("Error updating session status:", error);
      return;
    }
  
    setSessionActive(newStatus);
  
    // Notify all players about session change
    await supabase.channel(`room_${slug}`).send({
      type: "broadcast",
      event: "session_update",
      payload: { sessionActive: newStatus },
    });
  };

  // Dice Rolls
  const rollDice = (sides: number, amount: number): number[] => {
    const rolls = Array.from({ length: amount }, () => Math.floor(Math.random() * sides) + 1);
    return rolls;
  };

  const sendRoll = async (text: string) => {
    const message = {
      id: uuidv4(),
      slug,
      text: text,
    };

    const { error } = await supabase.from("messages").insert([message]);
  
    if (error) {
      console.error("Error sending message:", error);
      return 0;
    }
  
    supabase.channel(`room_${slug}`).send({
      type: "broadcast",
      event: "new_message",
      payload: message,
    });
  }

  const rollAbility = async (characterName: string, skill: Skill, statValue: number) => {
    const priorMessage = `${characterName} makes ${skill.name}(Level: ${skill.baseValue} + ${skill.stat}) ability check: ${skill.baseValue} + ${statValue}`;
    const total = rollDice(10, 1);
    await sendRoll(`${priorMessage} + ${total} = ${(skill.baseValue + statValue) + total[0]}`)
  };

  const rollAttack = async (props: RollAttackProps) => {
    const {characterId, characterName, weapon, skillValue, statValue} = props

    const abilityRoll = rollDice(10, 1);
    const abilityMessage = `${characterName} makes an attack using ${weapon.name}: ${skillValue} + ${statValue} + ${abilityRoll} = ${skillValue + statValue + abilityRoll[0]}`;
    await sendRoll(abilityMessage)

    const damageRoll = rollDice(6, weapon.damage);
    const damageMessage = `Total Damage: ${damageRoll.join(" + ")} = ${damageRoll.reduce((acc, curr) => acc + curr, 0)}`;
    await sendRoll(damageMessage)

    const { error } = await supabase
      .from("attack_logs")
      .insert([{
        slug,
        character_id: characterId,
        character_name: characterName,
        damage: damageRoll.reduce((acc, curr) => acc + curr, 0),
        penetration: weapon.penetration
      }]);

    if (error) {
        console.error("Error logging attack:", error);
    }
  }
  
  // Importing Characters from db.
  const onClickImportCharacter = async () => {

    const importCharacter = async (id: string) => {
      if (!id) return;
    
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", id)
        .single();
    
      if (error) {
        console.error("Error fetching character:", error);
        return;
      }
    
      await setCharacter(data);
  
      const { data: roomData, error: roomError } = await supabase
        .from("game_rooms")
        .select("loaded_characters")
        .eq("slug", slug)
        .single();
  
      if (roomError) {
        console.error("Error fetching game room:", roomError);
        return;
      }
  
      const currentCharacters = roomData.loaded_characters || [];
  
      // Only add the character ID if it's not already in the list
      if (!currentCharacters.includes(id)) {
        const updatedCharacters = [...currentCharacters, id];
  
        const { error: updateError } = await supabase
          .from("game_rooms")
          .update({ loaded_characters: updatedCharacters })
          .eq("slug", slug);
  
        if (updateError) {
          console.error("Error updating loaded characters:", updateError);
        }
      }
    };

    await importCharacter(importCharacterIdState);
  };

  // Fetches on Page Load and Subscription
  const fetchLoadedCharacters = async (slug: string) => {
    if (!slug) return;

    // Fetch the loaded character IDs from the game room
    const { data: roomData, error: roomError } = await supabase
      .from("game_rooms")
      .select("loaded_characters")
      .eq("slug", slug)
      .single();

    if (roomError) {
        console.error("Error fetching game room:", roomError);
        return [];
    }

    const characterIds = roomData?.loaded_characters || [];
    if (characterIds.length === 0) return [];

    // Fetch character details using the retrieved IDs
    const { data: charactersData, error: characterError } = await supabase
      .from("characters")
      .select("*")
      .in("id", characterIds);

    if (characterError) {
        console.error("Error fetching characters:", characterError);
        return [];
    }
    setLoadedCharacters(charactersData);
  };
  
  useEffect(() => {
    if (!slug) return;
    const slugStr = Array.isArray(slug) ? slug[0] : slug;

    if (slug && isGM) {
      fetchLoadedCharacters(slugStr); 
    }
    
  }, [slug, isGM]); 
  
  // Combat Order 
  const updateCombatOrder = async (newOrder: {name: string, id: string, initiative: number}[]) => {
    const { error } = await supabase
        .from("game_rooms")
        .update({ combat_order: newOrder })
        .eq("slug", slug);

    if (error) {
        console.error("Error updating combat order:", error);
    }
  };
  
  const nextTurn = () => {
    if (combatOrder.length > 1) {
      const newOrder = [...combatOrder.slice(1), combatOrder[0]];
      updateCombatOrder(newOrder);
    }
  };

  const prevTurn = () => {
    if (combatOrder.length > 1) {
      const newOrder = [combatOrder[combatOrder.length - 1], ...combatOrder.slice(0, -1)];
      updateCombatOrder(newOrder);
    }
  };

  async function addCombatant(id: string, name: string, initiative: number) {
    const { error } = await supabase
    .from("combatants")
    .upsert(
      [{ id, name, initiative, slug,}],
      { onConflict: "id" } 
    );

    if (error) {
      console.error("Error upserting combatant:", error);
    }

    // Fetch all combatants for this slug
    const { data: combatants, error: fetchError } = await supabase
        .from("combatants")
        .select("id, name, initiative")
        .eq("slug", slug)
        .order("initiative", { ascending: false }); 

    if (fetchError) {
        console.error("Error fetching combatants:", fetchError);
        return;
    }

    // Update combat_order with the fetched combatants
    await updateCombatOrder(combatants);
  }

  useEffect(() => {
    const fetchAttackLogs = async () => {
      if (!slug) return;
    
      const { data, error } = await supabase
        .from("attack_logs")
        .select("*")
        .eq("slug", slug)
        .order("created_at", { ascending: true });
    
      if (error) {
        console.error("Error fetching attack logs:", error);
        return;
      }
    
      const formattedData = data.map(({ id, slug, character_id, character_name, damage, created_at, penetration }) => ({
        id,
        slug,
        characterId: character_id,
        characterName: character_name, 
        damage,
        createdAt: created_at,
        penetration,
      }));
    
      setAttackLogs(formattedData);
    };

    fetchAttackLogs();
  }, [slug]);
  
  return (
    <StyledWrapper>
      <StyledGameContainer>
        {isGM && (
          <StyledHotbar>
            <StyledButton onClick={toggleSession}>
              {sessionActive ? "End Session" : "Start Session"}
            </StyledButton>
            <StyledButton onClick={() => {setShowGmPage(!showGmPage);}}>{showGmPage ? "Player tools" : "GM tools"}</StyledButton>
          </StyledHotbar>
        )}

        {showGmPage &&
          <GmDisplay
          addCombatant={addCombatant}
          sendRoll={sendRoll}
          rollDice={rollDice}
          rollAbility={rollAbility}
          rollAttack={rollAttack}
          attackLogs={attackLogs}
          sessionActive
          loadedCharacters={loadedCharacters} />
        }
        
        {!showGmPage &&
          <>
            <StyledHotbar>
            <h1>Game Room: {slug}</h1>
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <StyledButton onClick={updateUserInRoom}>Set</StyledButton>
            </div>
            <h2>Session Status: {sessionActive ? "Active" : "Inactive"}</h2>

            <div>
              <StyledImportCharacterInput value={importCharacterIdState} onChange={(e) => { setImportCharacterIdState(e.target.value) }} />
              <StyledButton onClick={onClickImportCharacter}>Import Character</StyledButton>
            </div>
          </StyledHotbar>
          
          {character.id && (
            <CharacterDisplay
              sessionActive={sessionActive}
              character={character}
              rollAbility={rollAbility}
              rollAttack={rollAttack}
              sendRoll={sendRoll}
              rollDice={rollDice}
              addCombatant={addCombatant}
            />
          )}
        </>}
      </StyledGameContainer>

      <StyledMessagesOrInitiativeContainer>

        <ToggleMessageOrInitiative>
          <MessageCombatToggleButton disabled={showMessages} onClick={() => {setShowMessages(true)}}>Messages</MessageCombatToggleButton>
          <MessageCombatToggleButton disabled={!showMessages} onClick={() => {setShowMessages(false)}}>Combat</MessageCombatToggleButton>
        </ToggleMessageOrInitiative>

        {!showMessages && <InitiativeDisplay
          combatOrder={combatOrder}
          isGM={isGM}
          characterId={character.id || ""}
          nextTurn={nextTurn}
          prevTurn={prevTurn}
        />}
        {showMessages && <MessagesDisplay
          messages={messages}
          newMessage={newMessage}
          activeUsers={activeUsers}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
        />}
        
      </StyledMessagesOrInitiativeContainer>

    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
width: 100vw;
height: 100vh;
display: flex;
flex-direction: row;
justify-content: space-between;
background-color: #21252d;
`;

const StyledGameContainer = styled.div`
/* width: 100%; */
flex-grow: 1;
height: 100%;
overflow: scroll;

scrollbar-width: none; /* Firefox */
-ms-overflow-style: none; /* IE and Edge */

&::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}
`;


const StyledHotbar = styled.div`
width: 100%;
display: flex;
flex-direction: row;
background-color: #1f1f1f;
justify-content: space-between;
align-items: center;
color: white;
height: 46px;
padding: 0 12px;
`;

const StyledImportCharacterInput = styled.input`
background: white;
color: black;
margin-right: 12px;
`;

const ToggleMessageOrInitiative = styled.div`
width: 100%;
background-color: #1f1f1f;
border-bottom: 2px solid #3e3e3f;
border-left: 2px solid #3e3e3f;
line-height: 44px;
font-size: 18px;
color: white;

display: flex;
flex-direction: row;
justify-content: space-around;
`;

const StyledMessagesOrInitiativeContainer = styled.div`
display: flex;
flex-direction: column;
`;


const MessageCombatToggleButton = styled.button`
  flex-grow: 1;
  background-color: #21252d;
  &:disabled {
    filter: brightness(0.57);
  }
`

export default GameRoom;
