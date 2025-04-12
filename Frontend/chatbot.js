function loadUserData() {
    const name = sessionStorage.getItem("name");
    const age = sessionStorage.getItem("age");
    const medicalHistory = sessionStorage.getItem("medical_history");
  
    if (name && age && medicalHistory) {
      document.getElementById("user_info").innerHTML = `<p><strong>Name:</strong> ${name}</p>
                                                        <p><strong>Age:</strong> ${age}</p>
                                                        <p><strong>Medical History:</strong> ${medicalHistory}</p>`;
    } else {
      document.getElementById("user_info").innerHTML = "<p class='error'>❗ No user data found. Please login first.</p>";
    }
  }
  
  window.onload = loadUserData;
  
  async function getResponse() {
    const name = sessionStorage.getItem("name");
    const age = sessionStorage.getItem("age");
    const medicalHistory = sessionStorage.getItem("medical_history");
    const userInput = document.getElementById("user_input").value.trim();
  
    if (!name || !age || !medicalHistory || !userInput) {
      document.getElementById("response").innerHTML = "<p class='error'>❗ Please fill in all fields.</p>";
      return;
    }
  
    appendMessage('user', userInput);
  
    const requestData = {
      name: name,
      age: parseInt(age),
      medical_history: medicalHistory,
      query: userInput
    };
  
    try {
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  
      const data = await response.json();
      appendMessage('agent', data.response);
    } catch (error) {
      appendMessage('agent', "❌ Error: Unable to connect to the chatbot.");
      console.error("Error:", error);
    }
  }
  
  async function uploadFile() {
    const fileInput = document.getElementById("lab_file");
    const file = fileInput.files[0];
  
    if (!file) {
      alert("❗ Please select a lab report file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://localhost:8000/upload_lab/", {
        method: "POST",
        body: formData
      });
  
      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
  
      appendMessage('agent', "✅ Lab report uploaded successfully. You can now ask questions about it!");
    } catch (error) {
      appendMessage('agent', "❌ Failed to upload file. Try again.");
      console.error("Upload error:", error);
    }
  }
  
  function appendMessage(sender, message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', `${sender}-message`);
    messageContainer.textContent = message;
  
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.appendChild(messageContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  