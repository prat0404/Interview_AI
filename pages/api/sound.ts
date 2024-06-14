import { NextApiRequest, NextApiResponse } from 'next';
import playsound from 'play-sound';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const player = playsound();
  player.play('public/microphonestart.wav', (err: any) => {
    if (err) {
      res.status(500).json({ error: 'Failed to play sound' });
    } else {
      res.status(200).json({ message: 'Sound played successfully' });
    }
  });
}