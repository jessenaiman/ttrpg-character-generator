// Test Pollinations image and audio generation capabilities
const Pollinations = require('pollinations');

const pollinations = new Pollinations();

async function testImageGeneration() {
  try {
    console.log('Testing image generation with flux model...');
    
    // Generate a character image
    const imageBuffer = await pollinations.images.generateImage({
      prompt: "A brave fantasy warrior with intricate armor and a glowing sword",
      model: "flux",
      width: 512,
      height: 512
    });
    
    console.log('Image generated successfully!');
    console.log('Image buffer size:', imageBuffer.length, 'bytes');
    
    // Save the image to a file
    const fs = require('fs');
    fs.writeFileSync('test-character.png', imageBuffer);
    console.log('Image saved as test-character.png');
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

async function testAudioGeneration() {
  try {
    console.log('Testing audio generation with openai-audio model...');
    
    // Check if the model supports audio
    const models = await pollinations.llm.getModels();
    const audioModel = models.find(m => m.name === 'openai-audio');
    
    if (audioModel && audioModel.audio) {
      console.log('Audio model found:', audioModel);
      
      // Generate audio for a character voice
      const audioResponse = await pollinations.llm.generateTextPost({
        messages: [
          { role: 'user', content: 'Generate a short voice line for a brave warrior character saying "I will protect the innocent."' }
        ],
        model: 'openai-audio',
        jsonMode: false
      });
      
      console.log('Audio generated successfully!');
      console.log('Audio response:', audioResponse);
    } else {
      console.log('Audio model not found or does not support audio generation');
    }
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

async function testTextGeneration() {
  try {
    console.log('Testing text generation with openai model...');
    
    // Generate a character description
    const textResponse = await pollinations.llm.generateTextGet({
      prompt: "Generate a detailed character description for a brave warrior who protects the innocent",
      model: 'openai'
    });
    
    console.log('Text generated successfully!');
    console.log('Character description:', textResponse);
  } catch (error) {
    console.error('Error generating text:', error);
  }
}

// Run the tests
testImageGeneration();
testTextGeneration();
testAudioGeneration();