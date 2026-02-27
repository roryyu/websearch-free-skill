import axios from 'axios';
import { ReadResult } from './ReadResult.js';

class WebChannel {
  constructor() {
    this.JINA_URL = "https://r.jina.ai/";
  }

  async read(url) {
    try {
      const response = await axios.get(`${this.JINA_URL}${url}`, {
        headers: {
          'Accept': 'text/markdown'
        },
        timeout: 15000
      });

      const text = response.data;
      let title = url;
      const lines = text.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('# ')) {
          title = trimmedLine.substring(2).trim();
          break;
        }
        if (trimmedLine.startsWith('Title:')) {
          title = trimmedLine.substring(6).trim();
          break;
        }
      }

      return new ReadResult(title, text, url, "web");

    } catch (error) {
      if (error.response) {
        throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network error: No response received');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }
}

async function main() {
  const url = process.argv[2];
  
  if (!url) {
    console.error('Usage: node search.js <url>');
    process.exit(1);
  }

  const webChannel = new WebChannel();
  
  try {
    console.log(`Reading: ${url}`);
    const result = await webChannel.read(url);
    
    console.log('\n=== Read Result ===');
    console.log(`Title: ${result.title}`);
    console.log(`URL: ${result.url}`);
    console.log(`Platform: ${result.platform}`);
    console.log(`Content length: ${result.content.length} characters`);
    console.log('\nFirst 200 characters of content:');
    console.log(result.content.substring(0, 200) + '...');
    
  } catch (error) {
    console.error('Error reading web page:', error.message);
    process.exit(1);
  }
}

main();
