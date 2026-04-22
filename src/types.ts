export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';
