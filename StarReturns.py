from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
import mysql.connector
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)
app.secret_key = "lendo001"  # 🔐 Nødvendig for å bruke session

def get_db_connection():
    return mysql.connector.connect(
        host="10.2.2.225",
        user="leandro",
        password="lendo001",
        database="spillmeny_db"
    )

def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS brukere (
            id INT AUTO_INCREMENT PRIMARY KEY,
            navn VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            passord VARCHAR(255) NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pizza_save (
            id INT AUTO_INCREMENT PRIMARY KEY,
            score INT NOT NULL,
            bruker_id INT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tictactoe (
            id INT AUTO_INCREMENT PRIMARY KEY,
            score INT NOT NULL,
            bruker_id INT
        )
    """)

    conn.commit()
    cursor.close()
    conn.close()

# Kjør ved oppstart
create_tables()

@app.route('/')
def home():
    if 'bruker_id' not in session:  # 🔐 Krever innlogging
        flash("Du må være logget inn for å få tilgang til forsiden.", "error")
        return redirect(url_for('logginn'))
    return render_template("index.htm")

@app.route('/registrer', methods=['GET', 'POST'])
def registrer():
    if request.method == 'POST':
        navn = request.form.get('navn')
        email = request.form.get('email')
        passord = request.form.get('passord')

        if not navn or not email or not passord:
            flash("Alle felt må fylles ut", "error")
            return redirect(url_for('registrer'))

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            hashed_password = generate_password_hash(passord, method='pbkdf2:sha256', salt_length=8)
            query = "INSERT INTO brukere (navn, email, passord) VALUES (%s, %s, %s)"
            cursor.execute(query, (navn, email, hashed_password))
            conn.commit()
            cursor.close()
            conn.close()
            flash("Bruker registrert!", "success")
            return redirect(url_for('logginn'))
        except mysql.connector.Error as err:
            flash(f"Databasefeil: {err}", "error")
            return redirect(url_for('registrer'))

    return render_template("registrer.htm")

@app.route('/logginn', methods=['GET', 'POST'])
def logginn():
    if request.method == 'POST':
        email = request.form.get('email')
        passord = request.form.get('passord')

        if not email or not passord:
            flash("Alle felt må fylles ut", "error")
            return redirect(url_for('logginn'))

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM brukere WHERE email = %s", (email,))
        bruker = cursor.fetchone()

        if bruker and check_password_hash(bruker['passord'], passord):
            session['bruker_id'] = bruker['id']
            session['navn'] = bruker['navn']
            flash(f"Velkommen, {bruker['navn']}!", "success")
            return redirect(url_for('home'))
        else:
            flash("Feil e-post eller passord", "error")
        return redirect(url_for('logginn'))


    return render_template("logginn.htm")

@app.route('/loggut')
def loggut():
    session.clear()  # Logg ut
    flash("Du er logget ut", "success")
    return redirect(url_for('logginn'))

@app.route('/save_pizza', methods=['POST'])
def save_pizza():
    if 'bruker_id' not in session:
        return jsonify({"error": "Ikke logget inn"}), 403

    data = request.get_json()
    score = data.get('score')

    if score is None:
        return jsonify({"error": "Ugyldig data"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Sjekk om samme score allerede er lagret for denne brukeren
        cursor.execute('SELECT id FROM pizza_save WHERE score = %s AND bruker_id = %s', (score, session['bruker_id']))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"success": False, "message": "Denne scoren er allerede lagret."}), 200

        # Hvis ikke, lagre ny score
        cursor.execute('INSERT INTO pizza_save (score, bruker_id) VALUES (%s, %s)', (score, session['bruker_id']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_score', methods=['GET'])
def get_score():
    if 'bruker_id' not in session:
        return jsonify({"error": "Ikke logget inn"}), 403

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Hent høyeste score for innlogget bruker
        cursor.execute('SELECT MAX(score) FROM pizza_save WHERE bruker_id = %s', (session['bruker_id'],))
        row = cursor.fetchone()
        score = row[0] if row and row[0] is not None else 0
        cursor.close()
        conn.close()
        return jsonify({"score": score}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/pizzaclicker')
def pizza_clicker():
    if 'bruker_id' not in session:
        flash("Du må være logget inn for å spille.", "error")
        return redirect(url_for('registrer'))
    return render_template("pizzaclicker.htm")

@app.route('/tictactoe')
def tictactoe():
    if 'bruker_id' not in session:
        flash("Du må være logget inn for å spille.", "error")
        return redirect(url_for('registrer'))
    return render_template("tictactoe.htm")

@app.route("/tictactoe_menu")
def tictactoe_menu():
    if 'bruker_id' not in session:
        flash("Du må være logget inn for å bruke menyen.", "error")
        return redirect(url_for('registrer'))
    return render_template("tic-tac-toe-menu.htm")

@app.route("/tictactoe_ai")
def tictactoe_ai():
    if 'bruker_id' not in session:
        flash("Du må være logget inn for å spille.", "error")
        return redirect(url_for('registrer'))
    return render_template("tictactoe-ai.htm")

@app.route("/designprofil")
def designprofil():
    if 'bruker_id' not in session:
        flash("Du må være logget inn for å se profilen.", "error")
        return redirect(url_for('registrer'))
    return render_template("designprofil.htm")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
