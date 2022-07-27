const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')


update.addEventListener('click', _ => {
fetch ('/stories', {
    method: 'put',
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify({
        Author: 'a successor to Mo',
        Story: 'the story written by Mohamed was replaced'
    })
}).then(res => {
    if (res.ok) return res.json()
})
.then(response => {
    window.location.reload(true)
})

})



deleteButton.addEventListener('click', _ => {

    fetch('/stories', {
        method: 'delete',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({
Author: 'Mohamed'
        })
    }).then(res => {
        if (res.ok) return res.json() 
    }).then(data => {
        window.location.reload()
    })
})