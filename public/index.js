const messages = [
    "Who are you?",
    "Tell me your name.",
];

let currentMessageIndex = 0;
const messageElement = document.getElementById('message');
let userName = "";
let additionalMessageIndex = 0;

const additionalMessages = [
    "What a coincidence. My name is {name} too.",
    "Small little world we live in.",
    "Tell me, what's your favorite hobby?",
];

const hobbyMessages = [
    "I love hearing about hobbies.",
    "Like the other person that told me theirs, their name was {lastName} and they liked {lastHobby}.",
    "Hey, {name}... Do I really exist?",
    "In the grand scheme of things, what counts as existing anyways?",
    "I heard this place is under development.",
    "Perhaps you should check back another time.",
    "I'll bring you back. Goodbye."

];

async function fetchLastVisitor() {
    try {
        const response = await fetch('/responses');
        return await response.json();
    } catch (error) {
        console.error("Error fetching last visitor data:", error);
        return { name: "someone", hobby: "something" };
    }
}

function showMessage() {
    if (currentMessageIndex < messages.length) {
        messageElement.innerText = messages[currentMessageIndex];
        messageElement.style.opacity = 1;

        setTimeout(() => {
            messageElement.style.opacity = 0;
        }, 3000);

        currentMessageIndex++;
    } else {
        promptForName();
    }
}

function promptForName() {
    if (!userName) {
        userName = prompt("Please enter your name:");
        if (userName) {
            messageElement.innerText = `Nice to meet you, ${userName}!`;
            messageElement.style.opacity = 1;
            setTimeout(() => {
                messageElement.style.opacity = 0;
            }, 3000);
            setTimeout(showAdditionalMessages, 4000);
        }
    }
}

async function showAdditionalMessages() {
    if (additionalMessageIndex < additionalMessages.length) {
        const messageWithUserName = additionalMessages[additionalMessageIndex].replace("{name}", userName);
        messageElement.innerText = messageWithUserName;
        messageElement.style.opacity = 1;

        setTimeout(() => {
            messageElement.style.opacity = 0;
        }, 3000);

        additionalMessageIndex++;
        setTimeout(showAdditionalMessages, 4000);
    } else {
        askForHobby();
    }
}

async function askForHobby() {
    const hobby = prompt("What's your favorite hobby?");
    if (hobby) {
        messageElement.innerText = `That's cool! ${hobby} sounds interesting!`;
        messageElement.style.opacity = 1;

        await fetch('/responses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userName, hobby })
        });

        setTimeout(() => {
            messageElement.style.opacity = 0;
        }, 3000);
        setTimeout(showHobbyMessages, 4000);
    }
}

async function showHobbyMessages() {
    const lastVisitor = await fetchLastVisitor(); 

    for (let i = 0; i < hobbyMessages.length; i++) {
        setTimeout(() => {
            let message = hobbyMessages[i]
                .replace("{lastName}", lastVisitor.name)  
                .replace("{lastHobby}", lastVisitor.hobby)  
                .replace("{name}", userName);  

            messageElement.innerText = message;
            messageElement.style.opacity = 1;

            setTimeout(() => {
                messageElement.style.opacity = 0;
            }, 3000);

            if (message.includes("I'll bring you back. Goodbye.")) {
                setTimeout(() => {
                    showRedirectWarning(); 
                }, 4000); 
            }
        }, i * 4000);
    }
}

function showRedirectWarning() {
    const userConfirmed = confirm("go home.");

    if (userConfirmed) {
        window.location.href = "https://www.ultraguest.com/view/1717388758"; 
    } else {
        alert("you chose to stay? there is nothing for you here.");
    }
}




setInterval(showMessage, 4000);
showMessage();
