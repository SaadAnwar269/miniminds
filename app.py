from flask import Flask, jsonify, render_template, request, redirect, session, flash, send_file
from azure.storage.blob import BlobServiceClient
import os
from gemini_chat import chat_with_gemini

app = Flask(__name__)
app.secret_key = 'your-secret-key'  # Change this in production

# 🔗 Azure Blob Storage Setup
connect_str = "DefaultEndpointsProtocol=https;AccountName=minimindsrg9f5a;AccountKey=Uu9m8m8qUuy+Zz8xwwELLCP+j5wwptJK5ayL5IgKxepGkXoxPRf7mNs25u09u2/49ET9deNN3MwC+AStsgaP/A==;EndpointSuffix=core.windows.net"
container_name = "progress"
blob_service_client = BlobServiceClient.from_connection_string(connect_str)
container_client = blob_service_client.get_container_client(container_name)

# 🌐 Route: Welcome Page
@app.route('/')
def welcome():
    return render_template('index.html')

# 🔐 Route: User Login and Progress Setup
@app.route('/user_login', methods=['POST'])
def user_login():
    user_id = request.form.get('user_id')
    if not user_id:
        flash("User ID is required.")
        return redirect('/')

    session['user_id'] = user_id
    session['email'] = user_id

    blob_path = f"{user_id}/progress.txt"
    blob_client = container_client.get_blob_client(blob_path)

    try:
        blob_client.get_blob_properties()
    except Exception:
        content = f"UserId: {user_id}\nLevel: 0\nScore: 0"
        blob_client.upload_blob(content, overwrite=True)

    flash(f"Welcome, {user_id}! Your progress has been loaded.", "success")
    return redirect('/dashboard')

# 📊 Route: Dashboard (Progress)
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect('/')

    user_id = session['user_id']
    blob_path = f"{user_id}/progress.txt"
    progress_text = None

    try:
        blob_client = container_client.get_blob_client(blob_path)
        progress_text = blob_client.download_blob().readall().decode()
    except Exception:
        flash("Could not load your progress file.", "danger")

    return render_template('home.html', progress_text=progress_text, user_id=user_id)

# 🚪 Route: Logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

# 🌍 Other Routes (Pages)
@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/alphabet')
def alphabet():
    return render_template('alphabet.html')

# 🗨️ Route: Chatbot (with updated instructions)
@app.route('/chatbot', methods=["GET", "POST"])
def chatbot():
    instructions = """
    Don't overdo formatting don't make text bold or italic or anything else just add spaces where necessary no need for additional bullet formatting keep it simple. You are an assistant for toddlers and children to understand simple things.
    Keep things friendly and concise with relatable examples.
    """

    if request.method == "POST":
        data = request.get_json()
        user_input = data.get("userMessage", "")
        prompt = instructions + "\nUser: " + user_input
        reply = chat_with_gemini(prompt)
        return jsonify({"reply": reply})
    else:
        return render_template("chatbot.html")

@app.route('/colors')
def colors():
    return render_template('colors.html')

@app.route('/facts')
def facts():
    return render_template('facts.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/game1')
def game1():
    return render_template('game1.html')

@app.route('/game2')
def game2():
    return render_template('game2.html')

@app.route('/game3')
def game3():
    return render_template('game3.html')

@app.route('/help')
def help_page():
    return render_template('help.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')

@app.route('/numbers')
def numbers():
    return render_template('numbers.html')

@app.route('/progress')
def progress():
    if 'user_id' not in session:
        return redirect('/')

    user_id = session['user_id']
    blob_path = f"{user_id}/progress.txt"

    try:
        blob_client = container_client.get_blob_client(blob_path)
        # Force re-download the latest file
        progress_text = blob_client.download_blob().readall().decode()
    except Exception:
        flash("Could not load your progress file.", "danger")
        progress_text = ""

    # Parse
    level = score = 0
    for line in progress_text.splitlines():
        if line.startswith("Level:"):
            level = int(line.split(":")[1].strip())
        elif line.startswith("Score:"):
            score = int(line.split(":")[1].strip())

    return render_template('progress.html', user_id=user_id, level=level, score=score)

@app.route('/rewards')
def rewards():
    return render_template('rewards.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/shapes')
def shapes():
    return render_template('shapes.html')

# ✨ New API: Update Progress after Game Completion
@app.route('/update_progress', methods=['POST'])
def update_progress():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session['user_id']
    data = request.get_json()
    score_increment = data.get('score_increment', 0)

    blob_path = f"{user_id}/progress.txt"
    blob_client = container_client.get_blob_client(blob_path)

    try:
        progress_text = blob_client.download_blob().readall().decode()
        level = 0
        score = 0

        lines = progress_text.splitlines()
        for line in lines:
            if line.startswith("Level:"):
                level = int(line.split(":")[1].strip())
            elif line.startswith("Score:"):
                score = int(line.split(":")[1].strip())

        # Update the score
        score += int(score_increment)

        # Recreate the progress content
        new_content = f"UserId: {user_id}\nLevel: {level}\nScore: {score}"

        # Upload updated progress
        blob_client.upload_blob(new_content, overwrite=True)

        return jsonify({"message": "Progress updated successfully", "new_score": score})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
