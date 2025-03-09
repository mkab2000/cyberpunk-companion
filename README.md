This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

The deployment server is launched with

```bash
npm run dev
```

Vercel Links:
https://vercel.com/mkab2000s-projects/mkab-cyberpunk-companion/2BVd6YKZJmsjPj8zYRNqms314wzk
https://mkab-cyberpunk-companion.vercel.app

Supabase database and tables exported: 
https://drive.google.com/file/d/1tNXRdhuWhAiFp3JmNKjChKSTKgtFr_Zk/view?usp=sharing

[
  {
    "table_name": "attack_logs",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "attack_logs",
    "column_name": "slug",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "attack_logs",
    "column_name": "character_id",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "attack_logs",
    "column_name": "character_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "attack_logs",
    "column_name": "damage",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "attack_logs",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_name": "attack_logs",
    "column_name": "penetration",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "characters",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "characters",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "characters",
    "column_name": "stats",
    "data_type": "jsonb",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "characters",
    "column_name": "skills",
    "data_type": "jsonb",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "characters",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_name": "characters",
    "column_name": "weapons",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "characters",
    "column_name": "armor",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "characters",
    "column_name": "hp",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "combatants",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "combatants",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "combatants",
    "column_name": "initiative",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "table_name": "combatants",
    "column_name": "slug",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "game_rooms",
    "column_name": "slug",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "game_rooms",
    "column_name": "gm_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_name": "game_rooms",
    "column_name": "combat_order",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'[]'::jsonb"
  },
  {
    "table_name": "game_rooms",
    "column_name": "session_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_name": "game_rooms",
    "column_name": "loaded_characters",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'[]'::jsonb"
  },
  {
    "table_name": "game_rooms",
    "column_name": "active_users",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'[]'::jsonb"
  },
  {
    "table_name": "game_rooms",
    "column_name": "expires_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": "(now() + '24:00:00'::interval)"
  },
  {
    "table_name": "messages",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_name": "messages",
    "column_name": "slug",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "messages",
    "column_name": "text",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_name": "messages",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  }
]