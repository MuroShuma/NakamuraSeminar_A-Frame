document.getElementById('gpt-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const prompt = document.getElementById('prompt').value;

    try {
        const response = await fetch('/gpt-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        document.getElementById('response').textContent = data.message;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('response').textContent = 'Error occurred while fetching the GPT response.';
    }
});