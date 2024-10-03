// Function to check if the URL matches any unsafe patterns
function isUnsafeUrl(url) {
    // Basic patterns that might indicate a fake or unsafe website
    const unsafePatterns = [
        /.*(fake|scam|phishing|malicious|spoof|virus).*/i,  // Keywords
        /.*\.xyz$/,  // Commonly used for scams
        /.*\.top$/,  // Another TLD often associated with fake sites
        /.*\d{1,5}\..*$/  // Check for numbers in domain (e.g., 12345.example.com)
    ];

    return unsafePatterns.some(pattern => pattern.test(url));
}

// Function to check URL safety using Google Safe Browsing API
async function checkUrlSafety(url) {
    const apiKey = 'your API key'; // Replace with your actual API key
    const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            client: {
                clientId: "yourcompanyname",
                clientVersion: "1.0"
            },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url: url }]
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        console.error("API request failed:", response.statusText);
    }

    const data = await response.json();
    return data.matches && data.matches.length > 0; // Return true if matches found (i.e., unsafe)
}

// Main function to check the URL when the form is submitted
async function checkUrl(event) {
    event.preventDefault(); // Prevent the form from submitting

    const urlInput = document.getElementById('url').value;
    const predictionText = document.getElementById('prediction');
    const urlLink = document.getElementById('urlLink');
    const form2 = document.getElementById('form2');
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');

    // Reset button states
    button1.disabled = false;
    button2.disabled = false;

    console.log("URL entered: ", urlInput); // Add this log to see if the URL is captured correctly

    // First, check if the URL matches any unsafe patterns
    if (isUnsafeUrl(urlInput)) {
        predictionText.innerText = "Warning: This website may be unsafe!";
        urlLink.href = urlInput;
        button1.disabled = true;
        button2.disabled = true; // Disable buttons for unsafe URLs
    } else {
        // If no unsafe patterns, check with the Google Safe Browsing API
        const isUnsafe = await checkUrlSafety(urlInput);
        console.log("Is unsafe from API: ", isUnsafe); // Debugging log

        if (isUnsafe) {
            predictionText.innerText = "Warning: This website is reported as unsafe!";
            urlLink.href = urlInput;
            button1.disabled = true;
            button2.disabled = true; // Disable buttons for unsafe URLs
        } else {
            predictionText.innerText = "This website is safe.";
            urlLink.href = urlInput;
            // Enable buttons since the URL is safe
        }
    }

    // Show the second form with prediction
    form2.style.display = 'block';
    urlLink.innerText = urlInput; // Display the URL
}
// Function to refresh the page
function refreshPage() {
    location.reload(); // This will reload the current page
}