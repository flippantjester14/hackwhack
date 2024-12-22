from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import dr_lawda
from fpdf import FPDF
from datetime import datetime
import os
import requests
from twilio.rest import Client

app = Flask(__name__)
CORS(app)

# Global variables to maintain conversation state
conversation_state = {}
FOLLOW_UP_QUESTIONS = [
    "Have you been experiencing any unusual pain or discomfort?",
    "Are you noticing any swelling or changes in movement patterns?",
    "Do you have any dietary concerns or questions?"
]

LLAMA_API_KEY = "LA-b5ec652918a74117b4c2d62ce15c573112c2642e969f46f19231a700338a173d"
API_URL = "https://api.llama-api.com/chat/completions"

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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_chat', methods=['POST'])
def start_chat():
    global conversation_state
    conversation_state = {
        'stage': 'name',
        'patient_details': {},
        'follow_up_index': 0,
        'follow_up_responses': {}
    }
    return jsonify({
        "status": "start", 
        "message": "Hello, I'm Dr. Lah Wada, your OB-GYN specialist. Let's ensure you're doing well. May I have your name?"
    })

@app.route('/process_message', methods=['POST'])
def process_message():
    global conversation_state
    user_message = request.json.get('message', '').strip()

    if conversation_state.get('stage') == 'name':
        conversation_state['patient_details']['Patient Name'] = user_message
        conversation_state['stage'] = 'age'
        return jsonify({
            "status": "continue", 
            "message": f"Nice to meet you, {user_message}! How old are you?"
        })

    elif conversation_state.get('stage') == 'age':
        conversation_state['patient_details']['Age'] = user_message
        conversation_state['stage'] = 'gestational_age'
        return jsonify({
            "status": "continue", 
            "message": f"You are {user_message} years old. How many months pregnant are you?"
        })

    elif conversation_state.get('stage') == 'gestational_age':
        conversation_state['patient_details']['Gestational Age'] = user_message
        conversation_state['stage'] = 'primary_concern'
        return jsonify({
            "status": "continue", 
            "message": f"You are {user_message} months pregnant. What seems to be the problem today? Please describe in detail."
        })

    elif conversation_state.get('stage') == 'primary_concern':
        conversation_state['patient_details']['Primary Concern'] = user_message
        
        # Generate medical data
        ecg_data = dr_lawda.generate_ecg_signal()
        bp, hr, spo2, temp = dr_lawda.simulate_vital_signs()

        # LLM interaction for prognosis
        prognosis = get_llm_response(conversation_state['patient_details'], bp, hr, spo2, temp, ecg_data)
        conversation_state['prognosis'] = prognosis
        
        # Move to follow-up questions
        conversation_state['stage'] = 'follow_up'
        
        return jsonify({
            "status": "prognosis",
            "message": prognosis,
            "next_question": FOLLOW_UP_QUESTIONS[0]
        })

    elif conversation_state.get('stage') == 'follow_up':
        current_question = FOLLOW_UP_QUESTIONS[conversation_state['follow_up_index']]
        conversation_state['follow_up_responses'][current_question] = user_message
        
        # Get LLM response for follow-up
        follow_up_response = get_follow_up_response(
            conversation_state['patient_details'],
            current_question,
            user_message
        )

        # Move to next question or finish
        conversation_state['follow_up_index'] += 1
        
        if conversation_state['follow_up_index'] < len(FOLLOW_UP_QUESTIONS):
            next_question = FOLLOW_UP_QUESTIONS[conversation_state['follow_up_index']]
            return jsonify({
                "status": "follow_up",
                "message": follow_up_response,
                "next_question": next_question
            })
        else:
            conversation_state['stage'] = 'open_questions'
            return jsonify({
                "status": "follow_up",
                "message": follow_up_response,
                "next_question": "Do you have any further questions? (Type 'exit' to end)"
            })

    elif conversation_state.get('stage') == 'open_questions':
        if user_message.lower() == 'exit':
            # Generate PDF report
            pdf_path = generate_pdf_report(conversation_state)
            conversation_state['pdf_path'] = pdf_path
            
            return jsonify({
                "status": "end",
                "message": "Thank you for consulting me. Take care, and I wish you a safe and healthy pregnancy!",
                "pdf_available": True
            })
        
        # Handle open questions
        response = get_open_question_response(conversation_state, user_message)
        return jsonify({
            "status": "open_question",
            "message": response,
            "next_question": "Do you have any further questions? (Type 'exit' to end)"
        })

    return jsonify({"status": "error", "message": "Something went wrong. Let's start over."})

@app.route('/download_report', methods=['GET'])
def download_report():
    if 'pdf_path' in conversation_state:
        return send_file(
            conversation_state['pdf_path'],
            as_attachment=True,
            download_name="Pregnancy_Report.pdf"
        )
    return jsonify({"error": "No report available"})

@app.route('/send_whatsapp', methods=['POST'])
def send_whatsapp():
    try:
        account_sid = 'AC391bfc5c5b70a6ac3255b7f924e2f080'
        auth_token = 'a9ace9ee9b5afd8ed0b74b674a3e9ccc'
        client = Client(account_sid, auth_token)

        if 'pdf_path' not in conversation_state:
            pdf_path = generate_pdf_report(conversation_state)
            conversation_state['pdf_path'] = pdf_path
        else:
            pdf_path = conversation_state['pdf_path']

        from_number = 'whatsapp:+919591508291'
        to_number = 'whatsapp:+917975102679'

        client.messages.create(
            from_=from_number,
            body="Hello! Your medical report is ready. Please find the attached report.",
            to=to_number
        )

        return jsonify({"status": "success", "message": "WhatsApp message sent successfully!"})

    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to send WhatsApp message: {str(e)}"})


def get_llm_response(patient_details, bp, hr, spo2, temp, ecg_data):
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

    Provide a detailed prognosis and recommendations.
    """
    
    try:
        response = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {LLAMA_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3.1-405b",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.5,
                "max_tokens": 2000,
            }
        )
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Error generating response: {str(e)}"

def get_follow_up_response(patient_details, question, answer):
    prompt = f"""
    Based on the patient's details:
    - Name: {patient_details['Patient Name']}
    - Gestational Age: {patient_details['Gestational Age']} months
    - Question: {question}
    - Patient's Response: {answer}

    Provide specific recommendations or explanations addressing this response.
    """
    
    try:
        response = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {LLAMA_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3.1-405b",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.5,
                "max_tokens": 1000,
            }
        )
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Error generating response: {str(e)}"

def get_open_question_response(conversation_state, question):
    prompt = f"""
    Based on the patient's details:
    - Name: {conversation_state['patient_details']['Patient Name']}
    - Age: {conversation_state['patient_details']['Age']}
    - Gestational Age: {conversation_state['patient_details']['Gestational Age']} months
    - Question: {question}

    Provide a professional response.
    """
    
    try:
        response = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {LLAMA_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3.1-405b",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.5,
                "max_tokens": 1000,
            }
        )
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Error generating response: {str(e)}"

def generate_pdf_report(conversation_state):
    pdf = PregnancyReportPDF()
    
    report_data = {
        "Patient Name": conversation_state['patient_details']['Patient Name'],
        "Age": conversation_state['patient_details']['Age'],
        "Gestational Age": conversation_state['patient_details']['Gestational Age'],
        "Prognosis": conversation_state['prognosis']
    }
    
    pdf.add_report_page(report_data)
    
    filename = f"Pregnancy_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    pdf.output(filename)
    return filename

if __name__ == '__main__':
    app.run(debug=True)
