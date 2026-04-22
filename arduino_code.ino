#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

// ================== PIN CONFIG ==================
#define SENSOR_PIN 4
#define RED_LED 18
#define GREEN_LED 19

// ================== SAMPLING ==================
#define SAMPLE_INTERVAL_US 1000
#define WINDOW_DURATION_MS 2000

// ================== BATCH CONFIG ==================
#define BATCH_SIZE 20   // 🔥 number of readings before sending

// ================== WIFI ==================
const char* ssid = "Mahavir22";
const char* password = "mahavir2006";
const unsigned long WIFI_RETRY_DELAY_MS = 1000;
const unsigned long WIFI_CONNECT_WINDOW_MS = 5000;

// ================== SERVER ==================
const char* serverURL = "https://intelliship-project.onrender.com/api/events";

// 🔴 PUT REAL DEVICE ID
String deviceID = "ESP32_001";

// ================== FEATURE VARIABLES ==================
int pulseCount = 0;
int maxHighDuration = 0;
int totalHighTime = 0;
int risingEdges = 0;

int currentHigh = 0;
int lastSignal = 0;

// ================== BATCH VARIABLES ==================
int batchCounter = 0;
float batchMaxIntensity = 0;
float batchSumIntensity = 0;
String batchSeverity = "LOW";

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
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);

  Serial.println("Connecting to WiFi...");

  int attempt = 0;
  while (WiFi.status() != WL_CONNECTED) {
    attempt++;
    Serial.print("WiFi connect attempt #");
    Serial.println(attempt);

    WiFi.disconnect();
    delay(100);
    WiFi.begin(ssid, password);

    unsigned long connectStart = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - connectStart < WIFI_CONNECT_WINDOW_MS) {
      delay(500);
      Serial.print(".");
    }

    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("\nReconnecting...");
      delay(WIFI_RETRY_DELAY_MS);
    }
  }

  Serial.println("\nConnected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// ================== LOOP ==================
void loop() {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠ WiFi lost. Reconnecting...");
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

  Serial.println("\nReading:");
  Serial.println("Intensity: " + String(intensity));
  Serial.println("Severity: " + severity);

  // ===== LED =====
  if (severity == "HIGH") {
    digitalWrite(RED_LED, HIGH);
    digitalWrite(GREEN_LED, LOW);
  } else {
    digitalWrite(RED_LED, LOW);
    digitalWrite(GREEN_LED, HIGH);
  }

  // ===== BATCH LOGIC =====
  batchCounter++;
  batchSumIntensity += intensity;

  if (intensity > batchMaxIntensity) {
    batchMaxIntensity = intensity;
  }

  // Severity priority
  if (severity == "HIGH") {
    batchSeverity = "HIGH";
  } else if (severity == "MEDIUM" && batchSeverity != "HIGH") {
    batchSeverity = "MEDIUM";
  }

  // ===== SEND AFTER BATCH =====
  if (batchCounter >= BATCH_SIZE) {

    float avgBatch = batchSumIntensity / batchCounter;

    Serial.println("\n🚀 Sending Batch...");
    Serial.println("Max Intensity: " + String(batchMaxIntensity));
    Serial.println("Avg Intensity: " + String(avgBatch));
    Serial.println("Severity: " + batchSeverity);

    sendEventToCloud(
      deviceID,
      batchSeverity,
      batchMaxIntensity,
      avgBatch,
      batchCounter
    );

    // RESET BATCH
    batchCounter = 0;
    batchMaxIntensity = 0;
    batchSumIntensity = 0;
    batchSeverity = "LOW";
  }

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
  if (intensity >= 80) return "HIGH";
  if (intensity >= 40) return "MEDIUM";
  return "LOW";
}

// ================== SEND ==================
void sendEventToCloud(
  String device_id,
  String severity,
  float maxIntensity,
  float avgIntensity,
  int count
) {

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient https;

  if (https.begin(client, serverURL)) {

    https.addHeader("Content-Type", "application/json");

    String json = "{";
    json += "\"device_id\":\"" + device_id + "\",";
    json += "\"severity\":\"" + severity + "\",";
    json += "\"intensity\":" + String(maxIntensity) + ",";
    json += "\"avgHigh\":" + String(avgIntensity) + ",";
    json += "\"pulseCount\":" + String(count);
    json += "}";

    Serial.println("Sending JSON:");
    Serial.println(json);

    int httpCode = https.POST(json);

    Serial.print("HTTP Response: ");
    Serial.println(httpCode);

    String response = https.getString();
    Serial.println(response);

    https.end();
  }
}