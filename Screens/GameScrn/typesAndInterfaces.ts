export const QUESTION_TYPES = ['propositional', 'predicate', 'diagrams'] as const;

export type TQuestionTypes = typeof QUESTION_TYPES[number]