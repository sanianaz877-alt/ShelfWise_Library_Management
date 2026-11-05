from flask import Flask, request, jsonify, session, redirect, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from pathlib import Path
import sqlite3, os, json
from functools import wraps

BASE = Path(__file__).resolve().parent
DB = BASE / "shelfwise.db"
app = Flask(__name__, static_folder=None)
app.secret_key = os.environ.get("SHELFWISE_SECRET", "change-this-secret-before-hosting")

def db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with db() as c:
        c.executescript("""
        CREATE TABLE IF NOT EXISTS users(
          id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS app_data(
          id INTEGER PRIMARY KEY CHECK(id=1), books TEXT NOT NULL,
          students TEXT NOT NULL, issues TEXT NOT NULL
        );
        """)
        c.execute("INSERT OR IGNORE INTO app_data(id,books,students,issues) VALUES(1,'[]','[]','[]')")

def login_required(fn):
    @wraps(fn)
    def wrapped(*args, **kwargs):
        if not session.get("user_id"):
            return jsonify({"error":"Please sign in first."}), 401
        return fn(*args, **kwargs)
    return wrapped

@app.get("/")
def root():
    return redirect("/login.html" if not session.get("user_id") else "/index.html")

@app.get("/<path:name>")
def pages(name):
    # Serve only files contained in the project folder.
    p = (BASE / name).resolve()
    if BASE not in p.parents or not p.is_file():
        return "Not found", 404
    protected = name in {"index.html","books.html","students.html","issue.html","returns.html","reports.html"}
    if protected and not session.get("user_id"):
        return redirect("/login.html")
    if name == "login.html" and session.get("user_id"):
        return redirect("/index.html")
    return send_from_directory(BASE, name)

@app.post("/api/register")
def register():
    data = request.get_json(silent=True) or {}
    name, email, password = (data.get("name") or "").strip(), (data.get("email") or "").strip().lower(), data.get("password") or ""
    if not name or not email or len(password) < 6:
        return jsonify({"error":"Enter your name, valid email and a password of at least 6 characters."}), 400
    with db() as c:
        count = c.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        role = "Admin" if count == 0 else "Librarian"
        try:
            cur = c.execute("INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)",
                            (name,email,generate_password_hash(password),role))
        except sqlite3.IntegrityError:
            return jsonify({"error":"This email is already registered."}), 409
        session.update(user_id=cur.lastrowid, name=name, email=email, role=role)
    return jsonify({"ok":True,"user":{"name":name,"email":email,"role":role}})

@app.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}
    email, password = (data.get("email") or "").strip().lower(), data.get("password") or ""
    with db() as c:
        user = c.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error":"Incorrect email or password."}), 401
    session.update(user_id=user["id"], name=user["name"], email=user["email"], role=user["role"])
    return jsonify({"ok":True,"user":{"name":user["name"],"email":user["email"],"role":user["role"]}})

@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"ok":True})

@app.get("/api/me")
@login_required
def me():
    return jsonify({"name":session["name"],"email":session["email"],"role":session["role"]})

@app.get("/api/data")
@login_required
def get_data():
    with db() as c:
        row = c.execute("SELECT books,students,issues FROM app_data WHERE id=1").fetchone()
    return jsonify({k:json.loads(row[k]) for k in ("books","students","issues")})

@app.post("/api/data")
@login_required
def save_data():
    data = request.get_json(silent=True) or {}
    current = get_data().json
    for key in ("books","students","issues"):
        if key in data and isinstance(data[key], list):
            current[key] = data[key]
    with db() as c:
        c.execute("UPDATE app_data SET books=?,students=?,issues=? WHERE id=1",
                  tuple(json.dumps(current[k]) for k in ("books","students","issues")))
    return jsonify({"ok":True})

@app.get("/api/health")
def health():
    return jsonify({"status":"ok","database":"SQLite"})

if __name__ == "__main__":
    init_db()
    print("\\nShelfWise is running at http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=False)
