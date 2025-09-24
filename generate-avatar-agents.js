const fs = require('fs');

// Leer el archivo agents.json
const agentsData = JSON.parse(fs.readFileSync('./agents.json', 'utf8'));

// Función para generar URL de avatar usando DiceBear
function generateAvatarUrl(name, style = 'initials') {
    const encodedName = encodeURIComponent(name);
    
    // Opciones de estilos: initials, avataaars, bottts, identicon, etc.
    const styles = {
        initials: `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&backgroundColor=random`,
        avataaars: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}`,
        bottts: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodedName}`,
        identicon: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodedName}`,
        shapes: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodedName}`
    };
    
    return styles[style] || styles.initials;
}

// Función alternativa usando UI Avatars
function generateUIAvatar(name) {
    const initials = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=128&bold=true`;
}

// Procesar agentes con diferentes opciones
const processedAgents = agentsData.map(agent => {
    return {
        ...agent,
        // Opción 1: DiceBear con iniciales
        icon: generateAvatarUrl(agent.name, 'initials'),
        
        // Opción 2: DiceBear con avatares (descomenta para usar)
        // icon: generateAvatarUrl(agent.name, 'avataaars'),
        
        // Opción 3: UI Avatars (descomenta para usar)
        // icon: generateUIAvatar(agent.name),
    };
});

// Guardar el archivo actualizado
fs.writeFileSync('./agents-avatars.json', JSON.stringify(processedAgents, null, 2));
console.log('✓ Archivo agents-avatars.json creado con avatares generados automáticamente');
console.log('✓ Se han reemplazado todas las URLs de iconos con avatares genéricos');
