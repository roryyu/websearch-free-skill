import { callOnce } from "mcporter";

async function main() {
  const keyword = process.argv[2];
  const num = process.argv[3];

  if (!keyword) {
    console.error('Error: Search keyword is required');
    console.error('Usage: node exasearch.js <keyword> [numResults]');
    process.exit(1);
  }

  const numResults = num ? parseInt(num, 10) : 10;

  if (isNaN(numResults) || numResults < 1) {
    console.error('Error: numResults must be a positive integer');
    process.exit(1);
  }

  if (numResults > 100) {
    console.error('Error: numResults cannot exceed 100');
    process.exit(1);
  }

  try {
    console.log(`Searching for: ${keyword}`);
    console.log(`Number of results: ${numResults}`);
    
    const result = await callOnce({
      server: "exa",
      toolName: "web_search_exa",
      args: { query: keyword, numResults: numResults },
    });

    console.log('\n=== Search Results ===');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error during search:', error.message);
    
    if (error.response) {
      console.error(`HTTP ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      console.error('Network error: No response received from server');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused: Unable to reach the search server');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Request timeout: Server took too long to respond');
    }
    
    process.exit(1);
  }
}

main();
