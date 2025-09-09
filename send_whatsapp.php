<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name     = $_POST['name'];
    $email    = $_POST['email'];
    $phone    = $_POST['phone'];
    $interest = $_POST['interest'];
    $message  = $_POST['message'];

    $curl = curl_init();

    $payload = [
        "integrated_number" => "15557341509", // Your WhatsApp Integrated Number
        "content_type" => "template",
        "payload" => [
            "messaging_product" => "whatsapp",
            "type" => "template",
            "template" => [
                "name" => "allstar_contact_form_alert", // Approved template
                "language" => [
                    "code" => "en",
                    "policy" => "deterministic"
                ],
                "namespace" => "8606aba3_99bf_41f5_b236_368ffad4afad",
                "to_and_components" => [
                    [
                        "to" => ["919171325552"], // Your WhatsApp number
                        "components" => [
                            "body_1" => ["type" => "text", "value" => $name],
                            "body_2" => ["type" => "text", "value" => $email],
                            "body_3" => ["type" => "text", "value" => $phone],
                            "body_4" => ["type" => "text", "value" => $interest],
                            "body_5" => ["type" => "text", "value" => $message],
                        ]
                    ]
                ]
            ]
        ]
    ];

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "authkey: 440681AXBbHboUyxQG67a37427P1"
        ],
		CURLOPT_SSL_VERIFYHOST => 0,  // disable SSL host verification
		CURLOPT_SSL_VERIFYPEER => 0   // disable SSL peer verification
    ]);

    $response = curl_exec($curl);
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($curl);
    curl_close($curl);

    header("Content-Type: application/json");

    if ($curl_error) {
        echo json_encode(['status' => 'error', 'message' => $curl_error]);
        exit;
    }

    $decodedResponse = json_decode($response, true);

    if (!$decodedResponse) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid API response', 'raw_response' => $response]);
        exit;
    }

    // Final JSON response to frontend
    if ($httpcode == 200) {
        echo json_encode([
            "status" => "success",
            "api_response" => $decodedResponse
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "http_code" => $httpcode,
            "api_response" => $decodedResponse
        ]);
    }
}
?>
