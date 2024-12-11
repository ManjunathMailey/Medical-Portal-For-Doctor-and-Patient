// JavaScript File: scripts.js

// Logout Functionality
document.getElementById('logoutBtn').addEventListener('click', function () {
    // Clear session-related data (like tokens) from localStorage
    localStorage.removeItem('userToken');

    // Redirect to login page
    window.location.href = 'auth.html';
});

// Three.js Background Animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x4AADEF,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 3;

function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Chart.js Example: Real-Time Heart Rate
const ctxHeartRate = document.getElementById('heartRateChart').getContext('2d');
new Chart(ctxHeartRate, {
    type: 'line',
    data: {
        labels: ['10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM'],
        datasets: [{
            label: 'Heart Rate (bpm)',
            data: [72, 75, 80, 76, 78],
            borderColor: '#4AADEF',
            fill: false,
            tension: 0.4,
        }],
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Heart Rate (bpm)'
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Time'
                },
            },
        },
    },
});
