const loginForm = document.querySelector('form')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const messageOne = document.querySelector('#message-1')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const emailId = email.value
    const pass = password.value

    messageOne.textContent = 'Loading...'

    fetch('/users/login?email=' + emailId + '&password=' + pass).then((response) => {
        response.json().then((data) => {
            console.log(data)
            if(data.error){
                messageOne.textContent = data.error
            }else{
                messageOne.textContent = "Login Successful"
            }
        })
    })
})