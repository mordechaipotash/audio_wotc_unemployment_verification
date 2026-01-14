# Audio WOTC Unemployment Verification System

> **$200K+ revenue generated in 2024. Built in 1 week. Solo.**

Production multi-tenant system that automated a $5K/applicant phone call bottleneck into self-service verification in minutes.

---

## 📸 Screenshots

### Welcome Screen
*Audio-guided form with accessibility features*

![Welcome Screen](.github/assets/01-welcome.png)

### Introduction
*Collects basic info while audio reads instructions*

![Introduction](.github/assets/02-introduction.png)

### The $5K Question
*Employment Status - each wrong answer = $5,000 lost*

![Employment Status](.github/assets/03-employment-status.png)

---

## 📊 Business Impact

| Metric | Value |
|--------|-------|
| Revenue generated | **$200K+** (2024) |
| Build time | 1 week |
| Previous cost | $5K/applicant (phone calls) |
| New cost | ~$0.10/applicant |
| Time savings | 45 min → under 1 min |

---

## 🎯 The Problem

Tax credit applications require unemployment verification. The industry standard:
- Manual phone calls to state agencies
- $5K per applicant
- 45+ minutes each
- Paper forms that got lost
- Applicants who didn't understand the questions

**Each wrong checkbox = $5,000 lost.**

---

## ✅ The Solution

Audio-guided self-service form:
- Audio reads every instruction out loud
- Simple Yes/No buttons (no confusing checkboxes)
- Progress stepper shows where they are
- Mobile-friendly (most fill it out on phones)
- Under 60 seconds to complete

The key insight: applicants weren't clicking "No" because they weren't eligible. They were clicking "No" because they **didn't understand the question**.

---

## 🏗️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Supabase** - Auth, storage, real-time, RLS
- **PostgreSQL** - Multi-tenant database
- **HTML5 Audio API** - Voice guidance
- **TanStack Table v8** - Data management
- **Tailwind CSS** - Styling

---

## 🔐 Multi-Tenant Architecture

```sql
CREATE TABLE audio_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  verification_status TEXT CHECK (status IN ('pending', 'verified', 'rejected')),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for tenant isolation
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON audio_files
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

## 📈 Key Features

- **Multi-tenant data isolation** - Complete RLS-based separation
- **Audio-guided workflow** - Accessibility-first design
- **Real-time status updates** - Supabase subscriptions
- **Complete audit trail** - Every action logged
- **Queue-based processing** - Handle volume spikes

---

## 🎓 Lessons Learned

1. **The bottleneck wasn't the code.** It was human comprehension. Audio guidance solved what better UI couldn't.

2. **Simple > Smart.** No AI, no fancy extraction. Just audio + big buttons.

3. **$5K per wrong answer** changes how you think about forms. Every input field is a potential failure point.

---

## 📄 License

MIT

---

*Built in Beit Shemesh, Israel*
