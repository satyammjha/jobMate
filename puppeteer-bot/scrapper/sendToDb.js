import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
const uri = process.env.MONGO_URI;

async function sendGlassDoorDb() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('gdjd'); 
    const collection = db.collection('jds'); 

    await collection.deleteMany({});

    const fileContent = fs.readFileSync('jobs_data.json', 'utf8');
    const data = JSON.parse(fileContent);
    if (Array.isArray(data)) {
      await collection.insertMany(data);
      console.log('Glassdoor data inserted successfully!');
    } else {
      console.error('Expected a JSON array in the file.');
    }
  } catch (error) {
    console.error('Error inserting Glassdoor data:', error);
  } finally {
    await client.close();
  }
}

async function sendNaukriDb() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('nd'); 
    const collection = db.collection('nds'); 

    await collection.deleteMany({});

    const fileContent = fs.readFileSync('naukri_jobs_data.json', 'utf8');
    const data = JSON.parse(fileContent);
    if (Array.isArray(data)) {
      await collection.insertMany(data);
      console.log('Naukri data inserted successfully!');
    } else {
      console.error('Expected a JSON array in the file.');
    }
  } catch (error) {
    console.error('Error inserting Naukri data:', error);
  } finally {
    await client.close();
  }
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("❌ Please provide an argument: 'glassdoor' or 'naukri'");
  process.exit(1);
}

if (args[0] === 'glassdoor') {
  sendGlassDoorDb();
} else if (args[0] === 'naukri') {
  sendNaukriDb();
} else {
  console.error("❌ Invalid argument provided. Use 'glassdoor' or 'naukri'");
  process.exit(1);
}