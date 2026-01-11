/**
 * MelodieMacher Image Generation Script
 * Uses OpenAI gpt-image-1.5 (returns base64, not URLs)
 * Optimized for German market with premium brand aesthetic
 */

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const openai = new OpenAI();

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const AVATARS_DIR = path.join(IMAGES_DIR, 'avatars');
const OCCASIONS_DIR = path.join(IMAGES_DIR, 'occasions');
const COVERS_DIR = path.join(IMAGES_DIR, 'covers');

// Ensure directories exist
[PUBLIC_DIR, IMAGES_DIR, AVATARS_DIR, OCCASIONS_DIR, COVERS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Brand colors
const BRAND = {
  navy: '#1E3A5F',
  gold: '#D4A843',
  rose: '#E8B4B8',
};

// Brand style guide for consistent generation - German market optimized
const BRAND_STYLE = `
Warm, modern illustration style with soft gradients and premium feel.
Color palette: deep navy blue (${BRAND.navy}), warm gold (${BRAND.gold}), soft rose accents (${BRAND.rose}).
Clean lines with subtle texture. German design aesthetic - understated elegance, premium quality, not overly flashy.
Emotionally warm but tasteful and sophisticated. Professional European style.
`;

// Valid sizes for gpt-image-1.5: 1024x1024, 1536x1024 (landscape), 1024x1536 (portrait), auto
type ImageSize = '1024x1024' | '1536x1024' | '1024x1536' | 'auto';

interface ImageSpec {
  name: string;
  prompt: string;
  size: ImageSize;
  outputPath: string;
}

const imageSpecs: ImageSpec[] = [
  // OG Image for social sharing (landscape)
  {
    name: 'OG Social Image',
    prompt: `${BRAND_STYLE}
    Create a sophisticated social media preview image for "MelodieMacher" - a German personalized song gift service.
    Show elegant musical notes floating and forming a heart shape in the center.
    Deep navy blue background (${BRAND.navy}) with warm gold accents (${BRAND.gold}) on the musical notes.
    Soft rose highlights (${BRAND.rose}). Include subtle sound wave patterns.
    The image should feel warm, emotional, gift-worthy and premium.
    No text in the image. Horizontal landscape composition suitable for social media cards.
    German aesthetic - understated elegance, premium quality. Professional marketing image.`,
    size: '1536x1024',
    outputPath: path.join(IMAGES_DIR, 'og-image.png'),
  },

  // Hero emotional illustration
  {
    name: 'Hero Illustration',
    prompt: `${BRAND_STYLE}
    Create a heartwarming illustration of an emotional gift-giving moment.
    A person receiving a personalized song gift, eyes filled with happy tears, holding a phone with music playing.
    Abstract musical elements and golden particles floating around the scene.
    Warm lighting, intimate atmosphere. Color palette: deep navy blue (${BRAND.navy}), warm gold accents (${BRAND.gold}), soft rose touches (${BRAND.rose}).
    German aesthetic - subtle emotion, understated elegance.
    The scene conveys the powerful feeling of receiving a unique musical gift.
    Cozy, intimate atmosphere. No text. Abstract and artistic, not photorealistic.`,
    size: '1024x1024',
    outputPath: path.join(IMAGES_DIR, 'hero-emotion.png'),
  },

  // Testimonial Avatars (6 diverse illustrated portraits for German market)
  {
    name: 'Avatar - Maria',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a German woman in her early 30s.
    Warm, friendly smile. Modern, stylized illustration style.
    She has light brown hair, kind eyes, natural beauty.
    Background in soft navy blue (${BRAND.navy}). Warm gold and rose accents.
    German aesthetic - natural beauty, understated elegance.
    Clean, professional look suitable for a testimonial.
    Circular portrait composition. Single person, head and shoulders only.`,
    size: '1024x1024',
    outputPath: path.join(AVATARS_DIR, 'avatar-maria.png'),
  },
  {
    name: 'Avatar - Thomas',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a German man in his early 40s.
    Confident, warm expression. Modern, stylized illustration style.
    He has short dark hair, trustworthy appearance.
    Background in soft navy blue (${BRAND.navy}). Warm gold and rose accents.
    German aesthetic - reliable, professional.
    Clean look suitable for a testimonial.
    Circular portrait composition. Single person, head and shoulders only.`,
    size: '1024x1024',
    outputPath: path.join(AVATARS_DIR, 'avatar-thomas.png'),
  },
  {
    name: 'Avatar - Lisa',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a young German woman in her mid-20s.
    Bright, enthusiastic smile. Modern, stylized illustration style.
    She has blonde hair, youthful energy, contemporary style.
    Background in soft navy blue (${BRAND.navy}). Warm gold and rose accents.
    German aesthetic - fresh, modern.
    Clean look suitable for a testimonial.
    Circular portrait composition. Single person, head and shoulders only.`,
    size: '1024x1024',
    outputPath: path.join(AVATARS_DIR, 'avatar-lisa.png'),
  },
  {
    name: 'Avatar - Klaus',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a distinguished German man in his 50s.
    Wise, warm smile. Modern, stylized illustration style.
    He has grey-touched hair, experienced and kind appearance.
    Background in soft navy blue (${BRAND.navy}). Warm gold and rose accents.
    German aesthetic - mature elegance, trustworthy.
    Clean look suitable for a testimonial.
    Circular portrait composition. Single person, head and shoulders only.`,
    size: '1024x1024',
    outputPath: path.join(AVATARS_DIR, 'avatar-klaus.png'),
  },
  {
    name: 'Avatar - Anna',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a German woman in her early 40s.
    Elegant, genuine smile. Modern, stylized illustration style.
    She has auburn hair, sophisticated appearance.
    Background in soft navy blue (${BRAND.navy}). Warm gold and rose accents.
    German aesthetic - refined, warm personality.
    Clean look suitable for a testimonial.
    Circular portrait composition. Single person, head and shoulders only.`,
    size: '1024x1024',
    outputPath: path.join(AVATARS_DIR, 'avatar-anna.png'),
  },
  {
    name: 'Avatar - Michael',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a German man in his early 30s.
    Friendly, approachable smile. Modern, stylized illustration style.
    He has medium brown hair, casual professional appearance.
    Background in soft navy blue (${BRAND.navy}). Warm gold and rose accents.
    German aesthetic - modern, reliable.
    Clean look suitable for a testimonial.
    Circular portrait composition. Single person, head and shoulders only.`,
    size: '1024x1024',
    outputPath: path.join(AVATARS_DIR, 'avatar-michael.png'),
  },

  // Occasion illustrations
  {
    name: 'Occasion - Wedding',
    prompt: `${BRAND_STYLE}
    Elegant illustration for wedding occasion.
    Two intertwined wedding rings with delicate musical notes flowing around them like a ribbon.
    Deep navy blue background (${BRAND.navy}), warm gold rings and accents (${BRAND.gold}), soft rose flower petals (${BRAND.rose}).
    German wedding aesthetic - romantic but understated, premium quality feel.
    Modern illustration style. Conveys the idea of a personalized wedding song gift.
    No text. Abstract and symbolic, not showing people.`,
    size: '1024x1024',
    outputPath: path.join(OCCASIONS_DIR, 'occasion-wedding.png'),
  },
  {
    name: 'Occasion - Birthday',
    prompt: `${BRAND_STYLE}
    Cheerful illustration for birthday occasion.
    An elegant birthday cake with musical notes floating up like candle smoke, transforming into a melody.
    Deep navy blue background (${BRAND.navy}), warm gold musical elements (${BRAND.gold}), soft rose frosting accents (${BRAND.rose}).
    German aesthetic - celebratory but tasteful, premium quality.
    Modern warm illustration style. Conveys personalized birthday song gift.
    No text. Abstract and artistic.`,
    size: '1024x1024',
    outputPath: path.join(OCCASIONS_DIR, 'occasion-birthday.png'),
  },
  {
    name: 'Occasion - Corporate',
    prompt: `${BRAND_STYLE}
    Professional illustration for corporate celebration occasion.
    A stylized trophy or award with musical notes emanating from it, symbolizing achievement celebration.
    Deep navy blue background (${BRAND.navy}), warm gold award and accents (${BRAND.gold}), subtle rose highlights (${BRAND.rose}).
    German business aesthetic - professional, premium quality, sophisticated.
    Modern illustration style. Conveys corporate milestone song gift.
    No text. Clean and professional.`,
    size: '1024x1024',
    outputPath: path.join(OCCASIONS_DIR, 'occasion-corporate.png'),
  },
  {
    name: 'Occasion - Family',
    prompt: `${BRAND_STYLE}
    Warm illustration for family occasion.
    A stylized family tree or nurturing hands cradling a heart made of musical notes.
    Deep navy blue background (${BRAND.navy}), warm gold musical elements (${BRAND.gold}), soft rose heart accents (${BRAND.rose}).
    German family aesthetic - loving, nurturing, premium quality feel.
    Modern warm illustration style. Conveys family moment personalized song gift.
    No text. Tender and emotional without being saccharine.`,
    size: '1024x1024',
    outputPath: path.join(OCCASIONS_DIR, 'occasion-family.png'),
  },

  // Album cover templates
  {
    name: 'Album Cover - Romantic',
    prompt: `${BRAND_STYLE}
    Romantic album cover design for a personalized love song.
    Abstract flowing musical waves forming a heart shape.
    Deep navy blue background (${BRAND.navy}), warm gold flowing lines and accents (${BRAND.gold}), soft rose highlights creating romantic atmosphere (${BRAND.rose}).
    German aesthetic - elegant romance, understated passion, premium quality.
    Modern illustration style. Suitable as album artwork.
    Square format album cover style. No text.`,
    size: '1024x1024',
    outputPath: path.join(COVERS_DIR, 'cover-romantic.png'),
  },
  {
    name: 'Album Cover - Celebration',
    prompt: `${BRAND_STYLE}
    Celebration album cover design for a personalized party song.
    Abstract musical notes bursting like confetti, joyful energy.
    Deep navy blue background (${BRAND.navy}), warm gold confetti and accents (${BRAND.gold}), soft rose festive highlights (${BRAND.rose}).
    German aesthetic - tasteful celebration, premium quality.
    Modern illustration style. Suitable as album artwork.
    Square format album cover style. No text.`,
    size: '1024x1024',
    outputPath: path.join(COVERS_DIR, 'cover-celebration.png'),
  },
  {
    name: 'Album Cover - Warm',
    prompt: `${BRAND_STYLE}
    Warm emotional album cover design for a heartfelt personalized song.
    Abstract flowing musical waves creating a cozy, embracing feeling.
    Deep navy blue background (${BRAND.navy}), warm gold gentle waves (${BRAND.gold}), soft rose warm highlights (${BRAND.rose}).
    German aesthetic - emotional depth, understated warmth, premium quality.
    Modern illustration style. Suitable as album artwork.
    Square format album cover style. No text.`,
    size: '1024x1024',
    outputPath: path.join(COVERS_DIR, 'cover-warm.png'),
  },

  // Favicon source
  {
    name: 'Favicon Source',
    prompt: `${BRAND_STYLE}
    Simple, iconic favicon design.
    A single elegant musical note merged with a small heart symbol.
    Deep navy blue background (${BRAND.navy}), warm gold note (${BRAND.gold}), soft rose heart accent (${BRAND.rose}).
    German aesthetic - minimalist, premium quality.
    Clean vector-style illustration. Must be recognizable at small sizes.
    Simple shapes, no complexity. Icon suitable for browser tab.
    No text. Single iconic symbol only.`,
    size: '1024x1024',
    outputPath: path.join(IMAGES_DIR, 'favicon-source.png'),
  },
];

async function generateImage(spec: ImageSpec): Promise<boolean> {
  console.log(`\nGenerating: ${spec.name}...`);
  console.log(`Size: ${spec.size}`);
  console.log(`Output: ${spec.outputPath}`);

  try {
    // gpt-image-1.5 returns base64 (b64_json), NOT URLs
    const response = await openai.images.generate({
      model: 'gpt-image-1.5',
      prompt: spec.prompt,
      n: 1,
      size: spec.size,
      quality: 'high',
    });

    // GPT image models ALWAYS return base64
    const b64Json = response.data?.[0]?.b64_json;

    if (!b64Json) {
      throw new Error('No b64_json in response - GPT image models should always return base64');
    }

    // Decode base64 and save to file
    const imageBuffer = Buffer.from(b64Json, 'base64');
    fs.writeFileSync(spec.outputPath, imageBuffer);
    console.log(`✅ Saved: ${spec.name}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Error generating ${spec.name}:`, error.message);

    // Provide helpful error messages
    if (error.status === 403) {
      console.error('   → Your organization needs verification for gpt-image-1.5');
      console.error('   → Go to: https://platform.openai.com/settings/organization/general');
    } else if (error.status === 400) {
      console.error('   → Check size/format parameters');
    } else if (error.status === 401) {
      console.error('   → Check your OPENAI_API_KEY environment variable');
    }

    return false;
  }
}

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('MelodieMacher Image Generation Script');
  console.log('Using OpenAI gpt-image-1.5 Model');
  console.log('Optimized for German Market');
  console.log('='.repeat(60));
  console.log(`\nOutput directory: ${PUBLIC_DIR}`);
  console.log(`Total images to generate: ${imageSpecs.length}`);

  let successCount = 0;
  let failCount = 0;

  // Generate all images
  for (const spec of imageSpecs) {
    const success = await generateImage(spec);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('Generation Complete!');
  console.log(`✅ Success: ${successCount}/${imageSpecs.length}`);
  console.log(`❌ Failed: ${failCount}/${imageSpecs.length}`);
  console.log('='.repeat(60));

  if (successCount > 0) {
    console.log('\nNext steps:');
    console.log('1. Convert favicon-source.png to favicon.ico (use online converter)');
    console.log('2. Create apple-touch-icon.png (180x180) from favicon-source.png');
    console.log('3. Review generated images and regenerate any that need adjustment');
  }

  if (failCount > 0 && failCount === imageSpecs.length) {
    console.log('\n⚠️  All images failed!');
    console.log('If you see 403 errors, verify your organization at:');
    console.log('https://platform.openai.com/settings/organization/general');
  }
}

main().catch(console.error);
