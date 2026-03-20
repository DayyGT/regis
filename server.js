const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const FIREBASE = "https://webs-50d23-default-rtdb.asia-southeast1.firebasedatabase.app/";

// =========================
// REGISTER
// =========================
app.post("/register", async (req, res) => {
    const { discord, password } = req.body;

    if (!discord || !password) {
        return res.send("invalid");
    }

    const url = FIREBASE + "users/" + discord + ".json";

    let user = await fetch(url).then(r => r.json());

    if (user) {
        return res.send("exists");
    }

    await fetch(url, {
        method: "PUT",
        body: JSON.stringify({
            password: password,
            active: true
        })
    });

    return res.send("success");
});

// =========================
// LOGIN
// =========================
app.post("/login", async (req, res) => {
    const { discord, password } = req.body;

    if (!discord || !password) {
        return res.send("invalid");
    }

    const url = FIREBASE + "users/" + discord + ".json";

    let user = await fetch(url).then(r => r.json());

    if (!user) {
        return res.send("not found");
    }

    if (!user.active) {
        return res.send("inactive");
    }

    if (user.password !== password) {
        return res.send("wrong");
    }

    return res.send("success");
});

// =========================
// ROOT TEST
// =========================
app.get("/", (req, res) => {
    res.send("API RUNNING");
});

app.listen(3000, () => console.log("Server running"));
