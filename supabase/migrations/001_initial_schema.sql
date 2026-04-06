-- ============================================================
-- 量角器 Protractor — 初始数据库 Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 枚举
CREATE TYPE user_role AS ENUM ('admin', 'designer', 'project_manager', 'client');
CREATE TYPE project_status AS ENUM ('draft', 'in_progress', 'paused', 'completed', 'archived');
CREATE TYPE stage_status AS ENUM ('locked', 'in_progress', 'pending_confirmation', 'completed');
CREATE TYPE item_status AS ENUM ('pending', 'in_progress', 'completed', 'skipped');
CREATE TYPE contract_status AS ENUM ('draft', 'sent', 'viewed', 'signed');
CREATE TYPE notification_type AS ENUM ('stage_update', 'confirmation_request', 'material_update', 'contract_ready', 'photo_added', 'general');

-- ============================================================
-- 1. profiles
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'client',
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. clients
-- ============================================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    property_area NUMERIC(8,2),
    property_type TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. invitations
-- ============================================================
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    password_hash TEXT,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
    used_at TIMESTAMPTZ,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. projects
-- ============================================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    area NUMERIC(8,2),
    property_type TEXT,
    status project_status NOT NULL DEFAULT 'draft',
    current_stage_order INT NOT NULL DEFAULT 1,
    designer_id UUID REFERENCES profiles(id),
    project_manager_id UUID REFERENCES profiles(id),
    start_date DATE,
    expected_end_date DATE,
    actual_end_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. project_stages
-- ============================================================
CREATE TABLE project_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    stage_order INT NOT NULL CHECK (stage_order BETWEEN 1 AND 11),
    name TEXT NOT NULL,
    description TEXT,
    status stage_status NOT NULL DEFAULT 'locked',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    client_confirmed_at TIMESTAMPTZ,
    client_signature_id UUID,
    designer_confirmed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(project_id, stage_order)
);

-- ============================================================
-- 6. stage_items
-- ============================================================
CREATE TABLE stage_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id UUID NOT NULL REFERENCES project_stages(id) ON DELETE CASCADE,
    item_code TEXT NOT NULL,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    standard TEXT,
    responsible TEXT,
    status item_status NOT NULL DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES profiles(id),
    photo_required BOOLEAN NOT NULL DEFAULT FALSE,
    client_confirmation_required BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. materials
-- ============================================================
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT,
    specification TEXT,
    unit TEXT NOT NULL DEFAULT '项',
    reference_price NUMERIC(10,2),
    supplier TEXT,
    image_url TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 8. project_materials
-- ============================================================
CREATE TABLE project_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    stage_id UUID REFERENCES project_stages(id),
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT,
    specification TEXT,
    unit TEXT NOT NULL DEFAULT '项',
    unit_price NUMERIC(10,2) NOT NULL,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
    total_price NUMERIC(12,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
    image_url TEXT,
    client_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    client_confirmed_at TIMESTAMPTZ,
    notes TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 9. quotes
-- ============================================================
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    title TEXT NOT NULL DEFAULT '装修工程报价单',
    design_fee_per_sqm NUMERIC(8,2),
    management_fee_rate NUMERIC(4,2),
    material_markup_rate NUMERIC(4,2),
    subtotal_design NUMERIC(12,2),
    subtotal_construction NUMERIC(12,2),
    subtotal_materials NUMERIC(12,2),
    subtotal_management NUMERIC(12,2),
    total_amount NUMERIC(12,2),
    notes TEXT,
    client_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    client_confirmed_at TIMESTAMPTZ,
    client_signature_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 10. quote_items
-- ============================================================
CREATE TABLE quote_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    item_name TEXT NOT NULL,
    unit TEXT,
    quantity NUMERIC(10,2),
    unit_price NUMERIC(10,2),
    total_price NUMERIC(12,2),
    notes TEXT,
    sort_order INT NOT NULL DEFAULT 0
);

-- ============================================================
-- 11. contracts
-- ============================================================
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    template_url TEXT,
    content_html TEXT,
    status contract_status NOT NULL DEFAULT 'draft',
    sent_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    signed_at TIMESTAMPTZ,
    client_signature_id UUID,
    designer_signature_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 12. signatures
-- ============================================================
CREATE TABLE signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    context TEXT NOT NULL,
    context_id UUID NOT NULL,
    signature_url TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    signed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 13. photos
-- ============================================================
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES project_stages(id),
    item_id UUID REFERENCES stage_items(id),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    taken_at TIMESTAMPTZ,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 14. notifications
-- ============================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES profiles(id),
    project_id UUID REFERENCES projects(id),
    type notification_type NOT NULL DEFAULT 'general',
    title TEXT NOT NULL,
    body TEXT,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 15. contact_inquiries (预约咨询表单)
-- ============================================================
CREATE TABLE contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    property_type TEXT,
    area TEXT,
    message TEXT,
    is_handled BOOLEAN NOT NULL DEFAULT FALSE,
    handled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 索引
-- ============================================================
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_stages_project ON project_stages(project_id);
CREATE INDEX idx_stage_items_stage ON stage_items(stage_id);
CREATE INDEX idx_project_materials_project ON project_materials(project_id);
CREATE INDEX idx_photos_project ON photos(project_id);
CREATE INDEX idx_photos_stage ON photos(stage_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_unread ON notifications(recipient_id) WHERE is_read = FALSE;
CREATE INDEX idx_invitations_token ON invitations(token);

-- ============================================================
-- updated_at 自动更新触发器
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_project_stages_updated BEFORE UPDATE ON project_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_materials_updated BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_quotes_updated BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_contracts_updated BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
