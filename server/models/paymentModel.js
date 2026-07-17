const amountFields = [
  "amount_per_student",
  "total_collected",
  "total_due",
  "total_outstanding",
  "unit_price",
];

const normalizeAmounts = (row) => {
  if (!row) return row;

  return amountFields.reduce(
    (normalized, field) => {
      if (Object.prototype.hasOwnProperty.call(normalized, field)) {
        normalized[field] = Number(normalized[field] || 0);
      }
      return normalized;
    },
    { ...row }
  );
};

const normalizePeriod = (row) => {
  const period = normalizeAmounts(row);
  if (!period) return period;

  return {
    ...period,
    id: Number(period.id),
    paid_count: Number(period.paid_count || 0),
    total_students: Number(period.total_students || 0),
    unpaid_count: Number(period.unpaid_count || 0),
  };
};

const normalizePayment = (row) => ({
  ...row,
  amount_due: Number(row.amount_due || 0),
  billing_period_id: Number(row.billing_period_id),
  id: Number(row.id),
});

const findOwnedClass = async (
  db,
  { scheduleId, userId, forUpdate = false }
) => {
  const lockClause = forUpdate ? "FOR UPDATE OF c" : "";
  const result = await db.query(
    `
      SELECT c.id AS class_id
      FROM class c
      JOIN schedule s ON s.id = c.schedule_id
      WHERE c.schedule_id = $1
        AND c.user_id = $2
        AND s.user_id = $2
      ${lockClause}
    `,
    [scheduleId, userId]
  );

  return result.rows[0] || null;
};

const listPeriods = async (db, { scheduleId, userId }) => {
  const result = await db.query(
    `
      SELECT
        bp.id,
        bp.schedule_id,
        bp.period_start,
        bp.period_end,
        bp.lesson_count,
        bp.unit_price,
        bp.amount_per_student,
        bp.created_at,
        bp.updated_at,
        COUNT(p.id)::int AS total_students,
        COUNT(p.id) FILTER (WHERE p.status = '已繳')::int AS paid_count,
        COUNT(p.id) FILTER (WHERE p.status = '未繳')::int AS unpaid_count,
        COALESCE(SUM(p.amount_due), 0)::bigint AS total_due,
        COALESCE(
          SUM(p.amount_due) FILTER (WHERE p.status = '已繳'),
          0
        )::bigint AS total_collected,
        COALESCE(
          SUM(p.amount_due) FILTER (WHERE p.status = '未繳'),
          0
        )::bigint AS total_outstanding
      FROM billing_periods bp
      JOIN schedule s ON s.id = bp.schedule_id
      LEFT JOIN payments p ON p.billing_period_id = bp.id
      WHERE bp.schedule_id = $1
        AND s.user_id = $2
      GROUP BY bp.id
      ORDER BY bp.period_start DESC, bp.id DESC
    `,
    [scheduleId, userId]
  );

  return result.rows.map(normalizePeriod);
};

const listPaymentsByPeriod = async (
  db,
  { periodId, scheduleId, userId }
) => {
  const result = await db.query(
    `
      SELECT
        p.id,
        p.billing_period_id,
        p.student_id,
        p.student_name,
        p.amount_due,
        p.status,
        p.paid_at,
        p.created_at,
        p.updated_at
      FROM payments p
      JOIN billing_periods bp ON bp.id = p.billing_period_id
      JOIN schedule s ON s.id = bp.schedule_id
      WHERE p.billing_period_id = $1
        AND bp.schedule_id = $2
        AND s.user_id = $3
      ORDER BY
        CASE WHEN p.status = '未繳' THEN 0 ELSE 1 END,
        p.student_name,
        p.id
    `,
    [periodId, scheduleId, userId]
  );

  return result.rows.map(normalizePayment);
};

const findOverlappingPeriod = async (
  db,
  { scheduleId, periodStart, periodEnd, excludePeriodId = null }
) => {
  const result = await db.query(
    `
      SELECT id
      FROM billing_periods
      WHERE schedule_id = $1
        AND period_start <= $3::date
        AND period_end >= $2::date
        AND ($4::bigint IS NULL OR id <> $4::bigint)
      LIMIT 1
    `,
    [scheduleId, periodStart, periodEnd, excludePeriodId]
  );

  return result.rows[0] || null;
};

