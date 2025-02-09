# **Nightly Examen App** 🌙✨  
A guided digital Examen journal designed to help you reflect on your day with prayerful meditation, gratitude, and self-examination. Rooted in the ancient Catholic practice of the Examen, this app provides a modern, minimalist experience for deepening your spiritual life.  

## **Features**  
✅ **Guided Examen** – Step through a structured reflection on God's presence, gratitude, and self-examination.  
✅ **Session-Based Journaling** – Write down thoughts before or after your Examen (Freemium users' data is not persistent).  
✅ **Progress Tracking** – Paid users can save and revisit past reflections.  
✅ **Minimalist & Peaceful UI** – A distraction-free, elegant design inspired by traditional Catholic aesthetics with a modern touch.  
✅ **Seamless Animations** – Smooth transitions, including a calming completion animation.  

---

## **Tech Stack**  
- **Framework:** [Next.js](https://nextjs.org/) (App Router)  
- **Database & Auth:** [Supabase](https://supabase.io/)  
- **UI & Animations:** Tailwind CSS, Framer Motion  
- **Storage:** Session-based for free users, persistent for paid users  
- **State Management:** React Hooks  
- **Deployment:** [Vercel](https://vercel.com/)  

---

## **Setup & Installation**  

### **1. Clone the repository**  
```bash
git clone https://github.com/yourusername/examen-app.git
cd examen-app
```

### **2. Install dependencies**  
```bash
npm install
```

### **3. Set up environment variables**  
Create a `.env.local` file and add your Supabase credentials:  
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **4. Run the development server**  
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## **Project Structure**  
```
/src
 ├── app/
 │   ├── layout.tsx  # Root layout wrapper
 │   ├── page.tsx    # Home screen
 │   ├── examen/     # Examen flow
 │   │   ├── presence.tsx
 │   │   ├── gratitude.tsx
 │   │   ├── reflection.tsx
 │   │   ├── shortcomings.tsx
 │   │   ├── blessings.tsx
 │   │   ├── closing.tsx
 ├── components/
 │   ├── Button.tsx
 │   ├── SplashScreen.tsx
 │   ├── CompletionAnimation.tsx
 ├── lib/
 │   ├── supabase.ts  # Database integration
 │   ├── storage.ts   # Session/local storage helpers
```

---

## **Usage**  

### **Freemium Users (No Signup Required)**  
- Complete the guided Examen  
- No stored history  

### **Paid Users (Subscription)**  
- Save reflections  
- Access additional Examen guides  

---

## **Credits**  
Designed & developed by **Noah Spott**. Inspired by the traditional Examen practice of St. Ignatius.  
