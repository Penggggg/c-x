export interface IntentsInstance {
  intention_id: number,
  intention_name: string,
  description: string,
  priority: number,
  skill_refer: number,
  dialog: Dialog[],
  created_at?: string,
  updated_at?: string,
  slots: Slots[]
}

export interface Dialog {
  query: string,
  answer: string,
  similar_query: string[]
}

export interface Slots {
  slot_name: string,
  entity_id: number,
  slot_alias: string,
}

export interface SkillInstance {
  skill_id: number,
  version_refer: number,
  skill_name: string
}