const createBillingPeriod = async (
  db,
  { scheduleId, periodStart, periodEnd, lessonCount, unitPrice }
) => {
  const result = await db.query(
    `
      INSERT INTO billing_periods (
        schedule_id,
        period_start,
        period_end,
        lesson_count,
        unit_price
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [scheduleId, periodStart, periodEnd, lessonCount, unitPrice]
  );

  return normalizePeriod(result.rows[0]);
};

const createPaymentsForPeriod = async (
  db,
  { classId, periodId, amountDue }
) => {
  const result = await db.query(
    `
      INSERT INTO payments (
        billing_period_id,
        student_id,
        student_name,
        amount_due,
        status,
        paid_at
      )
      SELECT $1, s.id, s.name, $2, '未繳', NULL
      FROM class_members cm
      JOIN students s ON s.id = cm.student_id
      WHERE cm.class_id = $3
      ORDER BY cm.id
      RETURNING id
    `,
    [periodId, amountDue, classId]
  );

  return result.rowCount;
};

const findOwnedPeriod = async (
  db,
  { periodId, scheduleId, userId, forUpdate = false }
) => {
  const lockClause = forUpdate ? "FOR UPDATE OF bp" : "";
  const result = await db.query(
    `
      SELECT bp.*
      FROM billing_periods bp
      JOIN schedule s ON s.id = bp.schedule_id
      WHERE bp.id = $1
        AND bp.schedule_id = $2
        AND s.user_id = $3
      ${lockClause}
    `,
    [periodId, scheduleId, userId]
  );

  return normalizePeriod(result.rows[0] || null);
};

const hasPaidPayments = async (db, periodId) => {
  const result = await db.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM payments
        WHERE billing_period_id = $1
          AND status = '已繳'
      ) AS has_paid
    `,
    [periodId]
  );

  return result.rows[0].has_paid;
};

const updateBillingPeriod = async (
  db,
  { periodId, periodStart, periodEnd, lessonCount, unitPrice }
) => {
  const result = await db.query(
    `
      UPDATE billing_periods
      SET period_start = $1,
          period_end = $2,
          lesson_count = $3,
          unit_price = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `,
    [periodStart, periodEnd, lessonCount, unitPrice, periodId]
  );

  return normalizePeriod(result.rows[0]);
};

const updatePaymentAmounts = async (db, { periodId, amountDue }) => {
  await db.query(
    `
      UPDATE payments
      SET amount_due = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE billing_period_id = $2
    `,
    [amountDue, periodId]
  );
};

const findOwnedPayment = async (
  db,
  { paymentId, scheduleId, userId, forUpdate = false }
) => {
  const lockClause = forUpdate ? "FOR UPDATE OF p" : "";
  const result = await db.query(
    `
      SELECT p.*
      FROM payments p
      JOIN billing_periods bp ON bp.id = p.billing_period_id
      JOIN schedule s ON s.id = bp.schedule_id
      WHERE p.id = $1
        AND bp.schedule_id = $2
        AND s.user_id = $3
      ${lockClause}
    `,
    [paymentId, scheduleId, userId]
  );

  return result.rows[0] ? normalizePayment(result.rows[0]) : null;
};

const updatePaymentStatus = async (db, { paymentId, status }) => {
  const result = await db.query(
    `
      UPDATE payments
      SET status = $1,
          paid_at = CASE
            WHEN $1 = '已繳' THEN COALESCE(paid_at, CURRENT_TIMESTAMP)
            ELSE NULL
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
    [status, paymentId]
  );

  return normalizePayment(result.rows[0]);
};

module.exports = {
  createBillingPeriod,
  createPaymentsForPeriod,
  findOverlappingPeriod,
  findOwnedClass,
  findOwnedPayment,
  findOwnedPeriod,
  hasPaidPayments,
  listPaymentsByPeriod,
  listPeriods,
  updateBillingPeriod,
  updatePaymentAmounts,
  updatePaymentStatus,
};
