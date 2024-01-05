const path = require('path');
const glob = require('glob');

const collectEntryPoints = (sourceRootFolder, entryPointTypes, extension = '(js|ts|jsx|tsx)') =>{
    const __collectEntryPoints = (entryPointType) => {
        return glob.sync(path.join(sourceRootFolder, `**`, `*.${entryPointType}.+${extension}`).replace(/\\/g, '/'));
    };

    return entryPointTypes
        .reduce((a, entryPoint) => [...a, ...__collectEntryPoints(entryPoint)], [])
        .reduce((a, filePath) => {
            const fileName = path.basename(filePath);
            const chunkName = fileName.match(/[^\.]*/);

            return {
                ...a,
                [chunkName]: filePath
            };
        }, {});
};

module.exports = collectEntryPoints;
