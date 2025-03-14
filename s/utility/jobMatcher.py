import sys
import json
import re
import os
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords

# Setup NLTK Stopwords
nltk_data_path = os.path.expanduser("~/nltk_data")
nltk.data.path.append(nltk_data_path)

try:
    stop_words = set(stopwords.words("english"))
except LookupError:
    nltk.download('stopwords', download_dir=nltk_data_path)
    stop_words = set(stopwords.words("english"))

# Updated Skill Mappings for Titles
skill_mappings = {
    "javascript": ["js", "react", "node", "typescript", "frontend", "web"],
    "typescript": ["ts", "angular", "react"],
    "react.js": ["react", "reactjs", "frontend"],
    "node.js": ["node", "nodejs", "backend", "server"],
    "mongodb": ["mongo", "database", "nosql"],
    "sql": ["sql", "database", "mysql", "postgresql"],
    "rest apis": ["api", "rest"],
    "html": ["html5", "frontend"],
    "css": ["css3", "styling"],
    "git": ["github", "version control"]
}

def expand_skills(skills):
    skills = set(skill.lower() for skill in skills)
    expanded_skills = set(skills)
    for skill in skills:
        expanded_skills.update(skill_mappings.get(skill, []))
    return list(expanded_skills)

def preprocess_text(job):
    # Focus on title and company only
    title = job.get("title", "").lower()
    company = job.get("company", "").lower()
    combined_text = f"{title} {company}"
    # Tokenize and clean
    words = re.findall(r'\b[a-z0-9]+\b', combined_text)
    filtered_words = [word for word in words if word not in stop_words]
    return ' '.join(filtered_words) if filtered_words else ''

def compute_similarity(skills_text, jobs, job_texts):
    # Optimized for short texts
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 1),
        max_df=0.9,
        min_df=1,
        stop_words="english"
    )
    job_vectors = vectorizer.fit_transform(job_texts)
    skills_vector = vectorizer.transform([skills_text])
    similarity_scores = cosine_similarity(skills_vector, job_vectors)[0]
    
    ranked_jobs = []
    for score, job in zip(similarity_scores, jobs):
        title = job.get("title", "").lower()
        title_terms = set(re.findall(r'\b[a-z0-9]+\b', title))
        # Count title matches with expanded skills
        skill_match = sum(1 for skill in skills_text.split() 
                        if any(term in title_terms for term in skill.split()))
        final_score = score + 0.3 * skill_match  # Adjusted boost
        ranked_jobs.append((final_score, job))
    
    return sorted(ranked_jobs, key=lambda x: x[0], reverse=True)

def match_jobs(jobs, skills):
    if not jobs or not skills:
        return json.dumps([])
    
    expanded_skills = expand_skills(skills)
    job_texts = [preprocess_text(job) for job in jobs]
    skills_text = ' '.join(expanded_skills)
    
    ranked_jobs = compute_similarity(skills_text, jobs, job_texts)
    return json.dumps([job for score, job in ranked_jobs[:10]])

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        jobs = data.get("jobs", [])
        skills = data.get("skills", [])
        print(match_jobs(jobs, skills))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)