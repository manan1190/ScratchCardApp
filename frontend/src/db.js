import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';

const db = new Dexie('ScratchCardDB');
db.version(1).stores({
  cards: 'id,amount,createdAt'
});

export { db, uuidv4 };