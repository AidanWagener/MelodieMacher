import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import PDFDocument from 'pdfkit';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase not configured');
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const occasionLabels: Record<string, string> = {
  hochzeit: 'Hochzeit',
  geburtstag: 'Geburtstag',
  jubilaeum: 'Jubilaeum',
  firma: 'Firmenfeier',
  taufe: 'Taufe',
  andere: 'Besonderer Anlass',
};

const genreLabels: Record<string, string> = {
  pop: 'Pop',
  rock: 'Rock',
  schlager: 'Schlager',
  akustik: 'Akustik',
  hiphop: 'Hip-Hop',
  klassik: 'Klassik',
  kinder: 'Kindermusik',
  electronic: 'Electronic',
  jazz: 'Jazz',
  volksmusik: 'Volksmusik',
};

async function generatePDF(
  songTitle: string,
  occasion: string,
  genre: string,
  recipientName: string,
  lyrics: string,
  coverUrl?: string
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const chunks: Uint8Array[] = [];

      // Create PDF document - A4 size
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: songTitle,
          Author: 'MelodieMacher',
          Subject: `Personalisierter Song - ${occasion}`,
        },
      });

      // Collect PDF data
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Colors
      const primaryColor = '#1E3A5F';
      const goldColor = '#D4AF37';
      const grayColor = '#666666';

      // Header background
      doc.rect(0, 0, doc.page.width, 180)
         .fill(primaryColor);

      // Title
      doc.fontSize(28)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .text(songTitle, 50, 60, { align: 'center', width: doc.page.width - 100 });

      // Subtitle
      doc.fontSize(14)
         .fillColor('#FFFFFF')
         .font('Helvetica')
         .text('Ein personalisierter Song von MelodieMacher', 50, 100, {
           align: 'center',
           width: doc.page.width - 100
         });

      // Occasion badge
      const badgeText = `${occasionLabels[occasion] || occasion} • ${genreLabels[genre] || genre}`;
      doc.fontSize(11)
         .fillColor(goldColor)
         .text(badgeText, 50, 130, { align: 'center', width: doc.page.width - 100 });

      // Gold line separator
      doc.moveTo(50, 200)
         .lineTo(doc.page.width - 50, 200)
         .strokeColor(goldColor)
         .lineWidth(2)
         .stroke();

      // Lyrics section title
      doc.fontSize(12)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('SONGTEXT', 50, 220, { align: 'center', width: doc.page.width - 100 });

      // Lyrics content
      const lyricsLines = lyrics.split('\n');
      let yPosition = 260;
      const lineHeight = 22;
      const maxY = doc.page.height - 100;

      doc.fontSize(12)
         .fillColor(primaryColor)
         .font('Helvetica');

      for (const line of lyricsLines) {
        // Check if we need a new page
        if (yPosition > maxY) {
          doc.addPage();
          yPosition = 50;
        }

        // Detect section headers (lines in brackets or all caps)
        const isSectionHeader = line.match(/^\[.+\]$/) ||
                                (line.length > 0 && line.length < 30 && line === line.toUpperCase());

        if (isSectionHeader) {
          yPosition += 10; // Extra space before sections
          doc.fontSize(11)
             .fillColor(goldColor)
             .font('Helvetica-Bold')
             .text(line.replace(/[\[\]]/g, ''), 50, yPosition, {
               align: 'center',
               width: doc.page.width - 100
             });
          doc.fontSize(12)
             .fillColor(primaryColor)
             .font('Helvetica');
          yPosition += lineHeight + 5;
        } else if (line.trim() === '') {
          yPosition += lineHeight / 2;
        } else {
          doc.text(line, 50, yPosition, { align: 'center', width: doc.page.width - 100 });
          yPosition += lineHeight;
        }
      }

      // Footer
      const footerY = doc.page.height - 60;

      doc.moveTo(50, footerY - 20)
         .lineTo(doc.page.width - 50, footerY - 20)
         .strokeColor('#E0E0E0')
         .lineWidth(1)
         .stroke();

      doc.fontSize(10)
         .fillColor(grayColor)
         .font('Helvetica')
         .text(`Erstellt mit Liebe fuer ${recipientName}`, 50, footerY, {
           align: 'center',
           width: doc.page.width - 100
         });

      doc.fontSize(9)
         .fillColor(goldColor)
         .text('melodiemacher.de', 50, footerY + 15, {
           align: 'center',
           width: doc.page.width - 100
         });

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();
    const { orderId, orderNumber, lyrics } = await request.json();

    if (!orderId || !orderNumber) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    if (!lyrics || lyrics.trim().length === 0) {
      return NextResponse.json({
        error: 'Lyrics required. Please enter the song lyrics to generate PDF.'
      }, { status: 400 });
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get album cover if exists
    const { data: coverDeliverable } = await supabase
      .from('deliverables')
      .select('file_url')
      .eq('order_id', orderId)
      .eq('type', 'png')
      .single();

    // Generate PDF
    const songTitle = `Song fuer ${order.recipient_name}`;
    const pdfBuffer = await generatePDF(
      songTitle,
      order.occasion,
      order.genre,
      order.recipient_name,
      lyrics,
      coverDeliverable?.file_url
    );

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const fileName = `${orderNumber}/lyrics_${timestamp}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('deliverables')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('PDF upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('deliverables')
      .getPublicUrl(fileName);

    // Create deliverable record
    const { data: deliverable, error: dbError } = await supabase
      .from('deliverables')
      .insert({
        order_id: orderId,
        type: 'pdf',
        file_url: publicUrl,
        file_name: `${order.recipient_name}_Lyrics.pdf`,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to save deliverable' }, { status: 500 });
    }

    return NextResponse.json({
      deliverable,
      message: 'PDF generated successfully',
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
