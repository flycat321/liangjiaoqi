import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createServiceRoleClient()

  // Add fee columns to contracts table if not exist
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contracts' AND column_name='design_fee') THEN
          ALTER TABLE contracts ADD COLUMN design_fee NUMERIC(12,2);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contracts' AND column_name='construction_fee') THEN
          ALTER TABLE contracts ADD COLUMN construction_fee NUMERIC(12,2);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contracts' AND column_name='management_fee_rate') THEN
          ALTER TABLE contracts ADD COLUMN management_fee_rate NUMERIC(4,2);
        END IF;
      END $$;
    `
  })

  if (error) {
    // If RPC doesn't exist, return the SQL for manual execution
    return NextResponse.json({
      message: '请在 Supabase SQL Editor 中执行以下 SQL：',
      sql: `ALTER TABLE contracts ADD COLUMN IF NOT EXISTS design_fee NUMERIC(12,2);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS construction_fee NUMERIC(12,2);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS management_fee_rate NUMERIC(4,2);`
    })
  }

  return NextResponse.json({ success: true })
}
