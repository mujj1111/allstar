export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const { name, email, phone, interest, message } = data;

    // MSG91 API payload
    const payload = {
      "integrated_number": "15557341509", // Your WhatsApp Integrated Number
      "content_type": "template",
      "payload": {
        "messaging_product": "whatsapp",
        "type": "template",
        "template": {
          "name": "allstar_contact_form_alert", // Approved template
          "language": { "code": "en", "policy": "deterministic" },
          "namespace": "8606aba3_99bf_41f5_b236_368ffad4afad",
          "to_and_components": [
            {
              "to": ["918220689771","919171325552"], // Your WhatsApp number
              "components": {
                "body_1": { "type": "text", "value": name },
                "body_2": { "type": "text", "value": email },
                "body_3": { "type": "text", "value": phone },
                "body_4": { "type": "text", "value": interest },
                "body_5": { "type": "text", "value": message }
              }
            }
          ]
        }
      }
    };

    // Call MSG91 API
    const res = await fetch(
      "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authkey": "440681AXBbHboUyxQG67a37427P1"
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await res.json();

    return new Response(JSON.stringify({
      status: res.ok ? "success" : "error",
      api_response: result
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({
      status: "error",
      message: err.message
    }), { headers: { "Content-Type": "application/json" }, status: 500 });
  }
}

