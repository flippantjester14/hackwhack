import numpy as np
import requests
from fpdf import FPDF
from datetime import datetime




# Function to simulate ECG signal
def generate_ecg_signal(duration=10, fs=250):
    t = np.linspace(0, duration, duration * fs, endpoint=False)
    ecg_wave = np.sin(2 * np.pi * 1.0 * t)  # Simplified sine wave for ECG
    noise = np.random.normal(0, 0.02, len(t))
    ecg_signal = ecg_wave + noise
    return ecg_signal[:20]

# Function to simulate vital signs
def simulate_vital_signs():
    blood_pressure = (np.random.randint(110, 140), np.random.randint(70, 90))
    heart_rate = np.random.randint(60, 100)
    spo2 = np.random.uniform(95, 100)
    temperature = np.random.uniform(36.5, 37.5)
    return blood_pressure, heart_rate, spo2, temperature

# PDF class for generating reports
class PregnancyReportPDF(FPDF):
    def add_report_page(self, fields):
        self.add_page()
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, 'Pregnancy Check-Up Report', ln=True, align='C')
        self.ln(10)

        self.set_font('Arial', '', 12)
        self.cell(0, 10, f"Patient Name: {fields['Patient Name']}", ln=True)
        self.cell(0, 10, f"Patient Age: {fields['Age']} years", ln=True)
        self.cell(0, 10, f"Gestational Age: {fields['Gestational Age']} months", ln=True)
        self.ln(10)

        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, "Doctor's Prognosis and Recommendations:", ln=True)
        self.set_font('Arial', '', 12)
        self.multi_cell(0, 10, fields['Prognosis'])

# Chatbot interaction
def medical_chatbot():
    print("Hello, I’m Dr. Lah Wada, your OB-GYN specialist. Let’s ensure you’re doing well.")
    patient_details = {}

    # Step 1: Collect basic patient details
    patient_details['Patient Name'] = input("May I have your name? ").strip()
    patient_details['Age'] = input("How old are you? ").strip()
    patient_details['Gestational Age'] = input("How many months pregnant are you? ").strip()

    print("Thank you! Now let’s talk about how you’re feeling.")

    # Step 2: Understand the patient’s primary concern
    patient_details['Primary Concern'] = input("What seems to be the problem today? Please describe in detail: ").strip()

    # Step 3: Generate and analyze medical data
    ecg_data = generate_ecg_signal()
    bp, hr, spo2, temp = simulate_vital_signs()

    # Generate a prompt for the LLM
    prompt = f"""
    You are a highly experienced OB-GYN doctor. A patient has provided the following information:
    - Name: {patient_details['Patient Name']}
    - Age: {patient_details['Age']} years
    - Gestational Age: {patient_details['Gestational Age']} months
    - Primary Concern: {patient_details['Primary Concern']}
    - Blood Pressure: {bp[0]}/{bp[1]} mmHg
    - Heart Rate: {hr} bpm
    - SpO2: {spo2:.1f}%
    - Temperature: {temp:.1f}°C
    - ECG Data: {ecg_data}

    Provide a detailed prognosis and recommendations, considering the concern and the provided vital signs.
    """
    LLAMA_API_KEY = "LA-b5ec652918a74117b4c2d62ce15c573112c2642e969f46f19231a700338a173d"
    # Interact with the LLM
    api_url = "https://api.llama-api.com/chat/completions"
    headers = {
        "Authorization": f"Bearer {LLAMA_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3.1-405b",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.5,
        "max_tokens": 2000,
    }

    try:
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        response_data = response.json()
        prognosis = response_data['choices'][0]['message']['content'].strip() if 'choices' in response_data else "No response received."
    except requests.exceptions.RequestException as e:
        prognosis = f"Error processing the response: {str(e)}"

    print("Here’s what I think about your situation:")
    print(prognosis)

    # Step 4: Allow follow-up questions and provide detailed answers
    predefined_questions = [
        "Have you been experiencing any unusual pain or discomfort?",
        "Are you noticing any swelling or changes in movement patterns?",
        "Do you have any dietary concerns or questions?"
    ]

    follow_up_details = {}

    for question in predefined_questions:
        print(question)
        response = input("Your response: ").strip()
        follow_up_details[question] = response

        follow_up_prompt = f"""
        Based on the patient's details:
        - Name: {patient_details['Patient Name']}
        - Gestational Age: {patient_details['Gestational Age']} months
        - Primary Concern: {patient_details['Primary Concern']}
        - Response to Follow-Up Question: {response}

        Provide specific recommendations or explanations addressing this follow-up question.
        """

        try:
            follow_up_response = requests.post(api_url, headers=headers, json={
                "model": "llama3.1-405b",
                "messages": [{"role": "user", "content": follow_up_prompt}],
                "temperature": 0.5,
                "max_tokens": 1000,
            })
            follow_up_response.raise_for_status()
            follow_up_data = follow_up_response.json()
            follow_up_answer = follow_up_data['choices'][0]['message']['content'].strip() if 'choices' in follow_up_data else "I couldn’t process that."
            print(follow_up_answer)
        except requests.exceptions.RequestException as e:
            print(f"Error processing the follow-up question: {str(e)}")

    # Step 5: Open floor for patient questions
    while True:
        follow_up = input("Do you have any further questions? (Type 'exit' to end): ").strip()
        if follow_up.lower() == 'exit':
            print("Thank you for consulting me. Take care, and I wish you a safe and healthy pregnancy!")
            break

        follow_up_prompt = f"""
        Based on the patient's details:
        - Name: {patient_details['Patient Name']}
        - Gestational Age: {patient_details['Gestational Age']} months
        - Primary Concern: {patient_details['Primary Concern']}
        - Previous Responses: {follow_up_details}
        - Follow-Up Question: {follow_up}

        Provide a professional response. Ensure this response adds new insights without repeating the earlier prognosis.
        """

        try:
            follow_up_response = requests.post(api_url, headers=headers, json={
                "model": "llama3.1-405b",
                "messages": [{"role": "user", "content": follow_up_prompt}],
                "temperature": 0.5,
                "max_tokens": 1000,
            })
            follow_up_response.raise_for_status()
            follow_up_data = follow_up_response.json()
            follow_up_answer = follow_up_data['choices'][0]['message']['content'].strip() if 'choices' in follow_up_data else "I couldn’t process that."
            print(follow_up_answer)
        except requests.exceptions.RequestException as e:
            print(f"Error processing your follow-up question: {str(e)}")

    # Step 6: Generate PDF report
    pdf = PregnancyReportPDF()
    pdf.add_report_page({
        "Patient Name": patient_details['Patient Name'],
        "Age": patient_details['Age'],
        "Gestational Age": patient_details['Gestational Age'],
        "Prognosis": prognosis
    })
    pdf_output_path = f"Pregnancy_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    pdf.output(pdf_output_path, 'F')
    print(f"Your pregnancy report has been saved as {pdf_output_path}")

# Run chatbot
if __name__ == "__main__":
    medical_chatbot()
