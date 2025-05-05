from flask import Flask, render_template, request, jsonify
import MySQLdb
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = "lendo001"

# MySQL Configuration
db_config = {
    'host': '10.2.2.202',
    'user': 'xxlendoxx1',
    'password': 'lendo001',
    'database': 'spillmeny_db',
    'port': 3306
}

def get_db_connection():
    return MySQLdb.connect(**db_config)

@app.route('/save_pizza', methods=['POST'])
def save_pizza():
    data = request.get_json()
    score = data.get('score')
 
    if score is None:
        return jsonify({"error": "Invalid data"}), 400
 
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
 
        cursor.execute('INSERT INTO pizza_save (score) VALUES (%s)', (score,))
        conn.commit()
        cursor.close()
        conn.close()
 
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
@app.route('/get_score', methods=['GET'])
def get_score():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
 
        cursor.execute('SELECT MAX(score) FROM pizza_save')
        row = cursor.fetchone()
        score = row[0] if row and row[0] is not None else 0
 
        cursor.close()
        conn.close()
        return jsonify({"score": score}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
@app.route('/')
def home():
    return render_template("index.htm")

@app.route('/registrer')
def registrer():
    return render_template("registrer.htm")

@app.route('/logginn')
def logginn():
    return render_template("logginn.htm")
 
@app.route('/pizzaclicker')
def pizza_clicker():
    return render_template("pizzaclicker.htm")

@app.route('/tictactoe')
def tictactoe():
    return render_template("tictactoe.htm")

@app.route("/tictactoe_menu")
def tictactoe_menu():
    return render_template("tic-tac-toe-menu.htm")

@app.route("/tictactoe_ai")
def tictactoe_ai():
    return render_template("tictactoe-ai.htm")
@app.route("/designprofil")
def designprofil():
    return render_template("designprofil.htm")

if __name__ == '__main__':
    app.run(debug=True, host= '0.0.0.0')