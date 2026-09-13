import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const output = path.resolve(root, 'dist');

if (path.dirname(output) !== root || path.basename(output) !== 'dist') {
  throw new Error('Directorio de salida inválido');
}

await rm(output, { recursive: true, force: true });
for (const directory of ['assets/css', 'assets/images', 'assets/fonts', 'assets/favicons', 'js']) {
  await mkdir(path.join(output, directory), { recursive: true });
}
await cp(path.join(root, 'index.html'), path.join(output, 'index.html'));
await cp(path.join(root, 'logo_blanco.png'), path.join(output, 'logo_blanco.png'));
await cp(path.join(root, 'sea_logo.png'), path.join(output, 'sea_logo.png'));
await cp(path.join(root, 'assets', 'css', 'sea.css'), path.join(output, 'assets', 'css', 'sea.css'));
await cp(path.join(root, 'assets', 'css', '99-template.css'), path.join(output, 'assets', 'css', '99-template.css'));
await cp(path.join(root, 'js', 'main.js'), path.join(output, 'js', 'main.js'));

const images = [
  'sea-team-desktop.webp', 'sea-team-mobile.webp',
  'sea-solar-desktop.webp', 'sea-solar-mobile.webp',
  'sea-industrial-desktop.webp', 'sea-industrial-mobile.webp',
  'sea-portrait-desktop.webp', 'sea-portrait-mobile.webp',
  'Solar-Panels-Install-Desktop.jpg', 'Solar-Panels-Install-Mobile.jpg', 'Solar-Panels-Install-Tablet.jpg',
  'Solar-Panels-Power-Desktop.jpg', 'Solar-Panels-Power-Mobile.jpg', 'Solar-Panels-Power-Tablet.jpg',
  'Solar-Panels-Save-Desktop.jpg', 'Solar-Panels-Save-Mobile.jpg', 'Solar-Panels-Save-Tablet.jpg',
  'Solar-Panels-Sleek-Desktop.jpg', 'Solar-Panels-Sleek-Mobile.jpg', 'Solar-Panels-Sleek-Tablet.jpg',
  'Solar-Panels-Social.jpg',
  'solar-panels-hero-poster-desktop.jpg', 'solar-panels-hero-poster-mobile.jpg', 'solar-panels-hero-poster-tablet.jpg',
];
const fonts = ['Universal-Sans-Text-Regular.woff2', 'Universal-Sans-Text-Medium.woff2', 'Universal-Sans-Display-Bold.woff2'];

for (const image of images) await cp(path.join(root, 'assets', 'images', image), path.join(output, 'assets', 'images', image));
for (const font of fonts) await cp(path.join(root, 'assets', 'fonts', font), path.join(output, 'assets', 'fonts', font));
await cp(path.join(root, 'assets', 'favicons', 'favicon.svg'), path.join(output, 'assets', 'favicons', 'favicon.svg'));

console.log('Static site built in dist');
