const input = document.getElementById("input-url");
const output = document.getElementById("output-url");
const cccBtn = document.getElementById("ccc-button");
const copyBtn = document.getElementById("copy-button");

// init
input.addEventListener("keydown", e => e.code == "Enter" ? cccify() : null)

// mouse enter listener

let cccBtnInt;

cccBtn.addEventListener("mouseenter", () => cccBtnInt = setInterval(() => {
    console.log("a");
    if (cccBtn.innerText == "cCc") cccBtn.innerText = "CcC";
    else cccBtn.innerText = "cCc";
}, 200));

cccBtn.addEventListener("mouseleave", () => {
    clearInterval(cccBtnInt);
    // cccBtn.innerText = "cCc";
});


function cccify() {

    if (window.inBlinking) return

    try {
        new URL(input.value)
    } catch (e) {

        window.inBlinking = true

        input.style.opacity = 1
        input.disabled = true

        let oldValue = input.value
        input.value = "Invalid URL! No D:"

        let times = 0

        let i = setInterval(async () => {
            if (parseInt(input.style.opacity) == 1)
                input.style.opacity = 0.2;
            else
                input.style.opacity = 1;

            if (++times == 6) {
                clearInterval(i)
                input.value = oldValue
                input.disabled = false
                input.focus()
                inBlinking = false
            }
        }, 150)
        return
    }

    const domain = location.host;

    let url = new CCC().encodeUrl(input.value.trim());
    url = `${location.protocol}//${domain}/${url}`;

    // show the output div
    document.getElementById("output-div").style.display = "block";

    output.innerHTML = url;
    output.setAttribute("href", url);

    input.value = "";
}

function copy() {
    const el = document.createElement('textarea');
    el.value = output.innerHTML;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    copyBtn.parentNode.setAttribute("data-showme", "");
    setTimeout(() => copyBtn.parentNode.removeAttribute("data-showme"), 1000);
};
