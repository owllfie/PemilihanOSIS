const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { and, asc, desc, eq, ne, or, sql } = require('drizzle-orm');
const schema = require('../db/schema');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

const models = {
  user: { table: schema.users, id: 'user_id' },
  siswa: { table: schema.siswa, id: 'siswa_id' },
  calonKetua: { table: schema.calonKetua, id: 'calon_id' },
  voting: { table: schema.voting, id: 'voting_id' },
  calonAnggotaOsis: { table: schema.calonAnggotaOsis, id: 'pendaftaran_id' },
  hasilVoting: { table: schema.hasilVoting, id: 'hasil_id' },
  periodePemilihan: { table: schema.periodePemilihan, id: 'periode_id' },
  pengumuman: { table: schema.pengumuman, id: 'pengumuman_id' },
};

const normalizeData = (data = {}) => {
  const normalized = { ...data };
  if (normalized.status === 'Tidak_Lulus') normalized.status = 'Tidak Lulus';
  for (const key of ['tanggal_mulai', 'tanggal_selesai', 'tanggal_daftar']) {
    if (normalized[key] instanceof Date) {
      normalized[key] = normalized[key].toISOString().slice(0, 10);
    }
  }
  return normalized;
};

const whereExpr = (modelName, where = {}) => {
  const table = models[modelName].table;
  const clauses = [];

  for (const [key, value] of Object.entries(where)) {
    if (key === 'OR') {
      clauses.push(or(...value.map((condition) => whereExpr(modelName, condition))));
    } else if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'not')) {
      clauses.push(ne(table[key], value.not));
    } else {
      clauses.push(eq(table[key], value));
    }
  }

  return clauses.length > 1 ? and(...clauses) : clauses[0];
};

const orderExpr = (modelName, orderBy) => {
  if (!orderBy) return undefined;
  const [[field, direction]] = Object.entries(orderBy);
  return direction === 'desc' ? desc(models[modelName].table[field]) : asc(models[modelName].table[field]);
};

const applySelect = (row, select) => {
  if (!row || !select) return row;
  return Object.entries(select).reduce((result, [key, value]) => {
    if (value === true) result[key] = row[key];
    if (value && value.select && row[key] !== undefined) result[key] = applySelect(row[key], value.select);
    return result;
  }, {});
};

async function findFirst(modelName, options = {}, client = db) {
  let query = client.select().from(models[modelName].table);
  if (options.where) query = query.where(whereExpr(modelName, options.where));
  if (options.orderBy) query = query.orderBy(orderExpr(modelName, options.orderBy));
  const rows = await query.limit(1);
  return rows[0] ? enrich(modelName, rows[0], options, client) : null;
}

async function findMany(modelName, options = {}, client = db) {
  let query = client.select().from(models[modelName].table);
  if (options.where) query = query.where(whereExpr(modelName, options.where));
  if (options.orderBy) query = query.orderBy(orderExpr(modelName, options.orderBy));
  const rows = await query;
  return Promise.all(rows.map((row) => enrich(modelName, row, options, client)));
}

async function countRows(modelName, options = {}, client = db) {
  let query = client.select({ value: sql`count(*)::int` }).from(models[modelName].table);
  if (options.where) query = query.where(whereExpr(modelName, options.where));
  const rows = await query;
  return rows[0]?.value || 0;
}

async function createRow(modelName, options, client = db) {
  const rows = await client.insert(models[modelName].table).values(normalizeData(options.data)).returning();
  return enrich(modelName, rows[0], options, client);
}

async function updateRow(modelName, options, client = db) {
  if (Object.keys(options.data || {}).length === 0) {
    return findFirst(modelName, { ...options, include: options.include, select: options.select }, client);
  }

  const rows = await client
    .update(models[modelName].table)
    .set(normalizeData(options.data))
    .where(whereExpr(modelName, options.where))
    .returning();
  return rows[0] ? enrich(modelName, rows[0], options, client) : null;
}

async function updateManyRows(modelName, options = {}, client = db) {
  if (Object.keys(options.data || {}).length === 0) {
    return { count: 0 };
  }

  let query = client.update(models[modelName].table).set(normalizeData(options.data));
  if (options.where) query = query.where(whereExpr(modelName, options.where));
  const rows = await query.returning();
  return { count: rows.length };
}

