const API_URL = 'http://localhost:3000';

class ImageGenerator {
    constructor() {
        this.generateBtn = document.getElementById('generate-btn');
        this.locationInput = document.getElementById('location');
        this.climateIssue = document.getElementById('climate-issue');
        this.resultsSection = document.querySelector('.results-section');
        
        this.init();
    }

    init() {
        this.generateBtn.addEventListener('click', () => this.generateImages());
    }

    async generateImages() {
        if (!this.locationInput.value || !this.climateIssue.value) {
            alert('Please fill in all fields');
            return;
        }

        // Show loading state
        this.generateBtn.disabled = true;
        this.generateBtn.textContent = 'Generating...';

        try {
            const prompt = `Create an image depicting a climate change issue in ${this.locationInput.value}, affecting ${this.climateIssue.value}. Add a catchy slogan also in the image.`;
            
            // Generate images using both services
            const [stabilityResponse, dalleResponse] = await Promise.all([
                this.generateWithStableDiffusion(prompt),
                this.generateWithDallE(prompt)
            ]);

            // Update UI with generated images
            const imageCards = document.querySelectorAll('.image-card img');
            if (stabilityResponse.images) {
                imageCards[0].src = stabilityResponse.images[0];
            }
            if (dalleResponse.images) {
                imageCards[1].src = dalleResponse.images[0];
            }

            // Show results section and update info
            this.resultsSection.classList.remove('hidden');
            this.updateClimateInfo();
        } catch (error) {
            console.error('Error generating images:', error);
            alert('Failed to generate images. Please try again.');
        } finally {
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Generate Vision';
        }
    }

    async generateWithDallE(prompt) {
        try {
            const response = await fetch(`${API_URL}/api/dalle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('DALL-E API request failed');
            }

            return await response.json();
        } catch (error) {
            throw new Error('DALL-E generation failed: ' + error.message);
        }
    }

    async generateWithStableDiffusion(prompt) {
        try {
            const response = await fetch(`${API_URL}/api/stable-diffusion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Stable Diffusion API request failed');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Stable Diffusion generation failed: ' + error.message);
        }
    }

    updateClimateInfo() {
        const climateData = {
            'rising-sea': {
                causes: 'Global warming, thermal expansion of oceans, melting ice caps',
                effects: 'Coastal flooding, erosion, displacement of communities',
                solutions: 'Reduce carbon emissions, coastal protection, renewable energy'
            },
            'drought': {
                causes: 'Climate change, deforestation, poor water management',
                effects: 'Crop failure, water scarcity, desertification',
                solutions: 'Water conservation, drought-resistant crops, improved irrigation'
            },
            'coral-bleaching': {
                causes: 'Ocean warming, ocean acidification, pollution',
                effects: 'Loss of marine habitat, ecosystem collapse, tourism impact',
                solutions: 'Marine protected areas, reduce emissions, coral restoration'
            }
        };

        const info = climateData[this.climateIssue.value];
        const infoContent = document.querySelector('.info-content');
        infoContent.innerHTML = `
            <h4>Causes:</h4>
            <p>${info.causes}</p>
            <h4>Effects:</h4>
            <p>${info.effects}</p>
            <h4>Solutions:</h4>
            <p>${info.solutions}</p>
        `;
    }
}

export default ImageGenerator;
