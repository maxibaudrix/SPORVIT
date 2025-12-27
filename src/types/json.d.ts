// src/types/json.d.ts

// Permite importar JSON files como módulos
declare module '*.json' {
  const value: any;
  export default value;
}

// Tipos específicos para los JSON del proyecto
declare module '@/../data/training_templates_es_normalized.json' {
  const plans: any[];
  export default plans;
}

declare module '@/../data/training_templates_es_4weeks_web.json' {
  const plans: any[];
  export default plans;
}

declare module '@/../data/exercise_catalog.json' {
  const exercises: any[];
  export default exercises;
}

declare module '@/../data/exercise_master.json' {
  const exercises: any[];
  export default exercises;
}