//FileName : quriRating.ts
/// <reference types="node" />
'use strict';
import { IQuriRating } from './interfaces';

export class QuriRating implements IQuriRating {
  hash: string;
  creatorId: string;
  rating: bigint;
  weight: number;
  signature: string;
  dateAdded: bigint;
}
