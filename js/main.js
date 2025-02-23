import ImageGenerator from './imageGeneration.js'; // Import the class

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const resultsSection = document.querySelector('.results-section');
    const locationInput = document.getElementById('location');
    const climateIssueSelect = document.getElementById('climate-issue');

    // Instantiate ImageGenerator when DOM is loaded
    const imageGenerator = new ImageGenerator();

    generateBtn.addEventListener('click', async () => {
        const location = locationInput.value;
        const climateIssue = climateIssueSelect.value;

        if (!location || !climateIssue) {
            alert('Please fill in all fields');
            return;
        }

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        try {
            // Call generateImages method directly on the instantiated object
            await imageGenerator.generateImages();  // This will now use the class properties

            // Show results section
            resultsSection.classList.remove('hidden');
            
            // Update climate info
            updateClimateInfo(climateIssue);
        } catch (error) {
            console.error('Error generating images:', error);
            alert('Failed to generate images. Please try again.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Vision';
        }
    });

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateClimateInfo(climateIssueSelect.value, button.textContent.toLowerCase());
        });
    });
});

function updateClimateInfo(climateIssue, tab = 'causes') {
    const infoContent = document.querySelector('.info-content');
    const climateData = {
        'rising-sea': {
            causes: 'Global warming, thermal expansion of oceans, melting ice caps',
            effects: 'Coastal flooding, erosion, displacement of communities',
            solutions: 'Reduce carbon emissions, protect coastal wetlands, implement flood defense systems'
        },
        'deforestation': {
            causes: 'Agriculture expansion, logging, urbanization',
            effects: 'Loss of biodiversity, soil erosion, increased CO2 emissions',
            solutions: 'Sustainable forestry, reforestation programs, reduced paper consumption'
        },
    };

    infoContent.innerHTML = `<p>${climateData[climateIssue][tab]}</p>`;
}
