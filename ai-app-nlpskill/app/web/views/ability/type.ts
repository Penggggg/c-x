// export interface AbilityInstance {
//   algorithmn_id: number,
//   nlp_ability_name: string,
//   description: string,
//   public: boolean,
//   user_refer: number,
//   state: number,
//   created_at: string,
//   updated_at: string,
// }

export interface AbilityInstance {
  algorithmn_id: number,
  algorithmn_name: string,
  public: boolean,
  scene_id: number,
  scene_name?: string,
  create_time: string,
  update_time: string,
  description: string,
}
