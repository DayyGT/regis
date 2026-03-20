const express = require("express");
const fetch = require("node-fetch");

const app = express();

const FIREBASE = "https://webs-50d23-default-rtdb.asia-southeast1.firebasedatabase.app/";
const SECRET = "DAYY_PRIVATE_123";

// =========================
// REGISTER
// =========================
app.get("/register", async (req, res) => {
app.get("/register", async (req, res) => {
    try {
        const { discord, password, key } = req.query;

        if (key !== SECRET) return res.send("forbidden");
        if (!discord || !password) return res.send("invalid");

        const url = FIREBASE + "users/" + discord + ".json";

        let user = await fetch(url).then(r => r.json());

        if (user !== null) {
            return res.send("exists");
        }

        // 🔥 WRITE KE FIREBASE
        let fb = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                active: true
            })
        });

        let fbText = await fb.text()

        console.log("FIREBASE RES:", fbText)

        // 🔥 CEK BERHASIL ATAU NGGAK
        if (fbText.includes("error")) {
            return res.send("firebase error");
        }

        return res.send("success");

    } catch (e) {
        console.log("ERROR REGISTER:", e);
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

        const url = FIREBASE + "users/" + discord + ".json";

        let user = await fetch(url).then(r => r.json());

        if (!user) return res.send("not found");
        if (!user.active) return res.send("inactive");
        if (user.password !== password) return res.send("wrong");

        console.log("LOGIN:", discord);

        return res.send("success");

    } catch (e) {
        console.log("ERROR LOGIN:", e);
        return res.send("error");
    }
});

// =========================
// ROOT
// =========================
app.get("/", (req, res) => {
    res.send("API RUNNING SECURE");
});

app.listen(3000, () => console.log("Server running"));
