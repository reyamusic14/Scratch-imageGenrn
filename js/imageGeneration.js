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
            // Simulate API calls to different AI platforms
            const images = await Promise.all([
                this.generateSingleImage('platform1'),
                this.generateSingleImage('platform2'),
                this.generateSingleImage('platform3')
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

    async generateSingleImage(platform) {
        // Simulate API call - replace with actual AI image generation API
        return `https://placeholder.com/600x400?text=${this.locationInput.value}-${this.climateIssue.value}`;
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
            // Add more climate issues here
        };

        const info = climateData[this.climateIssue.value];
        const infoContent = document.querySelector('.info-content');
        infoContent.innerHTML = `<p>${info.causes}</p>`;
    }
}

new ImageGenerator(); 