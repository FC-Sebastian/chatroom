const push = require("web-push");
const express = require("express");
const body = require("body-parser");
const path = require("path");

const vapidKeys = {
    public : "BJZcNaD_fVWmvykZGfwSYFKYZ8IrRRpw-TO_SVYJ6WZqmi1emuHVVWR4L-U4yJfrWJwb03ygy4dHNTi-nh2p11I",
    private : "vMuXDvpHuZc-cSCBCQ8AUg3arX4Irg0nEqT2_u5w6yw"
}

const app = new express;

push.setVapidDetails(
    "mailto:test@mail.com",
    vapidKeys.public,
    vapidKeys.private
);

app.post