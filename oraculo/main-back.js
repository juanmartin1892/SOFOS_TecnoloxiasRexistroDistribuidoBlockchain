const https = require('https');
const { spawn } = require('child_process');

// URL del script Python en GitHub
const scriptUrl = 'https://raw.githubusercontent.com/juanmartin1892/SOFOS_TecnoloxiasRexistroDistribuidoBlockchain/refs/heads/main/scripts/hellowWorld.py';

// Función para descargar el script desde GitHub
function downloadPythonScript(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to get file: ${response.statusCode}`));
            }
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}

// Función para ejecutar el script Python directamente
async function executePythonScript() {
    try {
        const scriptContent = await downloadPythonScript(scriptUrl);

        // Ejecutar el script directamente con Python
        const pythonProcess = spawn('python3', ['-c', scriptContent]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`Output: ${data.toString()}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Process exited with code: ${code}`);
        });
    } catch (err) {
        console.error(`Failed to execute script: ${err.message}`);
    }
}

// Ejecutar la función
executePythonScript();
