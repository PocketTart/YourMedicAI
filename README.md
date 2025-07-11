# 🧠 YourMedicAI: Healthcare Chatbot with Lab Report Analysis

YourMedicAI is an intelligent healthcare assistant that combines chatbot capabilities with lab report analysis and user authentication. Users can interact with a healthcare chatbot, upload lab reports (PDFs/images), and maintain a personal medical history.

## 🔧 Tech Stack

- **Frontend**: React.js
- **Auth & Profile Backend**: Node.js (Express.js)
- **Database**: Neon (PostgreSQL)
- **Chatbot & Lab Analysis Backend**: FastAPI (Python)
- **Libraries**: OpenCV, PIL for image processing

---

## 🌟 Features

### ✅ User Authentication & Profile Management
- Secure sign-up/login
- Profile data stored in Neon PostgreSQL (name, age, medical history)

### 🤖 AI Chatbot
- Healthcare question answering
- Personalized responses based on medical history

### 📄 Lab Report Upload & Analysis
- Supports PDF and image reports
- Extracts health metrics using AI/image processing (OpenCV, PIL)
- Automatically updates user medical history

---

## 🛠️ Project Setup

### 🔗 Prerequisites
- Node.js (v14+)
- Python 3.8+
- PostgreSQL (Neon DB)
- React (via `create-react-app`)

---

### 📦 Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd YourMedicAI
```

---

#### 2. Backend: Express.js (Auth & User Management)
```bash
cd backend-auth
npm install
```

**Create `.env` file**:
```ini
DATABASE_URL=your-neon-db-url
JWT_SECRET=your-jwt-secret
```

**Start the server**:
```bash
npm start
```

---

#### 3. Backend: FastAPI (Chatbot & Lab Report Analysis)
```bash
cd ../backend-chatbot
python -m venv venv
# Activate the virtual environment
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows

pip install -r requirements.txt
uvicorn chatapi:app --reload
```

---

#### 4. Frontend: React
```bash
cd ../frontend
npm install
npm start
```

Visit the app at [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
YourMedicAI/
│
├── backend-auth/          # Express.js backend (auth & user data)
│   └── routes/, controllers/, db/, middleware/
│
├── backend-chatbot/       # FastAPI backend (chatbot + lab analysis)
│   └── chatapi.py, utils/, lab_tools/
│
├── frontend/              # React frontend
│   └── src/, public/, components/
│
└── README.md              # Project documentation
```

---

## 🔄 Usage Flow

1. **Sign Up / Login** via the React frontend
2. **Profile Setup**: Enter name, age, and medical history
3. **Interact with AI**: Ask health-related questions
4. **Upload Reports**: Submit lab reports for analysis
5. **Receive Results**: Lab values extracted and appended to medical history

---

## 🧬 Lab Agent Details

- Supports **PDF** and **image** uploads
- Uses **OpenCV** and **PIL** for key metric extraction
- Saves extracted values to **Neon DB** linked to user profile

---

## ✅ Conclusion

**YourMedicAI** bridges modern web technologies with healthcare AI to offer a seamless, personalized health assistant. With React, Express, Neon PostgreSQL, and FastAPI working together, it empowers users to actively manage and track their health.

---

## 📃 License

MIT License
---
🚀 Deployment
You can access the live app here:
🔗 https://your-medic-ai.vercel.app/

✅ Deployed Services
Component	Platform	Status
Frontend	Vercel	✅ Live
Auth Backend (Node.js)	Render	✅ Live
Database	Neon (PostgreSQL)	✅ Live
Chatbot Backend (FastAPI)	Not Deployed	⚠️ Local Only

Note: The Chatbot & Lab Report Analysis Backend (FastAPI) is not deployed due to free-tier compute limits on platforms like Railway, Deta, and Render.
To use these features, please run the FastAPI backend locally by following the setup instructions.
---