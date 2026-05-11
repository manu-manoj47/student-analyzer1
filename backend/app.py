from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def create_table():
    conn = sqlite3.connect("schedule.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student TEXT,
            subject TEXT,
            hours INTEGER,
            difficulty TEXT,
            priority TEXT,
            days TEXT,
            time TEXT,
            suggestion TEXT,
            performance TEXT
        )
    """)
    conn.commit()
    conn.close()

create_table()

@app.route("/")
def home():
    return "Student Scheduler Backend Running"

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    student    = data.get("student")
    subject    = data.get("subject")
    hours      = int(data.get("hours"))
    difficulty = data.get("difficulty")
    priority   = data.get("priority")
    days       = data.get("days")
    time       = data.get("time")

    if difficulty == "Hard" and priority == "High":
        suggestion = "Focus on mock tests, coding practice, and deep problem-solving sessions."
    elif difficulty == "Hard":
        suggestion = "Break topics into small chunks. Use active recall and spaced repetition."
    elif difficulty == "Medium":
        suggestion = "Revise concepts daily with short notes and practice problems."
    else:
        suggestion = "Quick revision and light practice is sufficient. Stay consistent."

    if hours >= 6:
        performance = "Excellent preparation level. You are well ahead."
    elif hours >= 4:
        performance = "Good preparation level. Keep maintaining this pace."
    elif hours >= 2:
        performance = "Average preparation. Try to increase daily study hours."
    else:
        performance = "Low preparation. Increase study hours immediately."

    conn = sqlite3.connect("schedule.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO schedules (student, subject, hours, difficulty, priority, days, time, suggestion, performance)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (student, subject, hours, difficulty, priority, days, time, suggestion, performance))
    conn.commit()
    conn.close()

    return jsonify({
        "student": student, "subject": subject, "hours": hours,
        "difficulty": difficulty, "priority": priority,
        "days": days, "time": time,
        "suggestion": suggestion, "performance": performance
    })

@app.route("/api/history", methods=["GET"])
def history():
    conn = sqlite3.connect("schedule.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schedules ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([{
        "id": r[0], "student": r[1], "subject": r[2], "hours": r[3],
        "difficulty": r[4], "priority": r[5], "days": r[6],
        "time": r[7], "suggestion": r[8], "performance": r[9]
    } for r in rows])

@app.route("/api/history/<int:id>", methods=["DELETE"])
def delete_history(id):
    conn = sqlite3.connect("schedule.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM schedules WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted successfully"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)