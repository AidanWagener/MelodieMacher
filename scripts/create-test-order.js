require('dotenv').config({ path: '.env.production.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestOrder() {
  const orderNumber = 'MM-TEST-' + Date.now().toString(36).toUpperCase();

  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      status: 'paid',
      customer_email: 'test@melodiemacher.de',
      customer_name: 'Max Mustermann',
      recipient_name: 'Anna Mustermann',
      occasion: 'geburtstag',
      relationship: 'Meine geliebte Schwester',
      story: 'Anna wird 30 Jahre alt! Sie ist meine kleine Schwester und wir haben so viele tolle Erinnerungen zusammen. Als Kinder haben wir immer im Garten gespielt und Abenteuer erlebt. Sie liebt Musik, besonders wenn wir zusammen im Auto singen. Ihr Lieblingslied war immer Somewhere Over the Rainbow. Sie hat immer fuer mich da gewesen, durch gute und schlechte Zeiten. Jetzt moechte ich ihr zeigen, wie viel sie mir bedeutet.',
      genre: 'pop',
      mood: 4,
      allow_english: false,
      package_type: 'plus',
      selected_bundle: 'plus',
      bump_karaoke: false,
      bump_rush: false,
      bump_gift: true,
      has_custom_lyrics: false,
      custom_lyrics: null,
      base_price: 89,
      total_price: 99,
      stripe_session_id: 'cs_test_' + Math.random().toString(36).substring(2),
      stripe_payment_intent_id: 'pi_test_' + Math.random().toString(36).substring(2),
    })
    .select()
    .single();

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } else {
    console.log('Test order created successfully!');
    console.log('Order Number:', data.order_number);
    console.log('Status:', data.status);
    console.log('Customer:', data.customer_name);
    console.log('Recipient:', data.recipient_name);
  }
}

createTestOrder();
