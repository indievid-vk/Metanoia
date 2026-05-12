import { Passion, Sin, SinSeverity } from '../store';
import { ALL_SINS } from './sins/index';

export const PASSIONS: Passion[] = [
  'Чревоугодие',
  'Блуд',
  'Сребролюбие',
  'Гнев',
  'Печаль',
  'Уныние',
  'Тщеславие',
  'Гордость'
];

export const MOCK_SINS: Sin[] = ALL_SINS;

export interface Commandment {
  text: string;
  reference: string;
}

export const COMMANDMENTS: Commandment[] = [
  { text: "Блаженны нищие духом, ибо их есть Царство Небесное.", reference: "Мф. 5:3" },
  { text: "Блаженны плачущие, ибо они утешатся.", reference: "Мф. 5:4" },
  { text: "Блаженны кроткие, ибо они наследуют землю.", reference: "Мф. 5:5" },
  { text: "Блаженны алчущие и жаждущие правды, ибо они насытятся.", reference: "Мф. 5:6" },
  { text: "Блаженны милостивые, ибо они помилованы будут.", reference: "Мф. 5:7" },
  { text: "Блаженны чистые сердцем, ибо они Бога узрят.", reference: "Мф. 5:8" },
  { text: "Блаженны миротворцы, ибо они будут наречены сынами Божиими.", reference: "Мф. 5:9" }
];
