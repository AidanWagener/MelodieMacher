/**
 * MelodieMacher Image Generation Script
 * Uses Google Gemini 2.0 Flash for image generation
 * Model: gemini-2.0-flash-exp-image-generation
 */

import * as fs from 'fs';
import * as path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable not set');
  process.exit(1);
}

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

const BRAND_STYLE = `
Warm, modern illustration style with soft gradients and premium feel.
Color palette: deep navy blue (${BRAND.navy}), warm gold (${BRAND.gold}), soft rose accents (${BRAND.rose}).
Clean lines with subtle texture. German design aesthetic - understated elegance, premium quality.
Emotionally warm but tasteful and sophisticated. Professional European style.
`;

interface ImageSpec {
  name: string;
  prompt: string;
  outputPath: string;
}

const imageSpecs: ImageSpec[] = [
  {
    name: 'OG Social Image',
    prompt: `${BRAND_STYLE}
    Create a sophisticated social media preview image for "MelodieMacher" - a German personalized song gift service.
    Show elegant musical notes floating and forming a heart shape in the center.
    Deep navy blue background with warm gold accents on the musical notes.
    Soft rose highlights. Include subtle sound wave patterns.
    The image should feel warm, emotional, gift-worthy and premium.
    No text in the image. Horizontal landscape composition. Professional marketing image.`,
    outputPath: path.join(IMAGES_DIR, 'og-image.png'),
  },
  {
    name: 'Hero Illustration',
    prompt: `${BRAND_STYLE}
    Create a heartwarming illustration of an emotional gift-giving moment.
    A person receiving a personalized song gift, eyes filled with happy tears, holding a phone with music playing.
    Abstract musical elements and golden particles floating around the scene.
    Warm lighting, intimate atmosphere. Deep navy blue, warm gold accents, soft rose touches.
    The scene conveys the powerful feeling of receiving a unique musical gift.
    Cozy, intimate atmosphere. No text. Abstract and artistic, not photorealistic.`,
    outputPath: path.join(IMAGES_DIR, 'hero-emotion.png'),
  },
  {
    name: 'Avatar - Maria',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a German woman in her early 30s.
    Warm, friendly smile. Modern, stylized illustration style.
    Light brown hair, kind eyes, natural beauty.
    Background in soft navy blue. Warm gold and rose accents.
    Clean, professional look suitable for a testimonial avatar.
    Circular portrait composition. Single person, head and shoulders only.`,
    outputPath: path.join(AVATARS_DIR, 'avatar-maria.png'),
  },
  {
    name: 'Avatar - Thomas',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a German man in his early 40s.
    Confident, warm expression. Modern, stylized illustration style.
    Short dark hair, trustworthy appearance.
    Background in soft navy blue. Warm gold and rose accents.
    Clean look suitable for a testimonial avatar.
    Circular portrait composition. Single person, head and shoulders only.`,
    outputPath: path.join(AVATARS_DIR, 'avatar-thomas.png'),
  },
  {
    name: 'Avatar - Lisa',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a young German woman in her mid-20s.
    Bright, enthusiastic smile. Modern, stylized illustration style.
    Blonde hair, youthful energy, contemporary style.
    Background in soft navy blue. Warm gold and rose accents.
    Clean look suitable for a testimonial avatar.
    Circular portrait composition. Single person, head and shoulders only.`,
    outputPath: path.join(AVATARS_DIR, 'avatar-lisa.png'),
  },
  {
    name: 'Avatar - Klaus',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a distinguished German man in his 50s.
    Wise, warm smile. Modern, stylized illustration style.
    Grey-touched hair, experienced and kind appearance.
    Background in soft navy blue. Warm gold and rose accents.
    Clean look suitable for a testimonial avatar.
    Circular portrait composition. Single person, head and shoulders only.`,
    outputPath: path.join(AVATARS_DIR, 'avatar-klaus.png'),
  },
  {
    name: 'Avatar - Anna',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a German woman in her early 40s.
    Elegant, genuine smile. Modern, stylized illustration style.
    Auburn hair, sophisticated appearance.
    Background in soft navy blue. Warm gold and rose accents.
    Clean look suitable for a testimonial avatar.
    Circular portrait composition. Single person, head and shoulders only.`,
    outputPath: path.join(AVATARS_DIR, 'avatar-anna.png'),
  },
  {
    name: 'Avatar - Michael',
    prompt: `${BRAND_STYLE}
    Professional portrait illustration of a German man in his early 30s.
    Friendly, approachable smile. Modern, stylized illustration style.
    Medium brown hair, casual professional appearance.
    Background in soft navy blue. Warm gold and rose accents.
    Clean look suitable for a testimonial avatar.
    Circular portrait composition. Single person, head and shoulders only.`,
    outputPath: path.join(AVATARS_DIR, 'avatar-michael.png'),
  },
  {
    name: 'Occasion - Wedding',
    prompt: `${BRAND_STYLE}
    Elegant illustration for wedding occasion.
    Two intertwined wedding rings with delicate musical notes flowing around them like a ribbon.
    Deep navy blue background, warm gold rings and accents, soft rose flower petals.
    German wedding aesthetic - romantic but understated, premium quality feel.
    Modern illustration style. Conveys personalized wedding song gift.
    No text. Abstract and symbolic, not showing people.`,
    outputPath: path.join(OCCASIONS_DIR, 'occasion-wedding.png'),
  },
  {
    name: 'Occasion - Birthday',
    prompt: `${BRAND_STYLE}
    Cheerful illustration for birthday occasion.
    An elegant birthday cake with musical notes floating up like candle smoke, transforming into a melody.
    Deep navy blue background, warm gold musical elements, soft rose frosting accents.
    German aesthetic - celebratory but tasteful, premium quality.
    Modern warm illustration style. Conveys personalized birthday song gift.
    No text. Abstract and artistic.`,
    outputPath: path.join(OCCASIONS_DIR, 'occasion-birthday.png'),
  },
  {
    name: 'Occasion - Corporate',
    prompt: `${BRAND_STYLE}
    Professional illustration for corporate celebration occasion.
    A stylized trophy or award with musical notes emanating from it, symbolizing achievement.
    Deep navy blue background, warm gold award and accents, subtle rose highlights.
    German business aesthetic - professional, premium quality, sophisticated.
    Modern illustration style. Conveys corporate milestone song gift.
    No text. Clean and professional.`,
    outputPath: path.join(OCCASIONS_DIR, 'occasion-corporate.png'),
  },
  {
    name: 'Occasion - Family',
    prompt: `${BRAND_STYLE}
    Warm illustration for family occasion.
    A stylized family tree or nurturing hands cradling a heart made of musical notes.
    Deep navy blue background, warm gold musical elements, soft rose heart accents.
    German family aesthetic - loving, nurturing, premium quality feel.
    Modern warm illustration style. Conveys family moment personalized song gift.
    No text. Tender and emotional without being saccharine.`,
    outputPath: path.join(OCCASIONS_DIR, 'occasion-family.png'),
  },
  {
    name: 'Album Cover - Romantic',
    prompt: `${BRAND_STYLE}
    Romantic album cover design for a personalized love song.
    Abstract flowing musical waves forming a heart shape.
    Deep navy blue background, warm gold flowing lines, soft rose romantic highlights.
    German aesthetic - elegant romance, understated passion, premium quality.
    Modern illustration style. Suitable as album artwork.
    Square format album cover. No text.`,
    outputPath: path.join(COVERS_DIR, 'cover-romantic.png'),
  },
  {
    name: 'Album Cover - Celebration',
    prompt: `${BRAND_STYLE}
    Celebration album cover design for a personalized party song.
    Abstract musical notes bursting like confetti, joyful energy.
    Deep navy blue background, warm gold confetti accents, soft rose festive highlights.
    German aesthetic - tasteful celebration, premium quality.
    Modern illustration style. Suitable as album artwork.
    Square format album cover. No text.`,
    outputPath: path.join(COVERS_DIR, 'cover-celebration.png'),
  },
  {
    name: 'Album Cover - Warm',
    prompt: `${BRAND_STYLE}
    Warm emotional album cover design for a heartfelt personalized song.
    Abstract flowing musical waves creating a cozy, embracing feeling.
    Deep navy blue background, warm gold gentle waves, soft rose warm highlights.
    German aesthetic - emotional depth, understated warmth, premium quality.
    Modern illustration style. Suitable as album artwork.
    Square format album cover. No text.`,
    outputPath: path.join(COVERS_DIR, 'cover-warm.png'),
  },
  {
    name: 'Favicon Source',
    prompt: `${BRAND_STYLE}
    Simple, iconic favicon design.
    A single elegant musical note merged with a small heart symbol.
    Deep navy blue background, warm gold note, soft rose heart accent.
    Minimalist, premium quality. Clean vector-style illustration.
    Must be recognizable at small sizes. Simple shapes, no complexity.
    Icon suitable for browser tab. No text. Single iconic symbol only.`,
    outputPath: path.join(IMAGES_DIR, 'favicon-source.png'),
  },
];

async function generateImage(spec: ImageSpec): Promise<boolean> {
  console.log(`\n🎨 Generating: ${spec.name}...`);

  try {
    // Gemini Nano Banana image generation
    // Using gemini-2.5-flash-image (Nano Banana)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate an image with these specifications: ${spec.prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Find the image part in the response
    const candidates = data.candidates || [];
    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          // Decode base64 and save
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          fs.writeFileSync(spec.outputPath, buffer);
          console.log(`✅ Saved: ${spec.outputPath}`);
          return true;
        }
      }
    }

    // Log the response for debugging
    console.log('Response:', JSON.stringify(data, null, 2).slice(0, 500));
    throw new Error('No image data in response');
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('MelodieMacher Image Generation');
  console.log('Using Nano Banana (gemini-2.5-flash-image)');
  console.log('='.repeat(60));
  console.log(`\nTotal images: ${imageSpecs.length}`);

  let success = 0;
  let failed = 0;

  for (const spec of imageSpecs) {
    const result = await generateImage(spec);
    if (result) {
      success++;
    } else {
      failed++;
    }
    // Rate limiting delay
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${success}/${imageSpecs.length}`);
  console.log(`❌ Failed: ${failed}/${imageSpecs.length}`);
  console.log('='.repeat(60));

  if (success > 0) {
    console.log('\nNext steps:');
    console.log('1. Convert favicon-source.png to favicon.ico');
    console.log('2. Create apple-touch-icon.png (180x180) from favicon-source.png');
  }
}

main().catch(console.error);
