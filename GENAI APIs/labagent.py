from langchain.chains import RetrievalQA
from langchain.vectorstores import FAISS
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.tools import Tool
embedding_model = HuggingFaceEmbeddings(model_name="BAAI/bge-base-en-v1.5")

apikey = "YOURAPIKEY" #get it from MISTRALAI
llm = ChatOpenAI(
    openai_api_key=apikey,
    openai_api_base="https://api.mistral.ai/v1",
    model="ministral-8b-latest"
)
lab_faiss = None
lab_qa_chain = None

def load_lab_chain(file_path: str):
    global lab_faiss, lab_qa_chain
    lab_faiss = create_lab_faiss_from_file(file_path)
    retriever = lab_faiss.as_retriever(search_kwargs={"k": 3})
    lab_qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, chain_type="stuff")


lab_faiss = None
lab_qa_chain = None

def create_lab_faiss_from_file(file_path: str):
    loader = PyPDFLoader(file_path) if file_path.endswith(".pdf") else TextLoader(file_path)
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_docs = splitter.split_documents(docs)
    faiss_index = FAISS.from_documents(split_docs, embedding_model)
    return faiss_index

def load_lab_chain(file_path: str):
    global lab_faiss, lab_qa_chain
    lab_faiss = create_lab_faiss_from_file(file_path)
    retriever = lab_faiss.as_retriever(search_kwargs={"k": 3})
    lab_qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, chain_type="stuff")

def analyze_lab_query(query: str) -> str:
    if lab_qa_chain is None:
        return "No lab file has been uploaded yet."
    return lab_qa_chain.run(query)

lab_tool = Tool(
    name="LabFileAnalyzer",
    func=analyze_lab_query,
    description="Useful for analyzing user-uploaded lab reports and answering questions based on them."
)
