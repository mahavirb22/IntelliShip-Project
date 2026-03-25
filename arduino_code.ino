#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

// ================== PIN CONFIG ==================
#define SENSOR_PIN 4
#define RED_LED 18
#define GREEN_LED 19

// ================== SAMPLING CONFIG ==================
#define SAMPLE_INTERVAL_US 1000
#define WINDOW_DURATION_MS 2000

// ================== WIFI CONFIG ==================
const char* ssid = "Mahavir22";
const char* password = "mahavir2006";

// ================== CLOUD CONFIG ==================
const char* serverURL = "https://intelliship-project.onrender.com/api/events";

// 🔴 IMPORTANT: PUT REAL SHIPMENT ID FROM YOUR UI
String shipmentID = "SHIP253722256RTOU";

// ================== VARIABLES ==================
int pulseCount = 0;
int maxHighDuration = 0;
int totalHighTime = 0;
int risingEdges = 0;

int currentHigh = 0;
int lastSignal = 0;

// ================== SETUP ==================
void setup() {
  Serial.begin(115200);

  pinMode(SENSOR_PIN, INPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);

  digitalWrite(RED_LED, LOW);
  digitalWrite(GREEN_LED, LOW);

  connectWiFi();
}

// ================== WIFI ==================
void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  int retries = 0;

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    retries++;

    if (retries > 30) {
      Serial.println("\nRestarting ESP...");
      ESP.restart();
    }
  }

  Serial.println("\nWiFi Connected!");
}

// ================== LOOP ==================
void loop() {

  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  resetFeatures();

  unsigned long startTime = millis();
  unsigned long lastSampleTime = micros();

  while (millis() - startTime < WINDOW_DURATION_MS) {

    if (micros() - lastSampleTime >= SAMPLE_INTERVAL_US) {
      lastSampleTime += SAMPLE_INTERVAL_US;

      int signal = digitalRead(SENSOR_PIN);
      extractSample(signal);
    }
  }

  if (currentHigh > 0) {
    pulseCount++;
    if (currentHigh > maxHighDuration)
      maxHighDuration = currentHigh;
  }

  float avgHigh = (pulseCount > 0) ? (float)totalHighTime / pulseCount : 0;
  float intensity = (avgHigh * 0.55f) + (risingEdges * 2.0f);
  String severity = classifySeverity(intensity);

  Serial.println("\n===== EVENT =====");
  Serial.println("Intensity: " + String(intensity));
  Serial.println("Severity: " + severity);

  // LED
  if (severity == "HIGH") {
    digitalWrite(RED_LED, HIGH);
    digitalWrite(GREEN_LED, LOW);
  } else {
    digitalWrite(RED_LED, LOW);
    digitalWrite(GREEN_LED, HIGH);
  }

  sendEventToCloud(
    shipmentID,
    severity,
    intensity,
    pulseCount,
    maxHighDuration,
    totalHighTime,
    risingEdges,
    avgHigh
  );

  delay(1000);
}

// ================== RESET ==================
void resetFeatures() {
  pulseCount = 0;
  maxHighDuration = 0;
  totalHighTime = 0;
  risingEdges = 0;
  currentHigh = 0;
  lastSignal = 0;
}

// ================== FEATURE ==================
void extractSample(int signal) {

  if (signal == 1 && lastSignal == 0)
    risingEdges++;

  if (signal == 1) {
    currentHigh++;
    totalHighTime++;
  } else {
    if (currentHigh > 0) {
      pulseCount++;
      if (currentHigh > maxHighDuration)
        maxHighDuration = currentHigh;
      currentHigh = 0;
    }
  }

  lastSignal = signal;
}

// ================== SEVERITY ==================
String classifySeverity(float intensity) {
  if (intensity >= 80.0f) return "HIGH";
  if (intensity >= 40.0f) return "MEDIUM";
  return "LOW";
}

// ================== CLOUD ==================
void sendEventToCloud(
  String shipment_id,
  String severity,
  float intensity,
  int pulseCount,
  int maxHighDuration,
  int totalHighTime,
  int risingEdges,
  float avgHigh
) {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient https;

  if (https.begin(client, serverURL)) {

    https.addHeader("Content-Type", "application/json");

    String jsonData = "{";
    jsonData += "\"shipment_id\":\"" + shipment_id + "\",";
    jsonData += "\"severity\":\"" + severity + "\",";
    jsonData += "\"intensity\":" + String(intensity) + ",";
    jsonData += "\"pulseCount\":" + String(pulseCount) + ",";
    jsonData += "\"maxHigh\":" + String(maxHighDuration) + ",";
    jsonData += "\"totalHigh\":" + String(totalHighTime) + ",";
    jsonData += "\"risingEdges\":" + String(risingEdges) + ",";
    jsonData += "\"avgHigh\":" + String(avgHigh);
    jsonData += "}";

    Serial.println("\n📤 Sending JSON:");
    Serial.println(jsonData);

    int httpCode = https.POST(jsonData);

    Serial.print("HTTP Response: ");
    Serial.println(httpCode);

    String response = https.getString();
    Serial.println("Response Body:");
    Serial.println(response);

    if (httpCode == 200 || httpCode == 201) {
      Serial.println("✅ Event saved successfully");
    } else {
      Serial.println("❌ Backend rejected request");
    }

    https.end();
  }
}