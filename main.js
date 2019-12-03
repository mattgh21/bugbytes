insectImg = document.getElementById('insectPic');
if (insectImg) {
	imgData = getBase64Image(insectImg);
	localStorage.setItem('imgData', imgData);
}

let dataImage = localStorage.getItem('imgData');
insectImg = document.getElementById('user-pic');
// insectImg.src = "data:image/png;base64," + dataImage;

let prediction;

let identify = document.querySelector('.identify');
if (identify) {
	identify.addEventListener('click', async function(data) {
		event.preventDefault();
		let user_pic = document.querySelector('.dz-image').children[0];
		console.log('User Image: ', user_pic);

		let imageData;
		// Creating Canvas User Image
		const image = new Image();
		image.src = user_pic.src;
		const canvas = document.querySelector('#myCanvas');

		const context = canvas.getContext('2d');
		context.drawImage(user_pic, 0, 0, 175, 175);

		imageData = context.getImageData(0, 0, 175, 175);
		console.log(imageData);

		console.log(image);
		// Replace the Dropzone with the image that is cropped
		// After that, give that image to the prediction method
		const response = await tf.loadLayersModel('model_json');
		response.summary();
		console.log('This is what got returned: ', response, 'This is your model: ', response.model);

		// let flat = tf.util.flatten(user_pic)
		// console.log('This is Flattened Tensor: ', flat)
		const tensor_image = tf.browser
			.fromPixels(imageData)
			.reshape([ 175, 175, 3 ])
			.div(tf.scalar(255))
			.cast('float32')
			.expandDims();

		console.log('This is your Tensor Object Image: ', tensor_image);
		// Prediction on the image we have
		prediction = response.model.predict(
			// The second arg makes it grayscale (supposedly)
			// This is also the only way to get a proper setup
			tensor_image,
			{ batchSize: 1 },
			true
		);
		// This is the problem spot. All 4 numbers get put together.
		// Our structure is [null, 200, 200, 1] in the model
		// Because there is a null, it equates to 0 where it needs to be 40000
		let results = prediction.dataSync();
		console.log('This is your Results: ', prediction.dataSync());

		// What are these?!
		console.log('This is your prediction below: ');
		// Must be separated. `.print` does strange things
		prediction.print(true);
		let answers = [
			'dissosteira carolina',
			'melanoplus bivittatus',
			'melanoplus differentialis',
			'phyllopalpus pulchellus',
			'romalea microptera'
		];

		// When the model works, the 0 will be the result from the prediction
		// Just building the skeleton now
		// This is a weird way to do this and I am too tired to keep going
		let info = await fetch(`bugbytes/1/view_species`, {
			method : 'GET'
		})
			.then((response) => response.text())
			.then((data) => {
				let html = document.querySelector('html');
				html.innerHTML = data;
			});
		console.log(info);
	});

	// console.log('Tensor Object: ', tensor_image)
	// // const prediction = model.predict(tensor_image)
	// console.log('This is your prediction: ', prediction)
	// // sessionStorage.setItem('prediction', prediction)
}

// Bug info rendering
function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === name + ' = ') {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
var csrftoken = getCookie('csrftoken');

let image = document.querySelector('#image');
let kingdom = document.querySelector('#kingdom');
let phylum = document.querySelector('#phylum');
let bug_class = document.querySelector('#class');
let order = document.querySelector('#order');
let family = document.querySelector('#family');
let genus = document.querySelector('#genus');
let species = document.querySelector('#species');
let size = document.querySelector('#size');
let colors = document.querySelector('#colors');
let button = document.querySelector('#grabber');
let com_names = document.querySelector('#com_names');
let desc = document.querySelector('#desc');

if (button) {
	button.addEventListener('click', function() {
		fetch('/api/species/3/', {
			method      : 'GET',
			credentials : 'same-origin',
			headers     : {
				'X-CSRFToken'  : getCookie('csrftoken'),
				Accept         : 'application/json',
				'Content-Type' : 'applicaton/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				// avatar.innerHTML = `< img src = "${data.avatar}" alt = "${data.tax_name}" > `
				family.innerHTML = `Family: ${data.family}`;
				genus.innerHTML = `Genus: ${data.genus}`;
				species.innerHTML = `Species: ${data.tax_name}`;
				size.innerHTML = `Size: ${data.size}`;
				colors.innerHTML = `Colors: ${data.colors}`;
				desc.innerHTML = `Description: ${data.desc}`;
			});
		fetch('/api/com_names/8', {
			method      : 'GET',
			credentials : 'same-origin',
			headers     : {
				'X-CSRFToken'  : getCookie('csrftoken'),
				Accept         : 'application/json',
				'Content-Type' : 'applicaton/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data.name);
				com_names.innerHTML = `Common Names: ${data.name}`;
			});
		fetch('/api/photos/26', {
			method      : 'GET',
			credentials : 'same-origin',
			headers     : {
				'X-CSRFToken'  : getCookie('csrftoken'),
				Accept         : 'application/json',
				'Content-Type' : 'applicaton/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data.image);
				image.innerHTML = `< img src = "${data.image}" alt = "${data.tax_name}" > `;
			});
	});
}

let carousel = document.querySelector('.carousel');
if (carousel) {
	let slideIndex = 1;

	// Setting a default so that it will move by itself
	function plusSlides(n = 1) {
		showSlides((slideIndex += n));
	}

	function currentSlide(n) {
		showSlides((slideIndex = n));
	}

	function showSlides(n) {
		let i;
		let slides = document.getElementsByClassName('slide');
		let dots = document.getElementsByClassName('dot');
		if (n > slides.length) {
			slideIndex = 1;
		}
		if (n < 1) {
			slideIndex = slides.length;
		}
		for (i = 0; i < slides.length; i++) {
			slides[i].style.display = 'none';
		}
		for (i = 0; i < dots.length; i++) {
			dots[i].className = dots[i].className.replace(' active', '');
		}
		slides[slideIndex - 1].style.display = 'block';
		dots[slideIndex - 1].className += ' active';
	}
	showSlides(slideIndex);

	window.setInterval(plusSlides, 5000);

	fetch('/api/');
}
