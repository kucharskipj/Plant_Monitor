#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "time.hpp"
#include "config.hpp"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  // Initialize Serial and WiFI connections
  Serial.begin(115200);
  WiFi.begin(SSID_ROUTER, PASSWORD_ROUTER);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());

  // Configure and establish Firestore connection
  config.host = FIREBASE_HOST;
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  String content;
  FirebaseJson js;
  String documentPath = "Data";

  // Save current time in firestore timestamp format
  String rfctime;
  Time* current_time = new Time();
  rfctime = current_time->get_current_time();
  delete[] current_time;
  Serial.println(rfctime);

  // Read data from analog moisture sensor, take the average from 10 measurments
  pinMode(SENSOR_POWER, OUTPUT);
  digitalWrite(SENSOR_POWER, HIGH);
  delay(1000);
  double moisture = 0;
  for(int i = 0; i < 10; i++){
    moisture = moisture + analogRead(SENSOR_GPIO);
    delay(5);  
  }
  moisture = moisture / 10;
  digitalWrite(SENSOR_POWER, LOW);
  Serial.println("Moisture level:");
  Serial.println(moisture);

  // Prepare json with collected data
  js.set("fields/soil_moisture/doubleValue", moisture);
  js.set("fields/plant_name/stringValue", PLANT_NAME);
  js.set("fields/timestamp/timestampValue", rfctime);
  js.toString(content);

  // Send data to Firestore
  if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.c_str()))
  { Serial.println("Data sent to Firestore!"); } else{ Serial.println("Error while saving the data to Firestore: " + fbdo.errorReason()); }

  // Switch ESP32 to deep sleep mode for specific perion of time
  esp_sleep_enable_timer_wakeup((uint64_t) TIME_TO_SLEEP * uS_TO_S_FACTOR);
  Serial.println("Deep sleep start...");
  esp_deep_sleep_start();
}

void loop() {
}
