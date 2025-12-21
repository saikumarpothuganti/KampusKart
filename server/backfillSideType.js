/**
 * Backfill missing item.sideType for Orders and Carts
 * Safe default behavior: DRY-RUN. Use --apply to write changes.
 *
 * Rules (safe):
 * - Only set `sideType` when it is missing or invalid on an item.
 * - Do NOT change items that already have a valid `sideType` (even if `sides` mismatches).
 * - Inference: `sides === 2` => 'double', else => 'single'.
 *
 * Usage:
 *   node backfillSideType.js            # dry-run both collections
 *   node backfillSideType.js --apply    # apply changes to both
 *   node backfillSideType.js --collection orders
 *   node backfillSideType.js --collection carts --apply
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';

dotenv.config();

const args = process.argv.slice(2);
const APPLY = args.includes('--apply') || args.includes('-a');
const collectionArg = args.find((a) => a.startsWith('--collection='));
const COLLECTION = collectionArg ? collectionArg.split('=')[1] : 'both';

const isValidSideType = (t) => t === 'single' || t === 'double';
const inferSideType = (sides) => (Number(sides) === 2 ? 'double' : 'single');

const ensureBackupDir = () => {
  const backupsDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }
  return backupsDir;
};

async function backfillModel(Model, name) {
  const summary = {
    collection: name,
    docsVisited: 0,
    docsUpdated: 0,
    itemsVisited: 0,
    itemsChanged: 0,
    changes: [], // For backup JSON
  };

  const cursor = Model.find({}).cursor();

  for await (const doc of cursor) {
    summary.docsVisited += 1;
    let changed = false;

    // Ensure items is an array
    const items = Array.isArray(doc.items) ? doc.items : [];

    items.forEach((item, idx) => {
      summary.itemsVisited += 1;
      if (!item) return;
      const before = item.sideType;
      const valid = isValidSideType(before);
      if (!valid) {
        const after = inferSideType(item.sides);
        if (before !== after) {
          summary.itemsChanged += 1;
          changed = true;
          // Record change
          summary.changes.push({
            docId: String(doc._id),
            index: idx,
            beforeSideType: before ?? null,
            afterSideType: after,
            sides: item.sides ?? null,
          });
          // Apply in-memory
          item.sideType = after;
        }
      }
    });

    if (changed && APPLY) {
      try {
        await doc.save();
        summary.docsUpdated += 1;
      } catch (err) {
        console.error(`[${name}] Failed to save doc ${doc._id}:`, err.message);
      }
    }
  }

  return summary;
}

async function main() {
  try {
    await connectDB();

    const doOrders = COLLECTION === 'orders' || COLLECTION === 'both';
    const doCarts = COLLECTION === 'carts' || COLLECTION === 'both';

    const results = [];

    if (doOrders) {
      console.log('▶ Processing Orders...');
      const res = await backfillModel(Order, 'orders');
      results.push(res);
    }
    if (doCarts) {
      console.log('▶ Processing Carts...');
      const res = await backfillModel(Cart, 'carts');
      results.push(res);
    }

    // Write backup if APPLY and there are changes
    const totalChanges = results.reduce((acc, r) => acc + r.itemsChanged, 0);
    if (APPLY && totalChanges > 0) {
      const backupsDir = ensureBackupDir();
      const file = path.join(
        backupsDir,
        `backfill-sideType-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
      );
      const payload = {
        ranAt: new Date().toISOString(),
        applyMode: true,
        mongoUriHint: process.env.MONGODB_URI || process.env.MONGO_URI ? 'env set' : 'env missing',
        results,
      };
      fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf8');
      console.log(`💾 Backup written: ${file}`);
    }

    // Print human summary
    console.log('\n===== Backfill Summary =====');
    results.forEach((r) => {
      console.log(`Collection: ${r.collection}`);
      console.log(`  Docs visited:   ${r.docsVisited}`);
      console.log(`  Docs updated:   ${APPLY ? r.docsUpdated : '(dry-run)'}`);
      console.log(`  Items visited:  ${r.itemsVisited}`);
      console.log(`  Items changed:  ${r.itemsChanged}${APPLY ? '' : ' (would change)'}`);
    });
    console.log(`Mode: ${APPLY ? 'APPLY (changes saved)' : 'DRY-RUN (no writes)'}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Backfill failed:', err);
    process.exit(1);
  }
}

main();
