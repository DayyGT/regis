const express = require("express");
const fetch = require("node-fetch");

const app = express();

const FIREBASE = "https://webs-50d23-default-rtdb.asia-southeast1.firebasedatabase.app/";

// =========================
// REGISTER (GET SUPPORT)
// =========================
app.get("/register", async (req, res) => {
    try {
        const { discord, password } = req.query;

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

    } catch (e) {
        console.log(e);
        return res.send("error");
    }
});

// =========================
// LOGIN (GET SUPPORT)
// =========================
app.get("/login", async (req, res) => {
    try {
        const { discord, password } = req.query;

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

    } catch (e) {
        console.log(e);
        return res.send("error");
    }
});

// =========================
// ROOT
// =========================
app.get("/", (req, res) => {
    res.send("API RUNNING");
});

app.listen(3000, () => console.log("Server running"));
