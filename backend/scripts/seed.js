import 'dotenv/config';
import bcrypt from 'bcrypt';
import { pool } from '../src/db/mysql.js';
import {
  DEMO_EMAIL,
  DEMO_NICKNAME,
  DEMO_PASSWORD,
  NPC_COUNT,
  NPC_NICKNAMES,
  PHOTO_CARD_COUNT,
  SALE_TYPES,
  TARGET_ACTIVE_LISTINGS,
  TARGET_PURCHASES,
  TARGET_SOLD_LISTINGS,
} from './seed-data.js';
import {
  buildPhotoCard,
  daysAgo,
  pick,
  priceForGrade,
  randomInt,
  shuffle,
} from './seed-helpers.js';

const BCRYPT_ROUNDS = 10;

async function clearAll(conn) {
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  await conn.query('TRUNCATE TABLE point_box_draw');
  await conn.query('TRUNCATE TABLE point_history');
  await conn.query('TRUNCATE TABLE purchase');
  await conn.query('TRUNCATE TABLE listing');
  await conn.query('TRUNCATE TABLE user_card');
  await conn.query('TRUNCATE TABLE photo_card');
  await conn.query('TRUNCATE TABLE `user`');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function insertUser(conn, { email, nickname, passwordHash, points, regDate }) {
  const [r] = await conn.query(
    `INSERT INTO \`user\` (email, nickname, password_hash, points, reg_date, upt_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [email, nickname, passwordHash, points, regDate, regDate],
  );
  return r.insertId;
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS);
  const conn = await pool.getConnection();

  try {
    console.log('🗑️  기존 데이터 삭제...');
    await clearAll(conn);

    console.log('👤 사용자 생성 (데모 1 + NPC %d)...', NPC_COUNT);
    const userIds = [];

    const demoId = await insertUser(conn, {
      email: DEMO_EMAIL,
      nickname: DEMO_NICKNAME,
      passwordHash,
      points: 85000,
      regDate: daysAgo(90),
    });
    userIds.push(demoId);

    for (let i = 0; i < NPC_COUNT; i++) {
      const id = await insertUser(conn, {
        email: `trader${String(i + 1).padStart(2, '0')}@favorite-photo.dev`,
        nickname: NPC_NICKNAMES[i],
        passwordHash,
        points: randomInt(5000, 120000),
        regDate: daysAgo(randomInt(10, 100)),
      });
      userIds.push(id);
    }

    const npcIds = userIds.filter((id) => id !== demoId);

    console.log('🃏 포토카드 %d장 생성...', PHOTO_CARD_COUNT);
    const photoCards = [];
    for (let i = 0; i < PHOTO_CARD_COUNT; i++) {
      const creatorUserId = pick(userIds);
      const card = buildPhotoCard(i, creatorUserId);
      const [r] = await conn.query(
        `INSERT INTO photo_card
          (creator_user_id, name, description, genre, grade, min_price, total_supply, image_url, reg_date, upt_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          card.creatorUserId,
          card.name,
          card.description,
          card.genre,
          card.grade,
          card.minPrice,
          card.totalSupply,
          card.imageUrl,
          card.regDate,
          card.regDate,
        ],
      );
      photoCards.push({
        photoCardId: r.insertId,
        ...card,
      });
    }

    console.log('📦 보유 카드(user_card) 분배...');
    const userCardRows = [];

    for (const pc of photoCards) {
      const ownerCount = randomInt(1, Math.min(3, npcIds.length));
      const owners = shuffle(npcIds).slice(0, ownerCount);
      if (Math.random() < 0.35) owners.push(demoId);

      let remaining = pc.totalSupply;
      const uniqueOwners = [...new Set(owners)];

      for (let o = 0; o < uniqueOwners.length; o++) {
        const uid = uniqueOwners[o];
        const qty =
          o === uniqueOwners.length - 1
            ? remaining
            : randomInt(1, Math.max(1, Math.floor(remaining / (uniqueOwners.length - o))));
        remaining -= qty;
        if (qty <= 0) continue;

        const [r] = await conn.query(
          `INSERT INTO user_card (user_id, photo_card_id, quantity, reg_date, upt_date)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), upt_date = VALUES(upt_date)`,
          [uid, pc.photoCardId, qty, pc.regDate, pc.regDate],
        );

        const userCardId =
          r.insertId ||
          (
            await conn.query(
              'SELECT user_card_id FROM user_card WHERE user_id = ? AND photo_card_id = ?',
              [uid, pc.photoCardId],
            )
          )[0][0].user_card_id;

        userCardRows.push({
          userCardId,
          userId: uid,
          photoCardId: pc.photoCardId,
          quantity: qty,
          grade: pc.grade,
          minPrice: pc.minPrice,
          genre: pc.genre,
        });
      }
    }

    // 데모 유저 보유 카드 최소 10장 보장
    const demoOwned = userCardRows.filter((r) => r.userId === demoId);
    if (demoOwned.length < 10) {
      const extras = shuffle(photoCards.filter((pc) => !demoOwned.some((d) => d.photoCardId === pc.photoCardId))).slice(
        0,
        10 - demoOwned.length,
      );
      for (const pc of extras) {
        const qty = randomInt(1, 4);
        const [r] = await conn.query(
          `INSERT INTO user_card (user_id, photo_card_id, quantity, reg_date, upt_date)
           VALUES (?, ?, ?, ?, ?)`,
          [demoId, pc.photoCardId, qty, pc.regDate, pc.regDate],
        );
        userCardRows.push({
          userCardId: r.insertId,
          userId: demoId,
          photoCardId: pc.photoCardId,
          quantity: qty,
          grade: pc.grade,
          minPrice: pc.minPrice,
          genre: pc.genre,
        });
      }
    }

    console.log('🏪 마켓 listing 생성...');
    const listable = shuffle(
      userCardRows.filter((r) => r.quantity >= 1 && r.userId !== demoId),
    );
    const demoListable = shuffle(userCardRows.filter((r) => r.userId === demoId && r.quantity >= 1));

    const activeTargets = listable.slice(0, TARGET_ACTIVE_LISTINGS - 2);
    const soldTargets = listable.slice(TARGET_ACTIVE_LISTINGS - 2, TARGET_ACTIVE_LISTINGS - 2 + TARGET_SOLD_LISTINGS);
    const demoListings = demoListable.slice(0, 2);

    const listingRecords = [];

    async function createListing(row, status, listQty) {
      const saleType = pick(SALE_TYPES);
      const price = priceForGrade(row.grade, row.minPrice);
      const regDate = daysAgo(randomInt(0, 45));
      const [r] = await conn.query(
        `INSERT INTO listing
          (user_card_id, seller_user_id, sale_type, status, quantity, price_per_unit,
           desired_grade, desired_genre, desired_desc, reg_date, upt_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.userCardId,
          row.userId,
          saleType,
          status,
          listQty,
          price,
          saleType === 'SELL_OR_EXCHANGE' ? pick(['RARE', 'SUPER RARE', 'LEGENDARY']) : null,
          saleType === 'SELL_OR_EXCHANGE' ? pick(['팬싸', '앨범', '공연']) : null,
          saleType === 'SELL_OR_EXCHANGE' ? '동급 이상 교환 희망' : null,
          regDate,
          regDate,
        ],
      );
      const record = {
        listingId: r.insertId,
        sellerUserId: row.userId,
        price,
        qty: listQty,
        status,
      };
      listingRecords.push(record);
      return record;
    }

    for (const row of activeTargets) {
      const listQty = Math.min(row.quantity, randomInt(1, 3));
      await createListing(row, 'ACTIVE', listQty);
    }
    for (const row of demoListings) {
      await createListing(row, 'ACTIVE', 1);
    }
    for (const row of soldTargets) {
      await createListing(row, 'SOLD_OUT', 0);
    }

    console.log('💳 구매·포인트 내역...');
    const activeListings = listingRecords.filter((l) => l.status === 'ACTIVE');
    const soldListings = listingRecords.filter((l) => l.status === 'SOLD_OUT');

    let purchaseCount = 0;
    for (let i = 0; i < TARGET_PURCHASES && activeListings.length > 0; i++) {
      const listing = activeListings[i % activeListings.length];
      let buyerId = pick(userIds);
      if (buyerId === listing.sellerUserId) buyerId = demoId;

      const qty = 1;
      const total = listing.price * qty;
      const regDate = daysAgo(randomInt(0, 30));

      const [pr] = await conn.query(
        `INSERT INTO purchase (buyer_user_id, listing_id, quantity, unit_price, total_price, reg_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [buyerId, listing.listingId, qty, listing.price, total, regDate],
      );

      await conn.query(
        `INSERT INTO point_history (user_id, amount, type, ref_entity_type, ref_entity_id, reg_date)
         VALUES (?, ?, 'PURCHASE', 'PURCHASE', ?, ?)`,
        [buyerId, -total, pr.insertId, regDate],
      );
      await conn.query(
        `INSERT INTO point_history (user_id, amount, type, ref_entity_type, ref_entity_id, reg_date)
         VALUES (?, ?, 'SELL', 'PURCHASE', ?, ?)`,
        [listing.sellerUserId, total, pr.insertId, regDate],
      );
      purchaseCount++;
    }

    for (const listing of soldListings) {
      const buyerId = pick(userIds.filter((id) => id !== listing.sellerUserId));
      const total = listing.price || randomInt(1000, 8000);
      const regDate = daysAgo(randomInt(5, 60));
      const [pr] = await conn.query(
        `INSERT INTO purchase (buyer_user_id, listing_id, quantity, unit_price, total_price, reg_date)
         VALUES (?, ?, 1, ?, ?, ?)`,
        [buyerId, listing.listingId, total, total, regDate],
      );
      await conn.query(
        `INSERT INTO point_history (user_id, amount, type, ref_entity_type, ref_entity_id, reg_date)
         VALUES (?, ?, 'PURCHASE', 'PURCHASE', ?, ?)`,
        [buyerId, -total, pr.insertId, regDate],
      );
      purchaseCount++;
    }

    console.log('🎁 랜덤 포인트 뽑기 이력...');
    const drawUsers = shuffle(userIds).slice(0, 12);
    for (const uid of drawUsers) {
      const earned = randomInt(1, 10);
      const regDate = daysAgo(randomInt(2, 40));
      const [ph] = await conn.query(
        `INSERT INTO point_history (user_id, amount, type, ref_entity_type, ref_entity_id, reg_date)
         VALUES (?, ?, 'POINT_BOX_DRAW', 'POINT_BOX_DRAW', NULL, ?)`,
        [uid, earned, regDate],
      );
      await conn.query(
        `INSERT INTO point_box_draw (user_id, point_history_id, earned_points, reg_date)
         VALUES (?, ?, ?, ?)`,
        [uid, ph.insertId, earned, regDate],
      );
    }

    // 데모 유저: 2시간+ 전 뽑기 1건 (쿨다운 UI 테스트용)
    const oldDraw = daysAgo(3);
    const [demoPh] = await conn.query(
      `INSERT INTO point_history (user_id, amount, type, ref_entity_type, ref_entity_id, reg_date)
       VALUES (?, 7, 'POINT_BOX_DRAW', 'POINT_BOX_DRAW', NULL, ?)`,
      [demoId, oldDraw],
    );
    await conn.query(
      `INSERT INTO point_box_draw (user_id, point_history_id, earned_points, reg_date)
       VALUES (?, ?, 7, ?)`,
      [demoId, demoPh.insertId, oldDraw],
    );

    const [[counts]] = await conn.query(`
      SELECT
        (SELECT COUNT(*) FROM \`user\`) AS users,
        (SELECT COUNT(*) FROM photo_card) AS photo_cards,
        (SELECT COUNT(*) FROM user_card) AS user_cards,
        (SELECT COUNT(*) FROM listing WHERE status = 'ACTIVE') AS active_listings,
        (SELECT COUNT(*) FROM listing WHERE status = 'SOLD_OUT') AS sold_listings,
        (SELECT COUNT(*) FROM purchase) AS purchases,
        (SELECT COUNT(*) FROM point_box_draw) AS draws
    `);

    console.log('\n✅ 시드 완료\n');
    console.log('--- 데모 로그인 ---');
    console.log(`  이메일:   ${DEMO_EMAIL}`);
    console.log(`  비밀번호: ${DEMO_PASSWORD}`);
    console.log(`  닉네임:   ${DEMO_NICKNAME} (user_id=${demoId})`);
    console.log('--- NPC 계정 (동일 비밀번호) ---');
    console.log(`  trader01@favorite-photo.dev ~ trader${String(NPC_COUNT).padStart(2, '0')}@favorite-photo.dev`);
    console.log('--- 데이터 요약 ---');
    console.log(`  USER ${counts.users} | PHOTO_CARD ${counts.photo_cards} | USER_CARD ${counts.user_cards}`);
    console.log(
      `  LISTING ACTIVE ${counts.active_listings} / SOLD_OUT ${counts.sold_listings} | PURCHASE ${counts.purchases} | DRAW ${counts.draws}`,
    );
    console.log('\n⚠️  npm run db:seed 는 전체 데이터를 삭제 후 재생성합니다.\n');
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
