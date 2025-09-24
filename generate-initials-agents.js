const fs = require('fs');

// Leer el archivo agents.json
const agentsData = JSON.parse(fs.readFileSync('./agents.json', 'utf8'));

// Función para generar iniciales
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2); // Máximo 2 caracteres
}

// Función para generar un color basado en el nombre
function getColorFromName(name) {
    const colors = [
        '#3B82F6', // blue
        '#10B981', // emerald
        '#8B5CF6', // violet
        '#F59E0B', // amber
        '#EF4444', // red
        '#06B6D4', // cyan
        '#84CC16', // lime
        '#F97316', // orange
        '#EC4899', // pink
        '#6366F1'  // indigo
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
}

// Procesar agentes
const processedAgents = agentsData.map(agent => {
    const initials = getInitials(agent.name);
    const color = getColorFromName(agent.name);
    
    return {
        ...agent,
        icon: null, // Remover la URL del icono
        initials: initials,
        color: color
    };
});

// Guardar el archivo actualizado
fs.writeFileSync('./agents-initials.json', JSON.stringify(processedAgents, null, 2));
console.log('✓ Archivo agents-initials.json creado con iniciales y colores generados');
console.log('✓ Se han removido todas las URLs de iconos externos');
