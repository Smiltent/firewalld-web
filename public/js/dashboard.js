
async function loadPage(page) {
    const response = await fetch("/p/" + page)

    document.querySelector(".content").innerHTML = await response.text()
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

    loadPage(hash ? hash : "main")
})

document.getElementById("logout").addEventListener("click", async () => {
    location.href = "/l"
})

document.getElementById("theme").addEventListener("click", async () => {
    if (localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light')
        document.documentElement.setAttribute("data-theme", "light")
    } else {
        localStorage.setItem('theme', 'dark')
        document.documentElement.setAttribute("data-theme", "dark")
    }
})