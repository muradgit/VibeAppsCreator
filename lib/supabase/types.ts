export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          idea_raw: string
          idea_refined: string | null
          plan: Json | null
          tech_stack: Json | null
          constraints: Json | null
          status: string
          github_repo: string | null
          vercel_project_id: string | null
          github_token_encrypted: string | null
          vercel_token_encrypted: string | null
          created_at: string
          updated_at: string
        }
        Insert: { id?: string; user_id: string; name: string; idea_raw: string; [key: string]: any }
        Update: { [key: string]: any }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          sequence_number: number
          title: string
          description: string
          acceptance_criteria: string[]
          file_paths: string[]
          dependencies: string[] | null
          generated_prompt: string | null
          generated_code: Json | null
          review_result: Json | null
          status: string
          retry_count: number
          github_commit_sha: string | null
          created_at: string
          updated_at: string
        }
        Insert: { [key: string]: any }
        Update: { [key: string]: any }
      }
      conversations: {
        Row: { id: string; project_id: string; phase: string; role: string; content: string; created_at: string }
        Insert: { [key: string]: any }
        Update: { [key: string]: any }
      }
      task_comments: {
        Row: { id: string; task_id: string; user_question: string; ai_answer: string; created_at: string }
        Insert: { [key: string]: any }
        Update: { [key: string]: any }
      }
    }
  }
}
