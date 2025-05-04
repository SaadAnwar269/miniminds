import google.generativeai as genai

# Direct API key setup — replace this with your actual Gemini API key
API_KEY = "Lalala"

# Configure Gemini
genai.configure(api_key=API_KEY)

# Load Gemini model
model = genai.GenerativeModel('gemini-2.0-flash')

# Function to generate chat response
def chat_with_gemini(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"
