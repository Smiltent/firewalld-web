
// "pro tips"
const userLoginProTip = "pro tip: there is no login form, just write and enter"
const mobileProTip = "pro tip: lol, im not supporting mobile devices"

// elements
const proTipElement = document.getElementById("index-protip")
const passwordElement = document.getElementById("index-passwd")

// check if the user is on a mobile device
const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
)

const TYPESPEED = 100
const DELAY = 500

function type(element, text, speed) {
    element.innerText = ""

    var idx = 0
    var lastTime = 0
    var delay = speed

    function step(timestamp) {
        if (timestamp - lastTime >= delay) {

            element.innerText += text[idx]

            delay = text[idx] === "," || text[idx] === ":" ? DELAY : speed

            idx++
            lastTime = timestamp
        }

        if (idx < text.length) {
            requestAnimationFrame(step)
        }
    }

    requestAnimationFrame(step)
}

function runProTip() {
    const tip = isMobile ? mobileProTip : userLoginProTip

    proTipElement.style.opacity = 0.05
    
    type(proTipElement, tip, TYPESPEED)
}

async function checkLogin(password) {
    document.body.classList.add("fade")

    const res = await fetch("/authorize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password })
    })

    if (res.ok) {
        const dashboard = await fetch("/dashboard")
        const html = await dashboard.text()

        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")

        const content = doc.body.innerHTML

        document.body.classList.add("fadeOut")

        setTimeout(async () => {
            document.body.innerHTML = content

            document.body.classList.remove("fadeOut")
            history.pushState(null, "", "/dashboard")

        }, 1200)

    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(runProTip, 10000)
})

var passwordBuffer = ""
document.addEventListener("keydown", (e) => {
    if (e.key.length === 1) {
        passwordBuffer += e.key;
    }

    if (e.key === "Enter") {
        checkLogin(passwordBuffer)

        passwordBuffer = ""
    }

    if (passwordBuffer.length > 200) passwordBuffer = passwordBuffer.slice(-200);
})

passwordElement.addEventListener("input", (e) => {
    checkLogin(passwordElement.value)
})