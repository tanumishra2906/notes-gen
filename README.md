# 📚 Intelligent Study Assistant MVP

An AI-powered web application built with **Next.js 15**, **Tailwind CSS**, and **Google Gemini 1.5 Flash API**. Upload textbook chapters or PDF study notes to instantly generate structured summaries, key concepts, definitions, important facts, and formulas.

---

## ✨ Features

- 📄 **PDF Text Extraction**: Extracts text server-side using `pdf-parse`.
- 🤖 **Structured AI Analysis**: Powered by Google's `gemini-1.5-flash` with JSON response schemas.
- 📊 **Tabbed Study Dashboard**: Clean sectioned views for:
  - **Summary**: Concise overview (150–250 words) of the document.
  - **Key Concepts**: Core topics with detailed explanations.
  - **Definitions**: Important terms & definitions.
  - **Important Facts**: Key takeaways and bullet points.
  - **Formulas**: Equations & mathematical rules formatted in distinct monospace cards.
- ⚡ **In-Memory Processing**: Fast, privacy-focused processing with zero database storage.
- 📁 **Export Notes**: Export generated study notes as a `.txt` file with a single click.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS & Lucide Icons
- **AI Model**: `@google/generative-ai` (`gemini-1.5-flash`)
- **PDF Parser**: `pdf-parse` (Direct lib import for bundling stability)

---

## 🚀 Getting Started

### 1. Clone the Repository & Install Dependencies

```bash
cd "c:/mini project/antigravity_project"
npm install
```

### 2. Configure Environment Variables

1. Get a **free Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).
2. Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

3. Paste your Gemini API key in `.env.local`:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚠️ Free Tier & Safety Cutoffs

- **Model**: Uses `gemini-1.5-flash` specifically to remain within free tier quotas.
- **Max File Size**: 10MB per PDF file upload.
- **Character Truncation Safety Cutoff**: Extracted PDF text is capped at ~30,000 characters (~5,000-7,000 words) per request to remain within standard payload & rate limit boundaries.
- **Scanned PDFs**: Scanned/image-only PDFs (without selectable text) are currently not supported and will prompt a clear error notification.

---

## 📁 Folder Structure

```
app/
  page.tsx                    # Main upload landing & study dashboard UI
  api/
    process-pdf/
      route.ts                # PDF text extraction & Gemini API orchestration
components/
  upload/
    FileUploader.tsx          # Drag-and-drop file picker
    UploadProgress.tsx        # Step-by-step progress indicator
  dashboard/
    SummaryCard.tsx           # Executive summary section
    KeyConceptsList.tsx       # Key concepts grid
    DefinitionsList.tsx       # Vocabulary & definitions list
    FactsList.tsx             # Key bullet facts
    FormulasList.tsx          # Monospace formula cards
    DashboardTabs.tsx         # Tabbed results dashboard
  shared/
    ErrorAlert.tsx            # Error notification banner with retry
    LoadingSpinner.tsx        # Animated loading spinner
lib/
  gemini.ts                   # Gemini API client & JSON schema prompt setup
  pdf.ts                      # pdf-parse server extraction logic
  utils.ts                    # Tailwind class merger utility (cn)
types/
  study.ts                    # TypeScript interfaces for study content & responses
utils/
  validation.ts               # File size and MIME type validation
  formatError.ts              # Error message formatting helper
```
