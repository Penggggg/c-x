export interface EntityInstance {
  entity_id: number,
  entity_name: string,
  description: string,
  entity_type: string,
  is_open: boolean,
  fuzzy_set: boolean,
  dictionary_list: Dictionary[],
  user_refer: number,
  version_refer: number,
  created_at: string,
  updated_at: string,
}

export interface Dictionary {
  value: string,
  data_type: string,
  synonyms: string[]
}