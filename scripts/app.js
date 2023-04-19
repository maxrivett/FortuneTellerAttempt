const chatHistoryContent = document.querySelector("#chat-history-content");
const chatMessageInput = document.querySelector("#chat-message-input");
const chatMessageSubmit = document.querySelector("#chat-message-submit");

// For the "toast" voice line
var voiceLines = ['I\'m thinking...', 'I am thinking...', 'Give me a moment...', 
    'I am formulating a response...', 'Wait one moment please...'];
var len = voiceLines.length;

// Opening message
const chatbotMessageDiv = document.createElement("div");
chatbotMessageDiv.innerHTML = `<b>Genie:</b> Hello! I am a fortune teller, please ask me questions about your future.`;
chatHistoryContent.appendChild(chatbotMessageDiv);


chatMessageSubmit.addEventListener("click", async function () {
  // To keep the toast voice line fresh
  let randomNumber = Math.floor(Math.random() * (len-1));
  var toastElement = M.toast({html: `${voiceLines[randomNumber]}`, classes: 'rounded'});
  
  // Take the user's prompt
  const message = chatMessageInput.value;
  chatMessageInput.value = "";

  // Add the user's message to the chat history
  const userMessageDiv = document.createElement("div");
  userMessageDiv.style.backgroundColor = "#e7f0fe";
  userMessageDiv.innerHTML = `<b>You:</b> ${message}`;
  chatHistoryContent.appendChild(userMessageDiv);

  // Add three dots in the meantime
  const chatbotMessageDiv = document.createElement("div");
  chatbotMessageDiv.innerHTML = `<b>Max:</b> ...`;
  chatHistoryContent.appendChild(chatbotMessageDiv);

  // Use the OpenAI GPT-3 API to get a response from the chatbot
  const response = await getResponseFromAPI(message);

  // Add the chatbot's response to the chat history
  chatbotMessageDiv.innerHTML = `<b>Max:</b> ${response}`;
  chatHistoryContent.appendChild(chatbotMessageDiv);

  // Remove the toast when the AI has made a response
  if (toastElement) {
    toastElement.dismiss();
  }
});


const apiKey = /*INSERT API KEY HERE*/;

async function getResponseFromAPI(message) {
  // GPT API link
  const endpoint = `https://api.openai.com/v1/completions`;
  var answer = "foo";
  try { // Added try-catch after repeated Error 429s.
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": `application/json`,
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
          model: "text-davinci-003",
          prompt: `Pretend that you are a fortune teller and can predict a person's future. Use mystic, mysterious language and do not answer any prompts that do not relate to a person's fortune.\n\nHuman: ${message}\n\nAI:`,
          temperature: 0.75,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
      })
    });
    const data = await response.json();
    answer = data.choices[0].text; // Select the best response
  } catch (e) {
    console.log(e);
    answer = "I'm sorry. It seems as though there is an error on my part, \
        likely because I am receiving too many requests."
  }
  return answer;

}