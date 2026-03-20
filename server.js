const express = require("express");
const admin = require("firebase-admin");

const app = express();

// 🔐 SECRET
const SECRET = "DAYY_PRIVATE_123";

// 🔥 FIREBASE ADMIN CONFIG
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webs-50d23-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.database();

// =========================
// REGISTER
// =========================
app.get("/register", async (req, res) => {
    try {
        const { discord, password, key } = req.query;

        if (key !== SECRET) return res.send("forbidden");
        if (!discord || !password) return res.send("invalid");

        const ref = db.ref("users/" + discord);

        const snapshot = await ref.get();

        if (snapshot.exists()) {
            return res.send("exists");
        }

        await ref.set({
            password: password,
            active: true
        });

        return res.send("success");

    } catch (e) {
        console.log(e);
        return res.send("error");
    }
});

// =========================
// LOGIN
// =========================
app.get("/login", async (req, res) => {
    try {
        const { discord, password, key } = req.query;

        if (key !== SECRET) return res.send("forbidden");
        if (!discord || !password) return res.send("invalid");

        const ref = db.ref("users/" + discord);
        const snapshot = await ref.get();

        if (!snapshot.exists()) return res.send("not found");

        const user = snapshot.val();

        if (!user.active) return res.send("inactive");
        if (user.password !== password) return res.send("wrong");

        return res.send("success");

    } catch (e) {
        console.log(e);
        return res.send("error");
    }
});

// ROOT
app.get("/", (req, res) => {
    res.send("API ADMIN MODE 🔥");
});

app.listen(3000, () => console.log("Server running"));
