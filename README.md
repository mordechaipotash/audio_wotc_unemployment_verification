# Audio WOTC Unemployment Verification System

Backend system for multi-tenant audio file management and unemployment verification processing.

## 🎯 Overview

Production system for managing audio-based unemployment verification workflows as part of the Work Opportunity Tax Credit (WOTC) application process.

## 🏗️ Architecture

**Backend**:
- **Next.js 14** API routes for audio processing
- **PostgreSQL** database with multi-tenant architecture
- **Supabase** for storage and real-time features
- **HTML5 Audio API** integration
- **TanStack Table v8** for data management

**Key Features**:
- Multi-tenant data isolation (tenant_id based)
- Audio file storage and retrieval
- Unemployment verification workflow
- Real-time audio playback
- Audit trail for all verifications

## 📊 Database Schema

**audio_files** table:
```sql
CREATE TABLE audio_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  verification_status TEXT CHECK (status IN ('pending', 'verified', 'rejected')),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Multi-tenant isolation index
CREATE INDEX idx_audio_files_tenant ON audio_files(tenant_id);
```

**verification_log** table:
```sql
CREATE TABLE verification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audio_file_id UUID REFERENCES audio_files(id),
  action TEXT NOT NULL,
  performed_by UUID REFERENCES users(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);
```

## 💼 Use Cases

1. **Unemployment Verification**: Verify audio recordings of unemployment statements
2. **Multi-Tenant Processing**: Isolated data for multiple WOTC processing companies
3. **Audit Compliance**: Complete audit trail for government compliance
4. **Workflow Management**: Track verification status from upload to approval

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API routes
- **Database**: PostgreSQL, Supabase
- **Storage**: Supabase Storage
- **Audio**: HTML5 Audio API
- **Tables**: TanStack Table v8
- **Styling**: Tailwind CSS

## 🚀 Key Technical Features

**Multi-Tenant Architecture**:
- Tenant-based data isolation
- Row Level Security (RLS) policies
- Separate storage buckets per tenant

**Audio Processing**:
- Secure file upload
- Real-time playback
- Metadata extraction
- File versioning

**Verification Workflow**:
- Queue-based processing
- Assignment system
- Status tracking
- Notification system

## 📈 Production Metrics

- Multi-tenant support for WOTC processing companies
- Secure audio storage with access controls
- Real-time verification workflows
- Complete audit trail for compliance

## 🔗 Related Projects

Part of the WOTC (Work Opportunity Tax Credit) processing suite:
- **WOTCFY**: Enterprise tax credit processing platform
- **Digital 8850**: IRS Form digitization

---

**Status**: Production  
**Tech Focus**: Backend architecture, multi-tenant systems, PostgreSQL

## WOTC Suite

This is part of a complete Work Opportunity Tax Credit processing ecosystem:

- [digital_8850](https://github.com/mordechaipotash/digital_8850) - IRS Form 8850 with 7-language support
- [enterprise-tax-credit-platform](https://github.com/mordechaipotash/enterprise-tax-credit-platform) - Full processing platform with AI extraction
- **audio_wotc_unemployment_verification** (this repo) - Audio verification system

---

*Built by [Mordechai Potash](https://github.com/mordechaipotash)*
