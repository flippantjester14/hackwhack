# HackWhack Medical Dashboard

A responsive and interactive medical dashboard built with **React.js**, featuring chatbot integration for an enhanced user experience.

---

## **Getting Started**

This guide will help you set up and run the project. The primary directory to focus on is the **`medical-dashboard`** folder.

---

### **Project Structure**

```
hackwhack/
├── medical-dashboard/  # Primary project folder
│   ├── public/          # Static assets (HTML, images, etc.)
│   ├── src/             # React source code
│   ├── package.json     # Node.js dependencies and scripts
│   └── ...              # Other configuration files
├── .gitignore           # Ignored files for version control
└── README.md            # This file
```

---

## **Installation**

### **1. Clone the Repository**

Clone the repository to your local machine:

```bash
git clone https://github.com/flippantjester14/hackwhack.git
```

---

### **2. Navigate to the Project Directory**

Move into the `medical-dashboard` folder:

```bash
cd hackwhack/medical-dashboard
```

---

### **3. Set Up**

#### **Install Dependencies**

Ensure you have **Node.js** installed on your machine. Then, run the following command to install project dependencies:

```bash
npm install
```

---

## **Running the Application**

### **1. Development Mode**

Start the development server with the following command:

```bash
npm run dev
```

This will launch the application locally. You can access it in your browser at:

```bash
http://localhost:3000
```

---

### **2. Build for Production**

To create a production build of the app, use:

```bash
npm run build
```

The build output will be available in the `dist/` folder.

---

## **Environment Variables**

This project requires certain sensitive environment variables. Create a `.env` file in the `medical-dashboard` directory with the following content:

```bash
TWILIO_ACCOUNT_SID=<Your_Twilio_Account_SID>
TWILIO_AUTH_TOKEN=<Your_Twilio_Auth_Token>
```

**Note:** Ensure the `.env` file is added to `.gitignore` to avoid committing sensitive data.

---

## **Features**

- **Medical Dashboard**: Display vital stats such as SPO2, heart rate, blood pressure, etc.
- **Chatbot Integration**: Interact with a virtual medical assistant.
- **Weather Information**: View live weather updates for a specified location.
- **Dark Mode**: Switch between light and dark themes.
- **Responsive Design**: Fully optimized for both desktop and mobile devices.

---

## **Contributing**

If you'd like to contribute to the project, feel free to fork the repository, create a new branch, and submit a pull request. Contributions are always welcome!

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

For any issues or inquiries, please contact [flippantjester14](mailto:flippantjester14@example.com).
