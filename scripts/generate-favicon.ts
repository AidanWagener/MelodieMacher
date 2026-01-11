/**
 * Generate favicon.ico and apple-touch-icon.png from favicon-source.png
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Favicon Generation');
  console.log('='.repeat(60));

  const sourcePath = path.join(IMAGES_DIR, 'favicon-source.png');

  if (!fs.existsSync(sourcePath)) {
    console.error('❌ favicon-source.png not found');
    process.exit(1);
  }

  try {
    // Generate apple-touch-icon.png (180x180)
    console.log('\n📱 Generating apple-touch-icon.png (180x180)...');
    await sharp(sourcePath)
      .resize(180, 180, { fit: 'contain', background: { r: 30, g: 58, b: 95, alpha: 1 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
    console.log('✅ Saved: public/apple-touch-icon.png');

    // Generate multiple sizes for favicon.ico
    console.log('\n🎨 Generating favicon sizes...');
    const sizes = [16, 32, 48];
    const pngBuffers: Buffer[] = [];

    for (const size of sizes) {
      const tempPath = path.join(IMAGES_DIR, `favicon-${size}.png`);
      await sharp(sourcePath)
        .resize(size, size, { fit: 'contain', background: { r: 30, g: 58, b: 95, alpha: 1 } })
        .png()
        .toFile(tempPath);
      console.log(`  ✅ Generated ${size}x${size}`);
    }

    // Create favicon.ico from the 32x32 version
    console.log('\n🔧 Creating favicon.ico...');
    const favicon32Path = path.join(IMAGES_DIR, 'favicon-32.png');
    const icoBuffer = await pngToIco([favicon32Path]);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
    console.log('✅ Saved: public/favicon.ico');

    // Also create favicon.png for modern browsers
    console.log('\n🖼️ Creating favicon.png (32x32)...');
    fs.copyFileSync(
      path.join(IMAGES_DIR, 'favicon-32.png'),
      path.join(PUBLIC_DIR, 'favicon.png')
    );
    console.log('✅ Saved: public/favicon.png');

    // Clean up temp files
    console.log('\n🧹 Cleaning up...');
    for (const size of sizes) {
      const tempPath = path.join(IMAGES_DIR, `favicon-${size}.png`);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
    console.log('✅ Cleaned up temporary files');

    console.log('\n' + '='.repeat(60));
    console.log('✅ All favicon files generated successfully!');
    console.log('='.repeat(60));
    console.log('\nGenerated files:');
    console.log('  - public/favicon.ico (for browsers)');
    console.log('  - public/favicon.png (for modern browsers)');
    console.log('  - public/apple-touch-icon.png (for iOS)');

  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
