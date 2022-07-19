const path = require('path');
const imageFolder = path.join(__dirname, '..', 'src', 'static', 'images')

const move2originalDir = (files)=>{
    files.forEach(async(v)=>{
        const source = path.parse(v.sourcePath);
        v.destinationPath = `${source.dir.replace(srcdir, distdir)}/${source.name}${source.ext}`;
        await fsPromises.mkdir(path.dirname(v.destinationPath), { recursive: true });
        await writeFile(v.destinationPath, v.data);
    })
}

const run = async () => {
    const imagemin = (await import("imagemin")).default;
    const webp = (await import("imagemin-webp")).default;

    console.log(imageFolder)

    const processedPNGs = await imagemin([`${imageFolder}/**/*.png`], {
        destination: imageFolder,
        preserveDirectories: true,
        plugins: [
            webp({
                lossless: true,
            }),
        ],
    });

    // move2originalDir(processedPNGs)

    // console.log("PNGs processed");
    const processedJPGs = await imagemin([`${imageFolder}/**/*.{jpg,jpeg}`], {
        destination: imageFolder,
        preserveDirectories: true,
        plugins: [
            webp({
                quality: 65,
            }),
        ],
    });

    // move2originalDir(processedJPGs)

    console.log("JPGs and JPEGs processed");
}

run();