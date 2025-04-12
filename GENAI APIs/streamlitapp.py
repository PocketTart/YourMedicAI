import streamlit as st
from healthcarechatbot import chatbot  # Import chatbot logic

# Streamlit App Title
st.title("🩺 Healthcare Chatbot")
st.write("Your intelligent assistant for medical advice and health tips. Ask anything!")

# Initialize chat history in session state
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Input Fields
name = st.text_input("👤 Your Name")
age = st.number_input("🎂 Your Age", min_value=0, max_value=150, step=1)
medical_history = st.text_input("📋 Your Medical History")
user_input = st.text_input("💬 Ask me anything about healthcare...")

if st.button("Send"):
    if name and age and medical_history and user_input:
        # Format user input for chatbot
        formatted_input = (
            f"name-{name}, "
            f"age-{age}, "
            f"medicalhistory-{medical_history}, "
            f"message-{user_input}"
        )

        # Append user query to chat history
        st.session_state.chat_history.append(f"**You:** {user_input}")

        # Generate chatbot response
        response = chatbot.invoke({"input": formatted_input})

        # Append chatbot response to chat history
        st.session_state.chat_history.append(f"🤖 **Chatbot:** {response['output']}")
    else:
        st.warning("❗ Please fill in all fields before clicking 'Send'.")

# Display chat history
st.markdown("### 📜 Conversation History")
for message in st.session_state.chat_history:
    st.markdown(message)
