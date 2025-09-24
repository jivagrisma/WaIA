const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Crear directorio para iconos si no existe
const iconsDir = './icons';
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// Leer el archivo agents.json
const agentsData = JSON.parse(fs.readFileSync('./agents.json', 'utf8'));

async function downloadIcon(url, filename) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });
        
        const writer = fs.createWriteStream(path.join(iconsDir, filename));
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
        return null;
    }
}

async function processAgents() {
    console.log('Descargando iconos...');
    
    for (let i = 0; i < agentsData.length; i++) {
        const agent = agentsData[i];
        const iconUrl = agent.icon;
        
        if (iconUrl && iconUrl.includes('wasapmarket.portal-labs-files.uk')) {
            // Extraer el nombre del archivo de la URL
            const urlParts = iconUrl.split('/');
            const originalFilename = urlParts[urlParts.length - 1];
            
            // Crear un nombre de archivo único basado en el nombre del agente
            const sanitizedName = agent.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            const extension = path.extname(originalFilename) || '.png';
            const newFilename = `${sanitizedName}${extension}`;
            
            console.log(`Descargando icono para ${agent.name}...`);
            
            const success = await downloadIcon(iconUrl, newFilename);
            if (success !== null) {
                // Actualizar la URL en el objeto
                agent.icon = `./icons/${newFilename}`;
                console.log(`✓ Descargado: ${newFilename}`);
            } else {
                console.log(`✗ Error descargando: ${agent.name}`);
            }
        }
    }
    
    // Guardar el archivo actualizado
    fs.writeFileSync('./agents-local.json', JSON.stringify(agentsData, null, 2));
    console.log('\n✓ Proceso completado. Archivo guardado como agents-local.json');
    console.log('✓ Iconos descargados en la carpeta ./icons/');
}

processAgents().catch(console.error);
