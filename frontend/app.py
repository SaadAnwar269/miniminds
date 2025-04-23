from flask import Flask, render_template, request, redirect, session, flash, send_file
from azure.storage.blob import BlobServiceClient
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key'  # Change this in production

# 🔗 Azure Blob Storage Setup
connect_str = "DefaultEndpointsProtocol=https;AccountName=minimindsrg9f5a;AccountKey=Uu9m8m8qUuy+Zz8xwwELLCP+j5wwptJK5ayL5IgKxepGkXoxPRf7mNs25u09u2/49ET9deNN3MwC+AStsgaP/A==;EndpointSuffix=core.windows.net"  # Replace with your real connection string
container_name = "progress"  # Make sure this container exists in Azure
blob_service_client = BlobServiceClient.from_connection_string(connect_str)
container_client = blob_service_client.get_container_client(container_name)

# 🌐 Route: Login Page (renders your HTML form with userId)
@app.route('/')
def welcome():
    return render_template('index.html')  # The HTML with userId form

# 🔐 Route: Handles login and user blob check/init
@app.route('/user_login', methods=['POST'])
def user_login():
    user_id = request.form.get('user_id')
    if not user_id:
        flash("User ID is required.")
        return redirect('/')

    session['user_id'] = user_id
    session['email'] = user_id  # Reusing 'email' convention from your existing structure

    # Check for user progress blob
    blob_path = f"{user_id}/progress.txt"
    blob_client = container_client.get_blob_client(blob_path)

    try:
        blob_client.get_blob_properties()
    except Exception:
        # Blob doesn't exist, create it
        content = f"UserId: {user_id}\nLevel: 0\nScore: 0"
        blob_client.upload_blob(content, overwrite=True)

    flash(f"Welcome, {user_id}! Your progress has been loaded.", "success")
    return redirect('/dashboard')

# 📊 Route: Shows progress
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

# 🌍 Routes for other pages (rendering templates)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/alphabet')
def alphabet():
    return render_template('alphabet.html')

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

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
    return render_template('progress.html')

@app.route('/rewards')
def rewards():
    return render_template('rewards.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/shapes')
def shapes():
    return render_template('shapes.html')

if __name__ == '__main__':
    app.run(debug=True)
