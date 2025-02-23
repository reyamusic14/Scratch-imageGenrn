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
        console.log('CAME IN generateImages function');

        // Show loading state
        this.generateBtn.disabled = true;
        this.generateBtn.textContent = 'Generating...';

        try {
            console.log("I am trying to generate now", this.locationInput.value, this.climateIssue.value);
            const prompt = `Create an image depicting a climate change issue in ${this.locationInput.value}, affecting ${this.climateIssue.value}. Add a catchy slogan also in the image.`;
            // Simulate API calls to different AI platforms
            const images = await Promise.all([
                this.generateSingleImage(prompt, 'stability'),
                this.generateSingleImage(prompt, 'openai'),
                //this.generateSingleImage('platform3')
            ]);

            // Update UI with generated images
            const imageCards = document.querySelectorAll('.image-card img');
            imageCards.forEach((img, index) => {
                img.src = images[index];
            });

            // Show results section
            this.resultsSection.classList.remove('hidden');
            
            // Update climate information
            this.updateClimateInfo();
        } catch (error) {
            console.error('Error generating images:', error);
            alert('Failed to generate images. Please try again.');
        } finally {
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Generate Vision';
        }
    }

    async generateSingleImage(prompt, service) {
        const WORKER_URL = 'https://scratch-img-gen.spa-mariner.workers.dev';
        try {
            console.log("Calling:", this.service.value, "with the prompt:", this.prompt.value;
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    service // either 'openai' or 'stability'
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
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
                solutions: 'Reduce emissions, marine protected areas, coral restoration'
            },
        };

        const info = climateData[this.climateIssue.value];
        const infoContent = document.querySelector('.info-content');
        infoContent.innerHTML = `<p>${info.causes}</p>`;
    }
}

export default ImageGenerator; // Export the class for later use
