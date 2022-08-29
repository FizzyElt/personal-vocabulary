import { Request, Response } from 'express';

import express from 'express';
import wordService from '../models/word';
import { equals, isEmpty } from 'ramda';

import { Word, wordScheme } from '../models/word';

const route = express.Router();

route.get('/', async (req: Request, res: Response) => {
  if (isEmpty(req.query)) {
    try {
      const words = await wordService.getAllWords();
      res.status(200).json({ words });
    } catch (err) {
      res.status(500).json({ message: 'server error', err: err });
    }
    return;
  }

  // search words by prefix
  const prefix = req.query.prefix as string;

  const regex = /^[a-z A-Z]$/;

  if (!prefix || !regex.test(prefix)) {
    res.status(400).json({ message: 'invalid prefix' });
    return;
  }

  try {
    const words = await wordService.getWords(prefix.toUpperCase());
    res.status(200).json({
      words,
    });
    return;
  } catch (err) {
    res.status(500).json({ message: 'server error', err: err });
    return;
  }
});

route.post('/', async (req: Request, res: Response) => {
  const word = req.body.word as Omit<Word, 'searchCount'>;

  const { error, value } = wordScheme.validate(word);

  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  try {
    await wordService.add(value);
    res.status(200).json({ word: value });
  } catch (err) {
    res.status(500).json({ message: 'server error', err: err });
  }
});

route.delete('/:word', async (req, res) => {
  const word = (req.params.word || '') as string;

  try {
    await wordService.delete(word);
    res.status(200).json({ message: 'delete success' });
  } catch (err) {
    res.status(500).json({ message: 'server error', err: err });
  }
});

route.put('/', async (req, res) => {
  const word = req.body.word as Omit<Word, 'searchCount'>;

  const { error, value } = wordScheme.validate(word);

  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  try {
    await wordService.update(value);
    res.status(200).json({ word: value });
  } catch (err) {
    res.status(500).json({ message: 'server error', err: err });
  }
});

route.patch('/:word', async (req, res) => {
  const word = req.params.word as string;
  const action = req.body.action as string;

  if (equals(action, 'increaseReviewCount')) {
    try {
      await wordService.increaseReviewCount(word);
      res.status(200).json({ word: word });
    } catch (err) {
      res.status(500).json({ message: 'server error', err: err });
    }
    return;
  }

  res.status(400).json({ message: 'invalid action' });
});

export default route;
