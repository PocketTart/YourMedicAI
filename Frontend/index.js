function saveDataAndRedirect() {
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const medicalHistory = document.getElementById("medical_history").value.trim();
  
    if (!name || !age || !medicalHistory) {
      alert("Please fill in all fields.");
      return;
    }
  
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("age", age);
    sessionStorage.setItem("medical_history", medicalHistory);
  
    window.location.href = "chatbot.html";
  }
  