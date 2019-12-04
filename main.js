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

        function indexOfMax(arr) {

            let max = arr[0];
            let maxIndex = 0;
            let runnerUp = 0

            for (let i = 1; i < arr.length; i++) {
                if (arr[i] > max) {
                    runnerUp = maxIndex
                    maxIndex = i;
                    max = arr[i];
                }
            }

            return [maxIndex, runnerUp];
        }

        let user_pic = document.querySelector('.uploaded-user-image')

        sessionStorage.setItem('user_pic', user_pic.src)
        let imageData;
        // Creating Canvas User Image
        const image = new Image();
        image.src = user_pic.src;
        const canvas = document.querySelector('#myCanvas');

        const context = canvas.getContext('2d');
        context.drawImage(user_pic, 0, 0, 175, 175);

        imageData = context.getImageData(0, 0, 175, 175);
        // Replace the Dropzone with the image that is cropped
        // After that, give that image to the prediction method
        const response = await tf.loadLayersModel('model.json');
        response.summary();

        // let flat = tf.util.flatten(user_pic)
        // console.log('This is Flattened Tensor: ', flat)
        const tensor_image = tf.browser
            .fromPixels(imageData)
            .reshape([175, 175, 3])
            .div(tf.scalar(255))
            .cast('float32')
            .expandDims();

        // Prediction on the image we have
        prediction = response.model.predict(
            // The second arg makes it grayscale (supposedly)
            // This is also the only way to get a proper setup
            tensor_image, { batchSize: 1 },
            true
        );
        // This is the problem spot. All 4 numbers get put together.
        // Our structure is [null, 200, 200, 1] in the model
        // Because there is a null, it equates to 0 where it needs to be 40000
        let results = prediction.dataSync();
        let bestResults = indexOfMax(results)
        let predictionDigit = bestResults[0]
        let runnerUp = bestResults[1]

        console.log('Results: ', results)
        console.log('Prediction Digit: ', predictionDigit)

        let answers = {
            0: 'acheta domesticus',

            1: 'conocephalus brevipennis',
            2: 'dissosteira carolina',
            3: 'melanoplus bivittatus',
            4: 'melanoplus differentialis',
            5: 'melanoplus femerrubrum',
            6: 'melanoplus punctulatus',
            7: 'microcentrum rhombifolium',
            8: 'neocurtilla hexadactyla',
            9: 'neoxabea bipunctata',
            10: 'phyllopalpus pulchellus',
            11: 'romalea microptera',

        };

        sessionStorage.setItem('first', answers[predictionDigit])
        sessionStorage.setItem('second', answers[runnerUp])

        // When the model works, the 0 will be the result from the prediction
        // Just building the skeleton now
        // This is a weird way to do this and I am too tired to keep going

        // Javascript page rendering

        let guesses = document.querySelector('.guesses')

        if (predictionDigit === 0) {
            window.location.href = "adomesticus.html"

        } else if (predictionDigit === 1) {
            window.location.href = "cbrevipennis.html"
        } else if (predictionDigit === 2) {
            window.location.href = "dcarolina.html"
        } else if (predictionDigit === 3) {
            window.location.href = "mbivittatus.html"
        } else if (predictionDigit === 4) {
            window.location.href = "mdifferentialis.html"
        } else if (predictionDigit === 5) {
            window.location.href = "mfemurrubrum.html"
        } else if (predictionDigit === 6) {
            window.location.href = "mpunctulatus.html"
        } else if (predictionDigit === 7) {
            window.location.href = "mrhombifolium.html"
        } else if (predictionDigit === 8) {
            window.location.href = "nhexadactyla.html"
        } else if (predictionDigit === 9) {
            window.location.href = "nbipunctata.html"
        } else if (predictionDigit === 10) {
            window.location.href = "ppulchellus.html"
        } else if (predictionDigit === 11) {
            window.location.href = "rmicroptera.html"
        }
        console.log('This is the end')
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
}

let user_image = document.querySelector('.user-pic-container');
if (user_image) {
    user_image.innerHTML = `<img class="user-pic" src="${sessionStorage.getItem('user_pic')}">`;
    let first = sessionStorage.getItem('first');
    let firstSplit = first.split(' ');
    let firstLetter = first[0];
    let firstName = firstLetter + firstSplit[1];
    first = firstLetter.toUpperCase() + first.slice(1);

    let second = sessionStorage.getItem('second');
    let secondSplit = second.split(' ');
    let secondLetter = second[0];
    let secondName = secondLetter + secondSplit[1];
    second = secondLetter.toUpperCase() + second.slice(1);

    document.querySelector('.guesses').innerHTML = `
				<div class="guess">
					<p class="guess-label">First Prediction</p>
                    <a class="guess-text" href="${firstName}.html">${first}</a>
                </div>
				<div class="guess">
					<p class="guess-label">Second Prediction</p>
                    <a class="guess-text" href="${secondName}.html">${second}</a>
                </div>
	`;
}