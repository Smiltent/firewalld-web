
async function loadPage(page) {
    const response = await fetch("/p/" + page)

    if (response.ok) {
        document.querySelector(".content").innerHTML = await response.text()
    } else {
        location.href = "/l"    
    }
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

document.querySelectorAll(".page").forEach(page => {
    page.addEventListener("click", async (e) => {
        if (e.target.id == "h-selected") return

        window.location.hash = e.target.getAttribute("value")

        document.querySelector("#h-selected").id = ""
        e.target.id = "h-selected"

        loadPage(e.target.getAttribute("value"))
    })
})

document.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash.slice(1)

    document.querySelectorAll(".page").forEach(page => {
        if (page.getAttribute("value") === hash) {
            document.querySelector("#h-selected").id = ""
            page.id = "h-selected"
        }
    })

    loadPage(hash || "main")

    const saved = localStorage.getItem("theme")
    if (saved) document.documentElement.setAttribute("data-theme", saved)
})

document.getElementById("logout").addEventListener("click", async () => {
    location.href = "/l"
})

document.getElementById("theme").addEventListener("click", async () => {
    const next = localStorage.getItem("theme") === "dark" ? "light" : "dark"
    localStorage.setItem("theme", next)
    document.documentElement.setAttribute("data-theme", next)
})

window.deleteRule = async (nr) => {
    try {
        const res = await fetch(`/d/rule/${nr}`, { method: "DELETE" })
        const data = await res.json()

        if (data.type === "ok") {
            displayModal("good", "rule deleted")
            loadPage("rules")
        } else {
            displayModal("bad", "failed to delete rule")
        }
    } catch (err) {
        displayModal("bad", err)
    }
}

async function post(path, body) {
    const res = await fetch (path, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body)
    })

    return res.json()
}

window.addIp = async () => {
    const ip = document.getElementById("ip-addr").value.trim()
    const target = document.getElementById("ip-target").value    

    if (!ip) return displayModal("bad", "ip required")

    const data = await post("/d/ip", { ip, target })

    if (data.type === "ok") {
        displayModal("good", `rule added ${target.toLowerCase()} ${ip}`)

        document.getElementById("ip-addr").value = ""
    } else {
        displayModal("bad", "failed to add rule")
    }
}

window.addPort = async () => {
    const port = document.getElementById("port-num").value.trim()
    const target = document.getElementById("port-target").value    
    const protocol = document.getElementById("port-protocol").value

    if (!port) return displayModal("bad", "port required")

    const data = await post("/d/port", { port, target, protocol })

    if (data.type === "ok") {
        displayModal("good", `rule added ${target.toLowerCase()} ${port}/${protocol}`)

        document.getElementById("port-num").value = ""
    } else {
        displayModal("bad", "failed to add rule")
    }
}

window.addIpPort = async () => {
    const ip = document.getElementById("ipport-ip").value.trim()
    const port = document.getElementById("ipport-port").value.trim()
    const target = document.getElementById("ipport-target").value    
    const protocol = document.getElementById("ipport-protocol").value

    if (!ip || !port) return displayModal("bad", "ip and port required")

    const data = await post("/d/ipport", { ip, port, target, protocol })

    if (data.type === "ok") {
        displayModal("good", `rule added ${target.toLowerCase()} ${ip}:${port}/${protocol}`)

        document.getElementById("ipport-ip").value = ""
        document.getElementById("ipport-port").value = ""
    } else {
        displayModal("bad", "failed to add rule")
    }
}

window.addRichRule = async () => {
    const protocol = document.getElementById("rr-protocol").value
    const target = document.getElementById("rr-target").value
    const source = document.getElementById("rr-source").value.trim()
    const destination = document.getElementById("rr-destination").value.trim()
    const sourcePort = document.getElementById("rr-sport").value.trim()
    const destinationPort = document.getElementById("rr-dport").value.trim()

    const data = await post("/d/richrule", {
        protocol, target,
        ...(source && { source }),
        ...(destination && { destination }),
        ...(sourcePort && { sourcePort }),
        ...(destinationPort && { destinationPort }),
    })

    if (data.type === "ok") {
        displayModal("good", `rule added!`)

        ["rr-source", "rr-destination", "rr-sport", "rr-dport"].forEach(id => {
            document.getElementById(id).value = ""
        })
    } else {
        displayModal("bad", "failed to add rule")
    }
}