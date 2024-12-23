import {marked} from "https://esm.sh/marked";

document
	.getElementById("uploadForm")
	.addEventListener("input", function (event) {
		event.preventDefault();
	markdown.textContent = 'Loading...';
		const fileInput = document.getElementById("imageInput");
		const file = fileInput.files[0];
		if (!file) {
			alert("Please select a file!");
			return;
		}

		const formData = new FormData();
		formData.append("image", file);

		// FileReader instance
		const reader = new FileReader();

		// Event listener when the file has been read
		reader.onload = function (e) {
			// Create an image element
			const img = document.createElement("img");
			img.src = e.target.result;

			// Set image style
			img.style.width = "100px"; // Set the width of the preview image
			img.style.height = "auto"; // Keep the aspect ratio

			// Clear the previous preview
			const preview = document.getElementById("preview");
			preview.innerHTML = ""; // Remove any existing content in the preview div

			// Append the image to the preview element
			preview.appendChild(img);
		};

		// Read the file as a Data URL
		reader.readAsDataURL(file);

		markdown.innerHTML = '';
		fetch("https://early-rhino-20.deno.dev", {
			method: "POST",
			body: formData
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) {
					alert("Error: " + data.error);
				} else {
					const metadataElement = document.getElementById("metadata");
					metadataElement.textContent = JSON.stringify(data.exifData, null, 2);
					const read = `<button onclick="readOutLoud()">Read out loud</button>`
					markdown.innerHTML = marked(data.comments)+read;
					markdown.dataset['text'] = data.comments;
				}
			})
			.catch((error) => {
				alert("Failed to upload image: " + error.message);
			});
	});

markdown.innerHTML = marked(markdown.textContent)

function readOutLoud() {
	var T2S; 

	if("speechSynthesis" in window || speechSynthesis){ // Checking If speechSynthesis Is Supported.

			var text = markdown.dataset['text'];

			T2S = window.speechSynthesis || speechSynthesis; // Storing speechSynthesis API as variable - T2S
			var utter = new SpeechSynthesisUtterance(text); // To Make The Utterance
			T2S.speak(utter); // To Speak The Utterance

			window.onbeforeunload = function(){
					T2S.cancel(); // To Stop Speaking If the Page Is Closed.
			}

	}
}