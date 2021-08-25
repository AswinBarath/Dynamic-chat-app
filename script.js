// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDT4tuYkXu0x7QbsiXOwLmt2ZuKQSOgJjc",
    authDomain: "dynamic-chat-app.firebaseapp.com",
    projectId: "dynamic-chat-app",
    storageBucket: "dynamic-chat-app.appspot.com",
    messagingSenderId: "841933125812",
    appId: "1:841933125812:web:3eeb3ec75ae78e24efffe1",
    measurementId: "G-79LG2YBVY0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// Access firestore using firebase object obtained from the CDN
var db = firebase.firestore();

// Prompt for name
if (!localStorage.getItem('name')) {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
} else {
	name = localStorage.getItem('name')
}
document.querySelector('#name').innerText = name

// Change name
document.querySelector('#change-name').addEventListener('click', () => {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
	document.querySelector('#name').innerText = name
})

// Form event listener
document.querySelector('#message-form').addEventListener('submit', e => {
	e.preventDefault();
	let message = document.querySelector('#message-input').value 
    // Saving messages to database
	db.collection('messages')
	.add({
		name: name,
		message: message,
		date: firebase.firestore.Timestamp.fromMillis(Date.now()) // Add a Timestamp to New Messages
	})
	.then((docRef) => {
		console.log(`Document written with ID: ${docRef.id}`);
		document.querySelector('#message-form').reset()
	})
	.catch((error) => {
		console.error(`Error adding document: ${error}`);
	});
})

// Real-time listener
db.collection('messages')
.orderBy('date', 'asc') // messages ordered by the time it was created
.onSnapshot(snapshot => {
	document.querySelector('#messages').innerHTML = ''
	snapshot.forEach(doc => {
		let message = document.createElement('div')
		message.innerHTML = `
		<p class="name">${doc.data().name}</p>
		<p>${doc.data().message}</p>
		`
		document.querySelector('#messages').prepend(message)
	})
})

// Clear all messages from chat stream
document.querySelector('#clear').addEventListener('click', () => {
    db.collection('messages')
	.where('name', '==', name) // Clear messages only user messages
    .get()
    .then(snapshot => {
        snapshot.forEach(doc => {
			db.collection('messages').doc(doc.id).delete()
            .then(() => {
				console.log('Document successfully deleted!')
			})
            .catch(error => {
				console.error(`Error removing document: ${error}`)
			})
        })
    })
    .catch(error => {
        console.log(`Error getting documents: ${error}`)
    })
})


