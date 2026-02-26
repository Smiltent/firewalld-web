
// "pro tips"
const PROTIPS = {
    "pc": "pro tip: there is no login form, just write and enter",
    "phone": "pro tip: lol, im not supporting mobile devices... yet"
}

// elements
const proTipElement = document.getElementById("index-protip")
const passwordElement = document.getElementById("index-passwd")

// check if the user is on a portable cellurar 
const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
)

const TYPESPEED = 100
const DELAY = TYPESPEED + 400
var LOGGEDIN = false

async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// typewriter effect
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

// pro tip for start page
function runProTip() {
    if (LOGGEDIN) return
    const tip = isMobile ? PROTIPS.phone : PROTIPS.pc

    proTipElement.style.opacity = 0.05
    type(proTipElement, tip, TYPESPEED)
}

function displayModal(type, msg) {
    const modalContainer = document.querySelector(".modal-container")

    const modal = document.createElement("div")
    modal.classList.add("modal", `modal-${type}`)
    
    const h2 = document.createElement("h2")
    h2.innerText = type.toLowerCase()

    const p = document.createElement("p")
    p.innerText = msg 

    modal.appendChild(h2)
    modal.appendChild(p)

    modalContainer.appendChild(modal)

    // i don't get it... previously i made it request an animation frame - that didn't work, 
    // but when I add 2 WHOLE MILISECONDS IT WORKS?!?!?
    setTimeout(() => {
        modal.style.opacity = "1"
    }, 2)

    setTimeout(() => {
        modal.style.opacity = "0"

        modal.addEventListener("transitionend", () => {
            modal.remove()
        }, { once: true })
    }, 1700)
}

// check if the user logs in with a valid password,
// then redirect
async function checkLogin(password) {
    if (LOGGEDIN) return
    if (!password) return

    const res = await fetch("/a", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password })
    })

    if (!res.ok) {
        displayModal("bad", await res.text())
        return
    }

    LOGGEDIN = true

    const dashboard = await fetch("/d")
    const html = await dashboard.text()
    const doc = new DOMParser().parseFromString(html, "text/html")

    document.body.classList.add("fadeOut")

    await wait(1200)
    
    document.head.innerHTML = doc.head.innerHTML
    document.body.innerHTML = doc.body.innerHTML
    await import("/public/js/dashboard.js")

    document.body.classList.remove("fadeOut")        
    history.pushState(null, "", "/d")
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(runProTip, 10000)
})

// password input listening
var passwordBuffer = ""
document.addEventListener("keydown", (e) => {
    if (LOGGEDIN) return

    if (e.key.length === 1) {
        passwordBuffer += e.key;
    }

    if (e.key === "Enter") {
        checkLogin(passwordBuffer)

        passwordBuffer = ""
    }
})

// support for autofill - only tested with BitWarden w/ Firefox
passwordElement.addEventListener("input", (e) => {
    checkLogin(passwordElement.value)
})