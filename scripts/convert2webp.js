const path = require('path');
const imageFolder = path.join(__dirname, '..', 'src', 'static', 'images')
const { promises } = require('node:fs')
const { promisify } = require('node:util')
const fs = require('graceful-fs');

const fsPromises = promises;
const writeFile = promisify(fs.writeFile);

const move2originalDir = async(files)=>{

    for(const file of files){
        const currDestinationPath = file.destinationPath.replace(/\\/g, '/');

        const source = path.parse(file.sourcePath);
        const destination = path.parse(currDestinationPath);
        const newDestinationPath = `${source.dir}/${destination.name}${destination.ext}`;

        // console.log(currDestinationPath, newDestinationPath)

        if(currDestinationPath === newDestinationPath){
            continue
        }

        await fsPromises.mkdir(path.dirname(newDestinationPath), { recursive: true });

        // save a webp file in the original directory
        await writeFile(newDestinationPath, file.data);

        // remove the original webp file because it's no longer needed
        await fsPromises.unlink(currDestinationPath)
    }
}

const run = async () => {
    const imagemin = (await import("imagemin")).default;
    const webp = (await import("imagemin-webp")).default;

    const processedPNGs = await imagemin([`${imageFolder}/**/*.png`], {
        destination: imageFolder,
        preserveDirectories: true,
        plugins: [
            webp({
                lossless: true,
            }),
        ],
    });

    await move2originalDir(processedPNGs)
    console.log("PNGs processed");

    const processedJPGs = await imagemin([`${imageFolder}/**/*.{jpg,jpeg}`], {
        destination: imageFolder,
        preserveDirectories: true,
        plugins: [
            webp({
                quality: 65,
            }),
        ],
    });

    await move2originalDir(processedJPGs)
    console.log("JPGs and JPEGs processed");
}

run();