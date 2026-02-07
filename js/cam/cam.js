const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const filtreImg = document.getElementById('filtre-img');
const statusText = document.getElementById('status');

const images = {
    base: '../img/cam/base.jpg',
    doigts: '../img/cam/4.jpg',
    bouche: '../img/cam/bouche.jpg'
};

let boucheOuverte = false;
let nbDoigts = 0;

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    nbDoigts = 0;
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 2});
            const tips = [8, 12, 16, 20];
            const joints = [6, 10, 14, 18];
            tips.forEach((tip, i) => {
                if (landmarks[tip].y < landmarks[joints[i]].y) nbDoigts++;
            });
        }
    }
    updateDisplay();
    canvasCtx.restore();
}

function onFaceResults(results) {
    boucheOuverte = false;
    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            const levreSup = landmarks[13].y;
            const levreInf = landmarks[14].y;
            if (Math.abs(levreInf - levreSup) > 0.04) {
                boucheOuverte = true;
            }
        }
    }
}

function updateDisplay() {
    if (boucheOuverte) {
        filtreImg.src = images.bouche;
        statusText.innerText = "Statut : BOUCHE OUVERTE";
    } else if (nbDoigts >= 4) {
        filtreImg.src = images.doigts;
        statusText.innerText = "Statut : 4 DOIGTS";
    } else {
        filtreImg.src = images.base;
        statusText.innerText = "Statut : Repos";
    }
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  modelComplexity: 1,
  maxNumHands: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const faceMesh = new FaceMesh({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  }
});

faceMesh.setOptions({
  maxNumFaceLandmarks: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
});
faceMesh.onResults(onFaceResults);

if (typeof Camera !== 'undefined') {
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
            await faceMesh.send({image: videoElement});
        },
        width: 640,
        height: 480
    });
    console.log("Tentative de démarrage de la caméra...");
    camera.start();
} else {
    console.error("L'utilitaire Camera de MediaPipe n'est pas chargé !");
}