# 📋 Multi-Step Form Project

A fully featured **multi-step form** built with **React, React Hook Form, Zod, and Tailwind CSS**.  
It includes step-wise validation, conditional fields, dynamic skill selection, and a final review step before submission.  

---

## 🚀 How to Run the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/multi-step-form.git
   cd multi-step-form
2. **Install dependencies**
   ```bash
    npm install
3. **Start the development server**
   ```bash
    npm run dev
4. Open your browser → [http://localhost:3000](http://localhost:3000)

---

## 🛠️ How I Handled Complex Logic

### ✅ Step-wise Validation

* Each step validates **only its own fields** before moving forward.
* Used `getCurrentStepFields()` to determine the fields for the active step and `trigger()` from `react-hook-form` for validation.

### ✅ Dynamic Skills & Experiences

* Skills are loaded dynamically based on the selected department (`skillsData`).
* When a skill checkbox is selected, it gets added to `skills[]` and an experience object is appended to `experiences[]` using `useFieldArray`.
* When deselected, both the skill and its related experience are removed.

### ✅ Conditional Fields

* Age is calculated from **DOB** using a utility function `getAge()`.
* If age < 21, **Guardian Contact fields** are shown and required.

### ✅ Validation with Zod

* Entire form schema is defined with **Zod**.
* Validations include: email, phone number format, DOB age restriction, salary range, skill minimum count, etc.
* **Custom validation with `superRefine`:**

  * Salary range → `min ≤ max`
  * Full-time: \$30,000 – \$200,000
  * Contract: \$50 – \$150/hour

### ✅ Auto-Save Form State

* Used `watch()` from `react-hook-form` to keep form data synced into local React state.
* Does **not** use localStorage — state is preserved in memory while navigating steps.

### ✅ Review & Submit

* Final step displays a **review section** grouped into:

  * Personal Information
  * Job Details
  * Skills & Preferences
  * Emergency Contact
* User must confirm all information before submitting.

---

## 📌 Assumptions Made

* Phone number format: `+1-123-456-7890`
* Profile picture: only **JPG/PNG**, max size **2MB**
* Start date: must be within **0–90 days** from today
* Salary rules:

  * **Full-time:** \$30,000 – \$200,000
  * **Contract:** \$50 – \$150/hour
* Minimum **3 skills** must be selected
* Applicants under **21 years old** must provide Guardian contact information

---


## 📦 Tech Stack

* **Next.js**
* **React Hook Form**
* **Zod** (validation)
* **Tailwind CSS**
* **Shadcn/UI Components**
* **SweetAlert2**

