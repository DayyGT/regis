const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const FIREBASE = "https://webs-50d23-default-rtdb.asia-southeast1.firebasedatabase.app/";

// REGISTER
app.post("/register", async (req, res) => {
    const { discord, password } = req.body;

    if (!discord || !password) {
        return res.json({ status: false, msg: "DATA KOSONG" });
    }

    let check = await fetch(FIREBASE + "users/" + discord + ".json").then(r => r.json());

    if (check) {
        return res.json({ status: false, msg: "AKUN SUDAH ADA" });
    }

    await fetch(FIREBASE + "users/" + discord + ".json", {
        method: "PUT",
        body: JSON.stringify({
            password: password,
            active: true
        })
    });

    res.json({ status: true, msg: "REGISTER SUCCESS" });
});

// LOGIN
app.post("/login", async (req, res) => {
    const { discord, password } = req.body;

    let data = await fetch(FIREBASE + "users/" + discord + ".json").then(r => r.json());

    if (!data) return res.json({ status: false, msg: "AKUN TIDAK ADA" });
    if (!data.active) return res.json({ status: false, msg: "NONAKTIF" });
    if (data.password !== password) return res.json({ status: false, msg: "PASSWORD SALAH" });

    res.json({ status: true, msg: "LOGIN SUCCESS" });
});

app.listen(3000, () => console.log("API RUNNING"));
