#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

// ================== PIN CONFIG ==================
#define SENSOR_PIN 4
#define RED_LED 18
#define GREEN_LED 19

// ================== SAMPLING CONFIG ==================
#define SAMPLE_INTERVAL_US 1000     // 1 ms (1000 Hz)
#define WINDOW_DURATION_MS 2000     // 2 second window

// ================== WIFI CONFIG ==================
const char* ssid = "Mahavir22";
const char* password = "mahavir2006";

// ================== CLOUD CONFIG ==================
const char* serverURL = "https://intelliship.onrender.com/api/events";
String shipmentID = "SHIP001";   // Change dynamically later if needed

// ================== FEATURE VARIABLES ==================
int pulseCount = 0;
int maxHighDuration = 0;
int totalHighTime = 0;
int risingEdges = 0;

int currentHigh = 0;
int lastSignal = 0;

// ================== FUNCTION DECLARATIONS ==================
void resetFeatures();
void extractSample(int signal);
String classifySeverity(float intensity);
void sendEventToCloud(
  String shipment_id,
  String severity,
  float intensity,
  int pulseCount,
  int maxHighDuration,
  int totalHighTime,
  int risingEdges,
  float avgHigh
);

// ================== SETUP ==================
void setup() {

  Serial.begin(115200);

  pinMode(SENSOR_PIN, INPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);

  digitalWrite(RED_LED, LOW);
  digitalWrite(GREEN_LED, LOW);

  // WiFi Connection
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected");
  Serial.println("IntelliShip Edge AI Device Ready");
}

// ================== MAIN LOOP ==================
void loop() {

  resetFeatures();

  unsigned long startTime = millis();
  unsigned long lastSampleTime = micros();

  // ===== Collect 2 seconds data =====
  while (millis() - startTime < WINDOW_DURATION_MS) {

    if (micros() - lastSampleTime >= SAMPLE_INTERVAL_US) {

      lastSampleTime += SAMPLE_INTERVAL_US;

      int signal = digitalRead(SENSOR_PIN);
      extractSample(signal);
    }
  }

  // Final pulse check
  if (currentHigh > 0) {
    pulseCount++;
    if (currentHigh > maxHighDuration)
      maxHighDuration = currentHigh;
  }

  float avgHigh = (pulseCount > 0) ? (float)totalHighTime / pulseCount : 0;

  float intensity = (avgHigh * 0.55f) + (risingEdges * 2.0f);
  String severity = classifySeverity(intensity);

  // ===== DEBUG OUTPUT =====
  Serial.println("\n===== Window Result =====");
  Serial.print("Pulse Count: "); Serial.println(pulseCount);
  Serial.print("Max High Duration: "); Serial.println(maxHighDuration);
  Serial.print("Total High Time: "); Serial.println(totalHighTime);
  Serial.print("Rising Edges: "); Serial.println(risingEdges);
  Serial.print("Avg High: "); Serial.println(avgHigh);
  Serial.print("Intensity: "); Serial.println(intensity);
  Serial.print("Severity: "); Serial.println(severity);
  Serial.println("==========================");

  // ===== LED + CLOUD ACTION =====
  if (severity == "HIGH") {

    digitalWrite(RED_LED, HIGH);
    digitalWrite(GREEN_LED, LOW);
  }
  else {

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

// ================== RESET FEATURES ==================
void resetFeatures() {
  pulseCount = 0;
  maxHighDuration = 0;
  totalHighTime = 0;
  risingEdges = 0;
  currentHigh = 0;
  lastSignal = 0;
}

// ================== FEATURE EXTRACTION ==================
void extractSample(int signal) {

  if (signal == 1 && lastSignal == 0)
    risingEdges++;

  if (signal == 1) {
    currentHigh++;
    totalHighTime++;
  }
  else {
    if (currentHigh > 0) {
      pulseCount++;
      if (currentHigh > maxHighDuration)
        maxHighDuration = currentHigh;
      currentHigh = 0;
    }
  }

  lastSignal = signal;
}

String classifySeverity(float intensity) {
  if (intensity >= 80.0f) {
    return "HIGH";
  }

  if (intensity >= 40.0f) {
    return "MEDIUM";
  }

  return "LOW";
}

// ================== CLOUD POST FUNCTION ==================
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

  if (WiFi.status() == WL_CONNECTED) {

    WiFiClientSecure client;
    client.setInsecure();   // Skip SSL validation (OK for demo)

    HTTPClient https;

    if (https.begin(client, serverURL)) {

      https.addHeader("Content-Type", "application/json");

      String jsonData = "{";
      jsonData += "\"shipment_id\":\"" + shipment_id + "\",";
      jsonData += "\"event_type\":\"VIBRATION\",";
      jsonData += "\"severity\":\"" + severity + "\",";
      jsonData += "\"intensity\":" + String(intensity) + ",";
      jsonData += "\"pulseCount\":" + String(pulseCount) + ",";
      jsonData += "\"maxHigh\":" + String(maxHighDuration) + ",";
      jsonData += "\"totalHigh\":" + String(totalHighTime) + ",";
      jsonData += "\"risingEdges\":" + String(risingEdges) + ",";
      jsonData += "\"avgHigh\":" + String(avgHigh);
      jsonData += "}";

      int httpResponseCode = https.POST(jsonData);

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);

      https.end();
    }
  }
}