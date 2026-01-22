$headers = @{
    'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlja3l2Z3F4bnFla2hpYmtzc2J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE0ODIwMCwiZXhwIjoyMDgzNzI0MjAwfQ.FMh66gKlwu4JayJ50xih-TxyetCs-TWEjXXU7dTL1Bk'
    'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlja3l2Z3F4bnFla2hpYmtzc2J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE0ODIwMCwiZXhwIjoyMDgzNzI0MjAwfQ.FMh66gKlwu4JayJ50xih-TxyetCs-TWEjXXU7dTL1Bk'
    'Content-Type' = 'application/json'
    'Prefer' = 'return=representation'
}

$orderNum = "MM-TEST-" + [DateTimeOffset]::Now.ToUnixTimeSeconds().ToString().Substring(5)

$body = @{
    order_number = $orderNum
    status = "paid"
    customer_email = "test@melodiemacher.de"
    customer_name = "Max Mustermann"
    recipient_name = "Anna Mustermann"
    occasion = "geburtstag"
    relationship = "Meine geliebte Schwester"
    story = "Anna wird 30 Jahre alt! Sie ist meine kleine Schwester und wir haben so viele tolle Erinnerungen zusammen. Als Kinder haben wir immer im Garten gespielt und Abenteuer erlebt. Sie liebt Musik, besonders wenn wir zusammen im Auto singen."
    genre = "pop"
    mood = 4
    allow_english = $false
    package_type = "plus"
    selected_bundle = "plus"
    bump_karaoke = $false
    bump_rush = $false
    bump_gift = $true
    has_custom_lyrics = $false
    base_price = 89
    total_price = 99
    stripe_session_id = "cs_test_abc123"
    stripe_payment_intent_id = "pi_test_xyz789"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri 'https://yckyvgqxnqekhibkssbu.supabase.co/rest/v1/orders' -Method Post -Headers $headers -Body $body
    Write-Host "Test order created successfully!"
    Write-Host "Order Number: $($response.order_number)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
