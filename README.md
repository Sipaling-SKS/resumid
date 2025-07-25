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
EXPRESS_GPT_BASE_URL = 'https://api.openai.com/v1'
EXPRESS_API_KEY = 'EXPRESS_API_KEY'
EXPRESS_GPT_API_KEY = 'GPT_API_KEY'
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
- **Business Processes and Monetization:** Integrate the platform with Web 2 technology for a seamless user experience, broader adoption, and sustainable monetization opportunities.
- **Web 3 Payment Integration:** Explore Web 3-based payment features, including ICP top-up, for enhanced transaction ease and user flexibility.
- **Exclusive Access to Premium Resume Templates:** Provide professional resume templates exclusively for subscribers, ensuring premium features for members only.
- **Blockchain Job Portal:** A blockchain-based job portal connecting users with companies and enabling automated matching between user resumes and company needs.
