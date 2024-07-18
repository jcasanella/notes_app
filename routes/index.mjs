import { default as express } from 'express';
import { notesStore } from '../app.mjs';
import util from 'util';

export const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const keyList = await notesStore.keyList();
    console.log(`keyList ${util.inspect(keyList)}`);

    const keyPromises = keyList.map(k => notesStore.read(k));
    const noteList = await Promise.all(keyPromises);
    console.log(util.inspect(noteList));

    res.render('index', { title: 'Notes', noteList });
  } catch(err) {
    next(err);
  }
});