async function deleteRow(modelName, options, client = db) {
  const rows = await client.delete(models[modelName].table).where(whereExpr(modelName, options.where)).returning();
  return rows[0] || null;
}

async function upsertRow(modelName, options, client = db) {
  const existing = await findFirst(modelName, { where: options.where }, client);
  if (!existing) return createRow(modelName, { data: options.create }, client);

  const data = {};
  for (const [key, value] of Object.entries(options.update || {})) {
    data[key] = value && typeof value === 'object' && value.increment ? existing[key] + value.increment : value;
  }
  return updateRow(modelName, { where: options.where, data }, client);
}

async function groupByRows(modelName, options, client = db) {
  if (modelName !== 'calonAnggotaOsis' || options.by?.[0] !== 'status') {
    throw new Error(`groupBy belum didukung untuk model ${modelName}`);
  }

  const rows = await client
    .select({
      status: schema.calonAnggotaOsis.status,
      count: sql`count(${schema.calonAnggotaOsis.pendaftaran_id})::int`,
    })
    .from(schema.calonAnggotaOsis)
    .groupBy(schema.calonAnggotaOsis.status);

  return rows.map((row) => ({ status: row.status, _count: { pendaftaran_id: row.count } }));
}

async function enrich(modelName, row, options = {}, client = db) {
  if (!row) return row;
  let result = { ...row };
  const include = options.include || {};

  if (modelName === 'user' && (include.siswa || options.select?.siswa)) {
    result.siswa = await findFirst('siswa', { where: { user_id: row.user_id }, ...(include.siswa || options.select.siswa) }, client);
  }
  if (modelName === 'siswa' && include.user) {
    result.user = await findFirst('user', { where: { user_id: row.user_id }, ...include.user }, client);
  }
  if (modelName === 'calonKetua') {
    if (include.ketua) result.ketua = await findFirst('siswa', { where: { siswa_id: row.ketua_id }, ...include.ketua }, client);
    if (include.wakil) result.wakil = await findFirst('siswa', { where: { siswa_id: row.wakil_id }, ...include.wakil }, client);
    if (include.hasil_voting) result.hasil_voting = await findFirst('hasilVoting', { where: { calon_id: row.calon_id } }, client);
    if (include._count) result._count = { voting: await countRows('voting', { where: { calon_id: row.calon_id } }, client) };
  }
  if (modelName === 'voting' && include.calon) {
    result.calon = await findFirst('calonKetua', { where: { calon_id: row.calon_id }, ...include.calon }, client);
  }
  if (modelName === 'calonAnggotaOsis' && include.siswa) {
    result.siswa = await findFirst('siswa', { where: { siswa_id: row.siswa_id }, ...include.siswa }, client);
  }
  if (modelName === 'pengumuman' && include.creator) {
    result.creator = row.dibuat_oleh ? await findFirst('user', { where: { user_id: row.dibuat_oleh }, ...include.creator }, client) : null;
  }

  return options.select ? applySelect(result, options.select) : result;
}

const makeModel = (modelName, client = db) => ({
  findUnique: (options) => findFirst(modelName, options, client),
  findFirst: (options) => findFirst(modelName, options, client),
  findMany: (options) => findMany(modelName, options, client),
  count: (options) => countRows(modelName, options, client),
  create: (options) => createRow(modelName, options, client),
  update: (options) => updateRow(modelName, options, client),
  updateMany: (options) => updateManyRows(modelName, options, client),
  delete: (options) => deleteRow(modelName, options, client),
  upsert: (options) => upsertRow(modelName, options, client),
  groupBy: (options) => groupByRows(modelName, options, client),
});

const makeClient = (client = db) => ({
  user: makeModel('user', client),
  siswa: makeModel('siswa', client),
  calonKetua: makeModel('calonKetua', client),
  voting: makeModel('voting', client),
  calonAnggotaOsis: makeModel('calonAnggotaOsis', client),
  hasilVoting: makeModel('hasilVoting', client),
  periodePemilihan: makeModel('periodePemilihan', client),
  pengumuman: makeModel('pengumuman', client),
  $connect: () => pool.query('SELECT 1'),
  $disconnect: () => pool.end(),
  $transaction: (callback) => db.transaction((tx) => callback(makeClient(tx))),
});

module.exports = makeClient();
