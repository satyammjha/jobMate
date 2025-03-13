import sys
import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
import os
from nltk.corpus import stopwords

nltk_data_path = os.path.expanduser("~/nltk_data")
nltk.data.path.append(nltk_data_path)

try:
    stop_words = set(stopwords.words("english"))
except LookupError:
    nltk.download('stopwords', download_dir=nltk_data_path)
    stop_words = set(stopwords.words("english"))

skill_mappings = {
    "javascript": ["react", "node.js", "next.js", "express", "frontend", "backend", "typescript", "vue.js"],
    "python": ["machine learning", "data science", "tensorflow", "nlp", "flask", "django", "pandas", "numpy"],
    "ai": ["machine learning", "deep learning", "tensorflow", "nlp", "huggingface", "pytorch", "transformers"],
    "data science": ["python", "r", "sql", "pandas", "numpy", "data visualization"],
    "cloud": ["aws", "azure", "gcp", "docker", "kubernetes", "serverless", "terraform"],
    "devops": ["docker", "kubernetes", "ci/cd", "jenkins", "terraform", "ansible"],
    "mobile": ["react native", "flutter", "swift", "kotlin", "android", "ios"],
    "cybersecurity": ["network security", "penetration testing", "encryption", "firewall", "ethical hacking"],
    "blockchain": ["solidity", "ethereum", "web3.js", "smart contracts", "nfts"],
    "backend": ["node.js", "express", "django", "flask", "spring boot", "graphql", "rest api"],
    "frontend": ["react", "vue.js", "angular", "svelte", "css", "tailwind", "bootstrap"],
    "database": ["sql", "mongodb", "postgresql", "mysql", "firebase", "bigquery"],
    "ai/ml": ["tensorflow", "pytorch", "scikit-learn", "huggingface", "opencv"],
    "web scraping": ["selenium", "beautifulsoup", "scrapy", "puppeteer"],
}

def expand_skills(skills):
    skills = [skill.lower() for skill in skills]
    expanded_skills = set(skills)
    for skill in skills:
        if skill in skill_mappings:
            expanded_skills.update(skill_mappings[skill]) 
    return list(expanded_skills)

def preprocess_text(job):
    stop_words = set(stopwords.words("english"))
    title = job.get("title", "").lower()
    description = job.get("description", "").lower()
    company = job.get("company", "").lower()
    tags = " ".join(job.get("tags", [])).lower() 

    combined_text = f"{title} {description} {company} {tags}"
    
    words = [word for word in combined_text.split() if word not in stop_words]
    return " ".join(words) if words else "No Description"

def match_jobs(jobs_json, skills_json):
    jobs = json.loads(jobs_json)
    skills = json.loads(skills_json)

    if not jobs or not skills:
        return json.dumps([])

    skills = expand_skills(skills)
    job_texts = [preprocess_text(job) for job in jobs]

    skills_text = " ".join(skills).lower()

    vectorizer = TfidfVectorizer(ngram_range=(1,2))
    job_vectors = vectorizer.fit_transform(job_texts)
    skills_vector = vectorizer.transform([skills_text])

    similarity_scores = cosine_similarity(skills_vector, job_vectors)[0]

    ranked_jobs = sorted(zip(similarity_scores, jobs), reverse=True, key=lambda x: x[0])

    return json.dumps([job for score, job in ranked_jobs if score > 0.1])

if __name__ == "__main__":
    jobs_json = sys.argv[1]
    skills_json = sys.argv[2]
    print(match_jobs(jobs_json, skills_json))