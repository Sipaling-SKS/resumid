![Resumid Banner](https://i.imgur.com/QY2W9Jn.png)

# `Resumid`

Resumid is a decentralized Web-based application designed to help users analyze resumes in depth by leveraging AI technology. This platform provides a match score between the resume and the job position applied for, while providing a comprehensive summary of the quality of the user's resume. 

## 📺 Resumid Demo
Demo Video: [Youtube](https://youtu.be/HEiYWsDFzQ8)

---

## 🧑‍💻 Team

| **Name** | **Role** |
|---|---|
| Calvin Danyalson | Lead, Backend Developer |
| Muhammad Fadil Hisyam | UI/UX Designer, Frontend Developer |
| Muhammad Rafli Rayhan K. | Frontend Developer |
| Agustina Puspita Sari | UI/UX Designer, Frontend Developer |
| Tiara Puspita | Backend Developer |

---

## 🚀 Features

- **Internet Identity Authentication:** provides personalized access to users keeping their data private and secure using Internet Identity.
- **Resume Analyzer:** performs in-depth resume analysis with AI technology, provides a match score, outlines resume strengths and weaknesses, and provides personalized recommendations to improve the resume according to the position applied for. The analysis delivers a compatibility score with the targeted job position, detailed feedback, and specific improvement pointers for every section. In addition, users receive personalized job recommendations to help them tailor their resumes to better match employer requirements and stand out in the recruitment process
- **History:** all analyzes performed are saved in history so users can easily track the development of their resume over time.
- **Tokenized Premium Packages:** Users purchase premium packages that generate tokens. These tokens are used to access the Resume Analyzer and other advanced features.
- **Built-in Wallet:** The wallet securely stores tokens, displays balances, and records transaction history. Tokens are automatically deducted whenever a resume analysis is performed.
- **Public Profiles & Endorsements:** CVs can be transformed into interactive, customizable public profiles. A reputation-based endorsement system strengthens users’ personal branding and professional credibility.


---

## 💻 Technologies Used

#### Backend:
- Programming Language: Motoko, Serde, Idempotency-Keys
#### Frontend:
- Framework & Libraries: React.js, Typescript, React Router, TailwindCSS, Shadcn, PDF.js, DFinity.
#### External Service:
- Runtime & Framework: Node.js, Express.js, MongoDB
#### Web3 Development Environment: 
- Internet Computer SDK (DFX)
#### Tools:
- Visual Studio Code, Postman, Candid UI, Figma

---

## 🔧 Prerequisites

- Linux or Windows with **WSL (Windows Subsystem for Linux)** enabled.
- **IC SDK (DFX) v0.24.3** - [Installation Guide](https://internetcomputer.org/docs/current/developer-docs/getting-started/install)
- **Node.js v22.12.0** - [Download](https://nodejs.org/)
- **Mops Package Manager** - [Installation Guide](https://docs.mops.one/quick-start)

---

## ⚙️ Setup & Installation

Before doing so, make sure the **prerequisites** mentioned above are complete.

#### Clone the project to your machine
```bash
git clone https://github.com/Sipaling-SKS/resumid/
cd resumid
```

#### Install project dependencies (Frontend)
```bash
npm install
```

#### Install motoko dependencies (Backend)
```bash
mops install
```

#### Start Internet Computer Environment
```bash
dfx start --background
```

#### Deploy Internet Computer Environment App
```bash
dfx deploy
```

#### Insert Express Environment to root .env (below are examples)
```env
# START EXPRESS ENVIRONMENT VARIABLES
EXPRESS_MONGODB_URI='mongodb+srv://<user>:<password>@cluster0.afxyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
EXPRESS_API_KEY = 'EXPRESS_API_KEY'
EXPRESS_GEMINI_API_KEY = 'GEMINI_API_KEY'
EXPRESS_PORT = 5000
# END EXPRESS ENVIRONMENT VARIABLES
```

#### Install and Start Resumid Api Service
```bash
cd src/resumid_api_service
npm install

# Start Resumid Api Service
npm start
```

Once the setup & installation, your application will be available at `http://{canister_id}.localhost:4943/`.

---

## Future Plans
- **Automatic Profile Builder:** An intelligent feature that automatically generates a personalized profile from an uploaded CV. This will streamline onboarding, save users time, and ensure profile accuracy for better resume analysis.
- **Exclusive Access to Premium Resume Templates:** Access to professional resume templates available exclusively to subscribed users, ensuring premium features are reserved for members only.
- **Blockchain Job Portal:** A blockchain-based job portal that connects users with companies and enables automatic matching between user resumes and company needs.
- **Gamified Referral & Rewards:**  Implement a gamified system that rewards users with tokens for active participation, such as inviting friends, updating profiles, or receiving endorsements.
- **Promotion:** The platform will introduce a dedicated Promotion feature, offering monthly challenges such as “Best Resume Score.” Winners will receive vouchers, token rewards, or complimentary premium access, designed to enhance user engagement and provide additional value to the overall user experience.
