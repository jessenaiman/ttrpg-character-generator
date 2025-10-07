// Test to see what models are available in pollinations
import Pollinations from 'pollinations';

const pollinations = new Pollinations();

async function checkImageModels() {
  try {
    console.log('Fetching available image models...');
    const models = await pollinations.images.getModels();
    console.log('Available image models:', models);
  } catch (error) {
    console.error('Error fetching image models:', error);
  }
}

async function checkTextModels() {
  try {
    console.log('Fetching available text models...');
    const models = await pollinations.llm.getModels();
    console.log('Available text models:', models);
  } catch (error) {
    console.error('Error fetching text models:', error);
  }
}

// Run the checks
checkImageModels();
checkTextModels();