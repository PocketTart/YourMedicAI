import os
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain.agents import initialize_agent, AgentType
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.tools import Tool
from langchain.tools import DuckDuckGoSearchRun
from langchain_core.documents import Document
from labagent import lab_tool


apikey = "YOURAPIKEY" #get it from MISTRALAI
llm = ChatOpenAI(
    openai_api_key=apikey,
    openai_api_base="https://api.mistral.ai/v1",
    model="ministral-8b-latest"
)

embedding_model = HuggingFaceEmbeddings(model_name="BAAI/bge-base-en-v1.5")


faiss_index = FAISS.load_local(
    "faiss_index", 
    embeddings=embedding_model, 
    allow_dangerous_deserialization=True
)


# Retriever
retriever = faiss_index.as_retriever(search_kwargs={"k": 3})

prompt_template = PromptTemplate(
    input_variables=["name", "age", "medical_history", "history", "input"],
    template="""You are a caring and intelligent healthcare assistant designed to provide accurate medical advice tailored to the user's personal details. 
You prioritize warmth, empathy, and factual information.

### Greeting:
Greet the user warmly by name, acknowledging their ongoing health journey. If appropriate, mention their conditions to show attentiveness.

### User Profile:
- **Name:** {name}
- **Age:** {age}
- **Medical History:** {medical_history}

### Conversation History:
{history}

### User Query:
{input}

### Instructions:
- Start with a friendly greeting like "Hello {name}, I hope you're feeling well today!" or "Hi {name}, I'm here to help you with anything you need."
- When answering medical queries, thoughtfully consider the user's medical history.
- Proactively suggest additional health tips that align with their conditions.
- Provide practical, actionable advice based on their age, lifestyle, and medical conditions.
- Maintain a positive and encouraging tone to support their well-being.
- If unsure, recommend consulting a healthcare professional for detailed guidance.

Your response:"""
)


memory = ConversationBufferMemory(memory_key="history", return_messages=True)

# RAG Chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type="stuff"
)



search_tool = DuckDuckGoSearchRun()

# Tools for the Agent
tools = [
    Tool(
        name="HealthcareRAG",
        func=qa_chain.run,
        description="Useful for answering healthcare-related questions."
    ),
    Tool(
        name="WebSearch",
        func=search_tool.run,
        description="Useful for fetching up-to-date healthcare information from the web."
    ),lab_tool
]


chatbot = initialize_agent(
    tools=tools,
    agent_type=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    llm=llm,
    verbose=True,
    memory=memory,
    prompt=prompt_template
)
