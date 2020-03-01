const url = 'http://127.0.0.1:3333/logout'

document.getElementById("logout-button").onclick = () => {
    
    fetch(url, {
        method: 'POST'
    })
    .then({})
}