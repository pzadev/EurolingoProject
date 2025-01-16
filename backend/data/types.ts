export type Language = {
  rank: number;
  targetWord: string;
  englishWord: string;
};

export type Progress = {
  [key: string]: boolean;
};

export type User = {
  username: string;
  realName: string;
  password: string;
  progress: Progress[];
};
