const nunjucks = require('nunjucks');
const chokidar = require('chokidar');
const data = require('./data.json');
const fs = require('fs');
const minify = require('html-minifier').minify;

nunjucks.configure({
    autoescape: true,
    noCache: true
});

async function compileHtml() {
    let html = await nunjucks.render('index.njk', data);
    html = await minify(html, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true
    });

    fs.writeFile("index.html", html, function(err) {
        console.log("The HTML file was saved!");

        if(err) {
            return console.log(err);
        }
    });
};

compileHtml();

if (process.argv[2] == 'watch') {
    chokidar.watch('./index.njk').on('change', (event, path) => {
        console.log(`index.njk changed...`);
        compileHtml();
    });
}
